
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AuthPage } from "./components/auth/AuthPage";
import { useAuth } from "./hooks/useAuth";
import TimeTracking from "./pages/TimeTracking";
import JobSites from "./pages/JobSites";
import Workers from "./pages/Workers";
import Timesheets from "./pages/Timesheets";
import Dashboard from "./pages/Dashboard";
import AdminManagement from "./pages/AdminManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route 
          path="/" 
          element={
            <AuthGuard>
              <TimeTracking />
            </AuthGuard>
          } 
        />
        <Route 
          path="/job-sites" 
          element={
            <AuthGuard>
              <JobSites />
            </AuthGuard>
          } 
        />
        <Route 
          path="/workers" 
          element={
            <AuthGuard>
              <Workers />
            </AuthGuard>
          } 
        />
        <Route 
          path="/timesheets" 
          element={
            <AuthGuard>
              <Timesheets />
            </AuthGuard>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AuthGuard requireAdmin={true}>
              <AdminManagement />
            </AuthGuard>
          } 
        />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
