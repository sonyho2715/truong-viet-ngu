import { redirect } from 'next/navigation';
import { getCurrentParent } from '@/lib/parent-auth';
import { db } from '@/lib/db';
import { Bell, Calendar, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const metadata = {
  title: 'Thông báo | Cổng Phụ Huynh',
};

// Priority levels: higher number = more important
const getPriorityConfig = (priority: number) => {
  if (priority >= 10) {
    return { label: 'Khẩn cấp', color: 'text-red-800', bgColor: 'bg-red-100', Icon: AlertTriangle };
  }
  if (priority >= 5) {
    return { label: 'Quan trọng', color: 'text-orange-800', bgColor: 'bg-orange-100', Icon: AlertCircle };
  }
  if (priority >= 1) {
    return { label: 'Bình thường', color: 'text-blue-800', bgColor: 'bg-blue-100', Icon: Info };
  }
  return { label: 'Thông tin', color: 'text-gray-800', bgColor: 'bg-gray-100', Icon: Bell };
};

export default async function ParentAnnouncementsPage() {
  const parent = await getCurrentParent();

  if (!parent) {
    redirect('/parent/login');
  }

  // Get active announcements
  const announcements = await db.announcement.findMany({
    where: { isActive: true },
    orderBy: [
      { priority: 'desc' }, // Higher priority first
      { startDate: 'desc' },
    ],
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Thông báo</h1>
        <p className="mt-2 text-gray-600">
          Các thông báo mới nhất từ nhà trường
        </p>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-gray-900">
            Chưa có thông báo nào
          </h3>
          <p className="mt-2 text-gray-600">
            Các thông báo mới sẽ xuất hiện tại đây
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => {
            const priorityConfig = getPriorityConfig(announcement.priority);
            const PriorityIcon = priorityConfig.Icon;

            return (
              <div
                key={announcement.id}
                className={`rounded-xl border bg-white overflow-hidden ${
                  announcement.priority >= 10
                    ? 'border-red-200'
                    : announcement.priority >= 5
                    ? 'border-orange-200'
                    : 'border-gray-200'
                }`}
              >
                {/* Priority Banner */}
                {announcement.priority >= 5 && (
                  <div className={`px-4 py-2 ${
                    announcement.priority >= 10 ? 'bg-red-50' : 'bg-orange-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <PriorityIcon className={`h-4 w-4 ${priorityConfig.color}`} />
                      <span className={`text-sm font-medium ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${priorityConfig.bgColor}`}>
                      <PriorityIcon className={`h-5 w-5 ${priorityConfig.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-bold text-gray-900">
                        {announcement.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={announcement.startDate.toISOString()}>
                          {announcement.startDate.toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="mt-3 text-gray-700 whitespace-pre-wrap">
                        {announcement.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
