"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapAndStoreProduct(productUrl: string){
  if(!productUrl) return;

  try {

    connectToDB();

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

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;

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