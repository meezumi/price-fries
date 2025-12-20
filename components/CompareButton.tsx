'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CompareButtonProps {
  productId: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({ productId }) => {
  const router = useRouter();
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonCount, setComparisonCount] = useState(0);

  useEffect(() => {
    // Check if product is in comparison list
    const comparingItems = JSON.parse(localStorage.getItem('comparing-products') || '[]');
    setIsComparing(comparingItems.includes(productId));
    setComparisonCount(comparingItems.length);
  }, [productId]);

  const handleToggleCompare = () => {
    const comparingItems = JSON.parse(localStorage.getItem('comparing-products') || '[]');

    if (isComparing) {
      // Remove from comparison
      const updated = comparingItems.filter((id: string) => id !== productId);
      localStorage.setItem('comparing-products', JSON.stringify(updated));
      setIsComparing(false);
    } else {
      // Add to comparison (max 4 products)
      if (comparingItems.length >= 4) {
        alert('You can compare up to 4 products at a time');
        return;
      }
      comparingItems.push(productId);
      localStorage.setItem('comparing-products', JSON.stringify(comparingItems));
      setIsComparing(true);
    }

    // Update count
    const updated = JSON.parse(localStorage.getItem('comparing-products') || '[]');
    setComparisonCount(updated.length);

    // Trigger storage event to update navbar
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <button
      onClick={handleToggleCompare}
      className={`text-sm font-semibold px-3 py-1 rounded transition ${
        isComparing
          ? 'bg-teal-500 text-white hover:bg-teal-600'
          : 'bg-gray-400 text-white hover:bg-gray-500'
      }`}
    >
      {isComparing ? 'Comparing' : 'Compare'}
    </button>
  );
};

export default CompareButton;
