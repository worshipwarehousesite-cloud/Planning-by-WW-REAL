import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

const Calendar = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <DashboardHeader title="Calendar" subtitle="View schedules and availability" />
          <main className="flex-1 overflow-auto p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Calendar View</h2>
              <p className="text-gray-600">This feature is coming soon!</p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Calendar;