'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Calculate range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Calculate start and end of middle section
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if at the beginning or end
    if (currentPage <= 3) {
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="text-sm text-gray-500">
        Hiển thị {totalItems} mục
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Info */}
      <div className="text-sm text-gray-600">
        Hiển thị <span className="font-medium">{startItem}</span> -{' '}
        <span className="font-medium">{endItem}</span> trong{' '}
        <span className="font-medium">{totalItems}</span> mục
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1">
        {/* First page */}
        <Link
          href={createPageUrl(1)}
          className={`rounded-lg p-2 transition-colors ${
            currentPage === 1
              ? 'pointer-events-none text-gray-300'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-label="Trang đầu"
        >
          <ChevronsLeft className="h-5 w-5" />
        </Link>

        {/* Previous page */}
        <Link
          href={createPageUrl(Math.max(1, currentPage - 1))}
          className={`rounded-lg p-2 transition-colors ${
            currentPage === 1
              ? 'pointer-events-none text-gray-300'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-brand-gold text-brand-navy'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </Link>
          )
        )}

        {/* Next page */}
        <Link
          href={createPageUrl(Math.min(totalPages, currentPage + 1))}
          className={`rounded-lg p-2 transition-colors ${
            currentPage === totalPages
              ? 'pointer-events-none text-gray-300'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-label="Trang sau"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>

        {/* Last page */}
        <Link
          href={createPageUrl(totalPages)}
          className={`rounded-lg p-2 transition-colors ${
            currentPage === totalPages
              ? 'pointer-events-none text-gray-300'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-label="Trang cuối"
        >
          <ChevronsRight className="h-5 w-5" />
        </Link>
      </nav>
    </div>
  );
}
