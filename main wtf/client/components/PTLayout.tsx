import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PTLayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  onAddClient: () => void;
  showFilters: boolean;
  onShowFiltersChange: (show: boolean) => void;
  showDatePicker: boolean;
  onShowDatePickerChange: (show: boolean) => void;
  onResetFilters: () => void;
  statusOptions?: string[];
  searchPlaceholder?: string;
}

const PTLayout: React.FC<PTLayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  onAddClient,
  showFilters,
  onShowFiltersChange,
  showDatePicker,
  onShowDatePickerChange,
  onResetFilters,
  statusOptions = ["all", "Active", "Inactive", "Pending"],
  searchPlaceholder = "Search by ID, name or others...",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F396c5c8a5717496c9b3846e1a2b79ba1?format=webp&width=800"
              alt="WTF - Win The Fitness"
              className="h-10 w-auto"
            />
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-80 bg-gray-50 border-gray-200"
              />
            </div>

            <Popover open={showFilters} onOpenChange={onShowFiltersChange}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="ml-2 h-4 text-xs">
                      1
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Status Filter</label>
                    <Select
                      value={statusFilter}
                      onValueChange={onStatusFilterChange}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === "all" ? "All Statuses" : option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={onResetFilters}
                      variant="outline"
                      size="sm"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={() => onShowFiltersChange(false)}
                      size="sm"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              open={showDatePicker}
              onOpenChange={onShowDatePickerChange}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-gray-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                    : "Select dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    onDateRangeChange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button
              onClick={onAddClient}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wide px-3 py-2">
                Menu
              </div>
              <Link
                to="/pt/client-details"
                className={cn(
                  "px-3 py-2 text-sm block rounded-md font-medium transition-colors",
                  isActive("/pt/client-details")
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                Client Details
              </Link>
              <Link
                to="/pt/payments"
                className={cn(
                  "px-3 py-2 text-sm block rounded-md font-medium transition-colors",
                  isActive("/pt/payments")
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                Payments
              </Link>
              <Link
                to="/pt/sessions"
                className={cn(
                  "px-3 py-2 text-sm block rounded-md font-medium transition-colors",
                  isActive("/pt/sessions")
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                Sessions
              </Link>
              <Link
                to="/pt/start-session"
                className={cn(
                  "px-3 py-2 text-sm block rounded-md font-medium transition-colors",
                  isActive("/pt/start-session")
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                Start Session
              </Link>
            </nav>
          </div>

          {/* Personal Trainer Section */}
          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.name?.charAt(0) || "PT"}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name || "Personal Trainer"}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default PTLayout;
