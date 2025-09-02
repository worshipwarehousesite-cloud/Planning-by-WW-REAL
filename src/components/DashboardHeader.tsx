import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  subtitle, 
  actions 
}) => {
  return (
    <header className="flex items-center justify-between sticky top-0 z-10 gap-4 border-b bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
};