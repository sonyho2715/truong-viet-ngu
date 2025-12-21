import { redirect } from 'next/navigation';
import { getCurrentParent } from '@/lib/parent-auth';
import { ParentSidebar } from '@/components/parent/ParentSidebar';
import { ParentHeader } from '@/components/parent/ParentHeader';

export default async function ParentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const parent = await getCurrentParent();

  if (!parent) {
    redirect('/parent/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ParentSidebar parent={parent} />
      <div className="lg:pl-64">
        <ParentHeader parent={parent} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
