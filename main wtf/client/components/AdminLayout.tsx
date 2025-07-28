import React, { useState, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import {
  Users,
  UserCheck,
  TrendingUp,
  UserPlus,
  LogOut,
  Menu,
  X,
  Edit3,
  Check,
  User,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Create a context for the toast functionality
const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const useAdminToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within AdminLayout");
  }
  return context;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const toast = useToast();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      id: "personal-trainers",
      label: "Personal Trainers",
      icon: Users,
      path: "/admin/personal-trainers",
      active: location.pathname === "/admin/personal-trainers",
    },
    {
      id: "client-details",
      label: "Client Details",
      icon: UserCheck,
      path: "/admin/client-details",
      active: location.pathname === "/admin/client-details",
    },
    {
      id: "pt-sales",
      label: "PT Sales",
      icon: TrendingUp,
      path: "/admin/pt-sales",
      active: location.pathname === "/admin/pt-sales",
    },
    {
      id: "create-pt",
      label: "Create PT",
      icon: UserPlus,
      path: "/admin/create-pt",
      active: location.pathname === "/admin/create-pt",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F396c5c8a5717496c9b3846e1a2b79ba1?format=webp&width=800"
              alt="WTF - Win The Fitness"
              className="h-12 w-auto"
            />
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer to push profile to bottom */}
        <div className="flex-1" />

        {/* User Section - Moved to Bottom */}
        <div className="border-t border-gray-200 mt-[156px] pt-[200px] px-4 pb-4">
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                {editingProfile ? (
                  <div className="space-y-2">
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="h-8 text-sm"
                      placeholder="Name"
                    />
                    <Input
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="h-8 text-sm"
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <ToastContext.Provider value={toast}>
            {children}
          </ToastContext.Provider>
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default AdminLayout;
