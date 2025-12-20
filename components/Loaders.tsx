'use client'
import React from 'react'
import './loaders.css'

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const Spinner: React.FC<LoaderProps> = ({ size = 'medium', text }) => {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="loader-container">
      <div className={`spinner ${sizeClass}`} />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-line skeleton-line-short" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line-short" />
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 12 }) => {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-16">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="skeleton-line skeleton-line-short mb-2" style={{ width: '40%' }} />
            <div className="skeleton-line" style={{ width: '60%' }} />
          </div>
        ))}
      </div>
      
      {/* Products Grid Skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="skeleton-line skeleton-line-short mb-6" style={{ width: '30%' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="page-loader">
      <Spinner size="large" text="Loading..." />
    </div>
  );
};

export const ButtonLoader: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="spinner-small" />
      <span>Processing...</span>
    </div>
  );
};
