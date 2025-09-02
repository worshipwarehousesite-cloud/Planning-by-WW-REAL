import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/AdminDashboard";
import VolunteerDashboard from "@/pages/VolunteerDashboard";
import ServicePlanning from "@/pages/ServicePlanning";
import SongLibrary from "@/pages/SongLibrary";
import VolunteerManagement from "@/pages/VolunteerManagement";
import TeamManagement from "@/pages/TeamManagement";
import Calendar from "@/pages/Calendar";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/volunteer" element={<VolunteerDashboard />} />
                <Route path="/services" element={<ServicePlanning />} />
                <Route path="/songs" element={<SongLibrary />} />
                <Route path="/volunteers" element={<VolunteerManagement />} />
                <Route path="/teams" element={<TeamManagement />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;