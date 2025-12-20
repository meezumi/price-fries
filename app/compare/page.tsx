'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PageLoader } from '@/components/Loaders'

interface Product {
  _id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  category: string;
  url: string;
  description?: string;
  discountPercentage?: number;
}

const ComparePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const comparingItems = JSON.parse(
          localStorage.getItem('comparing-products') || '[]'
        );

        if (comparingItems.length === 0) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/products/get-by-ids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: comparingItems })
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleRemoveProduct = (productId: string) => {
    const comparingItems = JSON.parse(
      localStorage.getItem('comparing-products') || '[]'
    );
    const updated = comparingItems.filter((id: string) => id !== productId);
    localStorage.setItem('comparing-products', JSON.stringify(updated));
    setProducts(products.filter(p => p._id !== productId));
  };

  const handleClearAll = () => {
    localStorage.removeItem('comparing-products');
    setProducts([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">
              Price<span className="text-teal-500">Fries</span> Comparison
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              No products selected for comparison
            </p>
            <Link
              href="/"
              className="inline-block bg-teal-500 text-white font-semibold px-6 py-3 rounded hover:bg-teal-600 transition"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Price<span className="text-teal-500">Fries</span> Comparison
          </h1>
          <p className="text-gray-600">
            Comparing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              href="/"
              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Back to Shopping
            </Link>
            {products.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Product</th>
                {products.map(product => (
                  <th key={product._id} className="px-6 py-4 text-center font-semibold text-gray-700 min-w-64">
                    {product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Image Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Image</td>
                {products.map(product => (
                  <td key={`${product._id}-image`} className="px-6 py-4 text-center">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={150}
                      height={150}
                      className="mx-auto"
                    />
                  </td>
                ))}
              </tr>

              {/* Current Price Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Current Price</td>
                {products.map(product => (
                  <td key={`${product._id}-price`} className="px-6 py-4 text-center">
                    <span className="text-2xl font-bold text-teal-500">
                      {product.currency}{product.currentPrice}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Original Price Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Original Price</td>
                {products.map(product => (
                  <td key={`${product._id}-original`} className="px-6 py-4 text-center">
                    <span className="text-gray-500 line-through">
                      {product.currency}{product.originalPrice}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Discount Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Discount</td>
                {products.map(product => (
                  <td key={`${product._id}-discount`} className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded font-semibold ${
                      (product.discountPercentage || 0) > 30
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {product.discountPercentage || 0}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Category Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Category</td>
                {products.map(product => (
                  <td key={`${product._id}-category`} className="px-6 py-4 text-center capitalize">
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Link Row */}
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">View Product</td>
                {products.map(product => (
                  <td key={`${product._id}-link`} className="px-6 py-4 text-center">
                    <Link
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-500 hover:text-teal-600 font-semibold"
                    >
                      Visit Amazon
                    </Link>
                  </td>
                ))}
              </tr>

              {/* Remove Row */}
              <tr>
                <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50">Action</td>
                {products.map(product => (
                  <td key={`${product._id}-action`} className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleRemoveProduct(product._id)}
                      className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
