import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Product from '@/lib/models/product.model';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { getLowestPrice, getHighestPrice, getAveragePrice } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { RATE_LIMIT } from '@/lib/constants';
import { getRateLimitKey, checkRateLimit } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  // Rate limiting
  const key = getRateLimitKey(request);
  const { allowed } = checkRateLimit(key, RATE_LIMIT.SCRAPE);
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many scraping requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    await connectToDB();
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Product URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('amazon.')) {
        return NextResponse.json(
          { error: 'Invalid Amazon URL' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const scrapedProduct = await scrapeAmazonProduct(url);

    if (!scrapedProduct) {
      return NextResponse.json(
        { error: 'Failed to scrape product' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    let product = scrapedProduct;

    if (existingProduct) {
      const updatePriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatePriceHistory,
        lowestPrice: getLowestPrice(updatePriceHistory),
        highestPrice: getHighestPrice(updatePriceHistory),
        averagePrice: getAveragePrice(updatePriceHistory)
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product as any,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Product added successfully',
        product: newProduct 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape product' },
      { status: 500 }
    );
  }
}
