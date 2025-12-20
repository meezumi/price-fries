'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
}

export const DeleteProductButton: React.FC<DeleteProductButtonProps> = ({ 
  productId, 
  productTitle 
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('auth-token');
      
      const response = await fetch(`/api/products/${productId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        setShowConfirm(false);
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className='btn bg-red-500 hover:bg-red-600 w-fit px-8 py-3 flex items-center justify-center gap-3 disabled:opacity-50'
      >
        <span className='text-white text-2xl font-bold leading-none'>×</span>
        <span className='text-base text-white'>
          {isDeleting ? 'Deleting...' : 'Delete Product'}
        </span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full'>
            <h2 className='text-2xl font-bold mb-4'>Delete Product?</h2>
            <p className='text-gray-600 mb-2'>
              Are you sure you want to delete this product?
            </p>
            <p className='text-gray-700 font-semibold mb-6 break-words'>
              "{productTitle}"
            </p>
            <p className='text-red-600 text-sm mb-6'>
              This action cannot be undone. The product and all its data will be permanently removed from the database.
            </p>
            <div className='flex gap-4'>
              <button
                onClick={() => setShowConfirm(false)}
                className='flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-semibold'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold disabled:opacity-50'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>
            <div className='mb-4 flex justify-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                <span className='text-3xl text-green-500'>✓</span>
              </div>
            </div>
            <h2 className='text-2xl font-bold mb-2 text-green-600'>Success!</h2>
            <p className='text-gray-600'>
              Product deleted successfully. Redirecting to home...
            </p>
          </div>
        </div>
      )}
    </>
  );
};
