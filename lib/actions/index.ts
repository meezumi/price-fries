"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { UserEmail } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapAndStoreProduct(productUrl: string){
  if(!productUrl) return;

  try {
    connectToDB();

    // Validate URL
    const urlObj = new URL(productUrl);
    if (!urlObj.hostname.includes('amazon.')) {
      throw new Error('Invalid Amazon URL');
    }

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if(!scrapedProduct) return;
    // we have got the scraped product data, now we need to store it.

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    // find the product that matches the scraped url, it it exists.

    // if it exists, update its price history, else make first entry for it.
    if (existingProduct) {
      const updatePriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatePriceHistory,
        lowestPrice: getLowestPrice(updatePriceHistory),
        highestPrice: getHighestPrice(updatePriceHistory),
        averagePrice: getAveragePrice(updatePriceHistory)
      }
    }

    const newProduct = await Product.findOneAndUpdate({
      url: scrapedProduct.url}, // what is to be updated(identified by)
      product, // what part of it to be updated (the entire product here)
      { upsert: true, new: true} // if not in db, we create one
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts(
  page: number = 1, 
  limit: number = 12,
  sortBy: 'newest' | 'price-low' | 'price-high' | 'discount' = 'newest'
) {
  try {
    connectToDB();

    // Validate pagination params
    const pageNum = Math.max(1, page);
    const limitNum = Math.min(limit, 100);
    const skip = (pageNum - 1) * limitNum;

    // Determine sort order
    let sortOrder: any = { createdAt: -1 }; // default newest
    
    if (sortBy === 'price-low') {
      sortOrder = { currentPrice: 1 }; // ascending
    } else if (sortBy === 'price-high') {
      sortOrder = { currentPrice: -1 }; // descending
    } else if (sortBy === 'discount') {
      sortOrder = { discountPercentage: -1 }; // highest discount first
    }

    const products = await Product.find()
      .skip(skip)
      .limit(limitNum)
      .sort(sortOrder);

    const total = await Product.countDocuments();

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };

  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;
    
    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;

  } catch (error) {
    console.log(error);
  }

}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if(!product) return;

    const userExists = product.users.some((user: any) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, 'WELCOME');

      await sendEmail(emailContent, [userEmail]);
    }
    
  } catch (error) {
    console.log(error);
  }
}