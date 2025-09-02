import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Music, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const AdminDashboard = () => {
  const { church } = useAuth();
  const { volunteers, services, songs } = useData();

  const upcomingServices = services.filter(service => 
    new Date(service.date) >= new Date()
  ).slice(0, 3);

  const stats = [
    {
      title: 'Total Volunteers',
      value: volunteers.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Upcoming Services',
      value: upcomingServices.length,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Songs in Library',
      value: songs.length,
      icon: Music,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Scheduling Conflicts',
      value: 2,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <DashboardHeader title={`Welcome back, ${church?.name}!`} />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Services */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Upcoming Services
                      </CardTitle>
                      <CardDescription>
                        Your next scheduled worship services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(service.date).toLocaleDateString()} at {service.time}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {service.blocks.length} blocks
                            </div>
                          </div>
                        ))}
                        {upcomingServices.length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            No upcoming services scheduled
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Latest updates and changes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm">Sarah Johnson added to Worship Team A</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm">Sunday Morning Service updated</p>
                            <p className="text-xs text-gray-500">4 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm">New song "Amazing Grace" added to library</p>
                            <p className="text-xs text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks to get you started
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                        <Users className="h-6 w-6 text-blue-600 mb-2" />
                        <h4 className="font-medium">Add Volunteer</h4>
                        <p className="text-sm text-gray-600">Add a new team member</p>
                      </button>
                      <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                        <Calendar className="h-6 w-6 text-green-600 mb-2" />
                        <h4 className="font-medium">Plan Service</h4>
                        <p className="text-sm text-gray-600">Create a new service</p>
                      </button>
                      <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                        <Music className="h-6 w-6 text-purple-600 mb-2" />
                        <h4 className="font-medium">Add Song</h4>
                        <p className="text-sm text-gray-600">Expand your song library</p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;