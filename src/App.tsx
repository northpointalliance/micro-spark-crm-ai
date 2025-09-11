
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AuthPage } from "./components/auth/AuthPage";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Messages from "./pages/Messages";
import Email from "./pages/Email";
import Insights from "./pages/Insights";
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
              <Dashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/contacts" 
          element={
            <AuthGuard>
              <Contacts />
            </AuthGuard>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <AuthGuard>
              <Messages />
            </AuthGuard>
          } 
        />
        <Route 
          path="/email" 
          element={
            <AuthGuard>
              <Email />
            </AuthGuard>
          } 
        />
        <Route 
          path="/insights" 
          element={
            <AuthGuard>
              <Insights />
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
