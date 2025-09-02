import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Church, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Music, 
  UserCog, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const location = useLocation();
  const { user, church, logout } = useAuth();
  
  const adminMenuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { title: 'Volunteers', icon: Users, href: '/volunteers' },
    { title: 'Services', icon: Calendar, href: '/services' },
    { title: 'Song Library', icon: Music, href: '/songs' },
    { title: 'Teams & Roles', icon: UserCog, href: '/teams' },
    { title: 'Calendar', icon: Calendar, href: '/calendar' },
  ];

  const volunteerMenuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/volunteer' },
    { title: 'My Schedule', icon: Calendar, href: '/calendar' },
    { title: 'Profile', icon: User, href: '/profile' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : volunteerMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-3">
          <Church className="text-blue-600" size={32} />
          <div>
            <h1 className="text-lg font-bold">Planning</h1>
            <p className="text-xs text-gray-600">by Worship Warehouse</p>
          </div>
        </div>
        {church && (
          <div className="px-4 pb-3">
            <p className="text-sm font-medium text-gray-900">{church.name}</p>
            <p className="text-xs text-gray-600">{user?.role === 'admin' ? 'Administrator' : 'Volunteer'}</p>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.href}>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span className="font-medium">{user?.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}