import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminDataProvider } from "@/contexts/AdminDataContext";
import { PTSessionProvider } from "@/contexts/PTSessionContext";
import AdminLayout from "@/components/AdminLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PersonalTrainers from "./pages/admin/PersonalTrainers";
import ClientDetails from "./pages/admin/ClientDetails";
import PTSales from "./pages/admin/PTSales";
import CreatePT from "./pages/admin/CreatePT";
import PTStartSession from "./pages/PTStartSession";
import PTClientDetails from "./pages/pt/PTClientDetails";
import PTPayments from "./pages/pt/PTPayments";
import PTSessions from "./pages/pt/PTSessions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Route Component (only admin users)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin")
    return <Navigate to="/pt/client-details" replace />;
  return (
    <AdminDataProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminDataProvider>
  );
};

// PT Route Component (only PT users)
const PTRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "pt") return <Navigate to="/dashboard" replace />;
  return (
    <PTSessionProvider>
      {children}
    </PTSessionProvider>
  );
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  // Redirect based on user role
  if (user.role === "pt") {
    return <Navigate to="/pt/client-details" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* PT Routes */}
      <Route
        path="/pt/client-details"
        element={
          <PTRoute>
            <PTClientDetails />
          </PTRoute>
        }
      />
      <Route
        path="/pt/payments"
        element={
          <PTRoute>
            <PTPayments />
          </PTRoute>
        }
      />
      <Route
        path="/pt/sessions"
        element={
          <PTRoute>
            <PTSessions />
          </PTRoute>
        }
      />
      <Route
        path="/pt/start-session"
        element={
          <PTRoute>
            <PTStartSession />
          </PTRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/personal-trainers"
        element={
          <AdminRoute>
            <PersonalTrainers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/client-details"
        element={
          <AdminRoute>
            <ClientDetails />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pt-sales"
        element={
          <AdminRoute>
            <PTSales />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/create-pt"
        element={
          <AdminRoute>
            <CreatePT />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
