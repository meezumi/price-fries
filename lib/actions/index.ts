"use server"

import { scrapeAmazonProduct } from "../scraper";

export async function scrapAndStoreProduct(productUrl: string){
  if(!productUrl) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if(!scrapedProduct) return;
    // we have got the scraped product data, now we need to store it.


  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}