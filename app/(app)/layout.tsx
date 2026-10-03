'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, setCurrentUserRole } = useApp();

  // Automatic role synchronization based on active route
  useEffect(() => {
    if (pathname.startsWith('/lecturer') && currentUser.role !== 'lecturer') {
      setCurrentUserRole('lecturer');
    } else if (pathname.startsWith('/student') && currentUser.role !== 'student') {
      setCurrentUserRole('student');
    } else if (pathname.startsWith('/adviser') && currentUser.role !== 'adviser') {
      setCurrentUserRole('adviser');
    } else if (pathname.startsWith('/admin') && currentUser.role !== 'hod' && currentUser.role !== 'admin') {
      setCurrentUserRole('hod');
    }
  }, [pathname, currentUser.role, setCurrentUserRole]);

  return (
    <div className="flex min-h-screen bg-nacos-off-white font-sans">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppTopBar />
        <main className="flex-1 p-5 md:p-7 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
