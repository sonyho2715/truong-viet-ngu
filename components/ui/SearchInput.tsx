'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebouncedCallback } from '@/lib/hooks';

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
}

export function SearchInput({
  placeholder = 'Tìm kiếm...',
  paramName = 'search',
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get(paramName) || '';
  const [value, setValue] = useState(currentSearch);

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (term) {
        params.set(paramName, term);
      } else {
        params.delete(paramName);
      }

      // Reset to page 1 when searching
      params.delete('page');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams, paramName]
  );

  const debouncedSearch = useDebouncedCallback(handleSearch, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    handleSearch('');
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        ) : (
          <Search className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
