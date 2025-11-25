import { Skeleton } from '@/components/ui/Skeleton';

export default function MaterialsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 bg-gradient-to-br from-brand-navy to-brand-navy/80 p-6">
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-24 rounded-full bg-brand-gold/30" />
                <Skeleton className="h-6 w-20 rounded-full bg-white/30" />
              </div>
              <Skeleton className="mt-4 h-7 w-3/4 bg-white/30" />
            </div>
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
