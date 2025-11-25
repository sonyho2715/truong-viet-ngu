import { Skeleton } from '@/components/ui/Skeleton';

export default function TeachersLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border-2 border-gray-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
