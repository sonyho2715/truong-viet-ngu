import { redirect } from 'next/navigation';
import { getCurrentTeacher } from '@/lib/teacher-auth';
import { TeacherSidebar } from '@/components/teacher/TeacherSidebar';
import { TeacherHeader } from '@/components/teacher/TeacherHeader';

export default async function TeacherPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const teacher = await getCurrentTeacher();

  if (!teacher) {
    redirect('/teacher/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar teacher={teacher} />
      <div className="lg:pl-64">
        <TeacherHeader teacher={teacher} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
