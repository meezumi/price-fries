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
