import { AnnouncementListSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function AnnouncementsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>

      {/* List */}
      <AnnouncementListSkeleton count={5} />
    </div>
  );
}
