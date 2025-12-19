'use client'
import React from 'react'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, baseUrl }) => {
  const getPageUrl = (page: number) => `${baseUrl}?page=${page}`;
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <Link key="1" href={getPageUrl(1)} className="pagination-btn">
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </Link>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <Link key={totalPages} href={getPageUrl(totalPages)} className="pagination-btn">
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} className="pagination-btn pagination-arrow">
          ← Previous
        </Link>
      )}

      <div className="pagination-numbers">
        {renderPageNumbers()}
      </div>

      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} className="pagination-btn pagination-arrow">
          Next →
        </Link>
      )}
    </div>
  );
};
