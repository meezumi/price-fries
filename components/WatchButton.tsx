'use client'

import React, { useState, useEffect } from 'react'

interface WatchButtonProps {
  productId: string;
  onWatchChange?: () => void;
}

const WatchButton: React.FC<WatchButtonProps> = ({ productId, onWatchChange }) => {
  const [isWatched, setIsWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and if product is watched
    const checkWatchStatus = async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const response = await fetch('/api/user/watched-products', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const watched = data.watchedProducts.some((id: string) => id === productId || id === productId.toString());
          setIsWatched(watched);
        }
      } catch (error) {
        console.error('Failed to check watch status:', error);
      }
    };

    checkWatchStatus();
  }, [productId]);

  const handleToggleWatch = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert('Please login to mark products as watched');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/watched-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          action: isWatched ? 'unwatch' : 'watch'
        })
      });

      if (response.ok) {
        setIsWatched(!isWatched);
        if (onWatchChange) {
          onWatchChange();
        }
      }
    } catch (error) {
      console.error('Failed to update watch status:', error);
      alert('Failed to update watch status');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleToggleWatch}
      disabled={isLoading}
      className={`text-sm font-semibold px-3 py-1 rounded transition ${
        isWatched
          ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } disabled:opacity-50`}
    >
      {isWatched ? '✓ Watched' : 'Mark Watched'}
    </button>
  );
};

export default WatchButton;
