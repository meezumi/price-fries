'use client'

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SortBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentSort = searchParams.get('sort') || 'newest';

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
  ];

  const handleSortChange = (sort: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', sort);
      params.set('page', '1');
      router.push(`?${params.toString()}`, { scroll: false } as any);
    });
  };

  return (
    <div className="mb-6 flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-gray-700">Sort by:</span>
      <div className="flex gap-2 flex-wrap">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            disabled={isPending}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              currentSort === option.value
                ? 'bg-teal-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isPending && currentSort === option.value ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              option.label
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortBar;


