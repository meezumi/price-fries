import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice, parseNumberFromSelector } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return; 

  // brightdata proxy configuration 
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);

  // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_cd149885-zone-pricefries:icj2vo6gshhq -k "http://geo.brdtest.com/mygeo.json"

  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    // here we will fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
    );
    
    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );

    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}';

    const imageUrls = Object.keys(JSON.parse(images))

    const currency = extractCurrency($('.a-price-symbol'))

    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
    // removing everything that is not a percentage

    // console.log({title, currentPrice, originalPrice, outOfStock, imageUrls, currency, discountRate})

    const stars = $('#acrPopover a > span').first().text();

    // const stars = parseNumberFromSelector($, '#acrPopover a > span');

    const reviewsCount = $('#acrCustomerReviewText').first().text();

    const description = extractDescription($)

    // constructing data object with scraped information
    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: 'category',
      reviewsCount: 154,
      stars: Number(stars),
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice)
    }

    // console.log(data);
    return data;

  } catch(error: any) {
    throw new Error(`failed to scrape product: ${error.message}`)
  }

}