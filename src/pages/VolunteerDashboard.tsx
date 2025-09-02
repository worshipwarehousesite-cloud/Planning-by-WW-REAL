import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Music, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { services, volunteers } = useData();

  const volunteer = volunteers.find(v => v.email === user?.email);
  
  const myUpcomingServices = services.filter(service => 
    service.blocks.some(block => 
      block.assignedVolunteers.some(av => av.volunteerId === volunteer?.id)
    ) && new Date(service.date) >= new Date()
  ).slice(0, 5);

  const myAssignments = myUpcomingServices.flatMap(service =>
    service.blocks
      .filter(block => 
        block.assignedVolunteers.some(av => av.volunteerId === volunteer?.id)
      )
      .map(block => ({
        serviceId: service.id,
        serviceName: service.name,
        serviceDate: service.date,
        serviceTime: service.time,
        blockTitle: block.title,
        role: block.assignedVolunteers.find(av => av.volunteerId === volunteer?.id)?.role
      }))
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <DashboardHeader title={`Welcome, ${user?.name}!`} subtitle="Your volunteer dashboard" />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Upcoming Services
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{myUpcomingServices.length}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        My Roles
                      </CardTitle>
                      <Music className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{volunteer?.roles.length || 0}</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Blockout Dates
                      </CardTitle>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{volunteer?.blockoutDates.length || 0}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Schedule */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        My Upcoming Schedule
                      </CardTitle>
                      <CardDescription>
                        Your assigned services and roles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {myAssignments.map((assignment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{assignment.serviceName}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(assignment.serviceDate).toLocaleDateString()} at {assignment.serviceTime}
                              </p>
                              <p className="text-sm text-blue-600">{assignment.blockTitle}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {assignment.role}
                              </span>
                            </div>
                          </div>
                        ))}
                        {myAssignments.length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            No upcoming assignments
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* My Profile Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="h-5 w-5 text-purple-600" />
                        My Profile
                      </CardTitle>
                      <CardDescription>
                        Your roles and team assignments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">My Roles</h4>
                          <div className="flex flex-wrap gap-2">
                            {volunteer?.roles.map((role) => (
                              <span
                                key={role}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">My Teams</h4>
                          <div className="flex flex-wrap gap-2">
                            {volunteer?.teams.map((team) => (
                              <span
                                key={team}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {team}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Contact Info</h4>
                          <p className="text-sm text-gray-600">{volunteer?.email}</p>
                          {volunteer?.phone && (
                            <p className="text-sm text-gray-600">{volunteer.phone}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default VolunteerDashboard;