import React, { useState, useEffect, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import PTLayout from "@/components/PTLayout";

interface TrainerSession {
  id: string;
  trainerName: string;
  avatar: string;
  sessionType: string;
  totalDays: string;
  status: "Session Started" | "Session Completed" | "Session Not Started";
  rating: number;
  reviews: number;
}

const PTStartSession = () => {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerSession | null>(
    null,
  );
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date("2024-04-11"),
    to: new Date("2024-04-24"),
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [otpTimer, setOtpTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const itemsPerPage = 9;

  const allTrainerSessions: TrainerSession[] = [
    {
      id: "1",
      trainerName: "Nina Elle (Nina ella)",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "P Training",
      totalDays: "9No",
      status: "Session Started",
      rating: 4.7,
      reviews: 312,
    },
    {
      id: "2",
      trainerName: "Nina Elle (Nina ella)",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "Consultation",
      totalDays: "5No",
      status: "Session Completed",
      rating: 4.7,
      reviews: 312,
    },
    {
      id: "3",
      trainerName: "Mike Johnson",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "Consultation",
      totalDays: "2No",
      status: "Session Not Started",
      rating: 4.5,
      reviews: 189,
    },
    {
      id: "4",
      trainerName: "Sarah Wilson",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "P Training",
      totalDays: "8No",
      status: "Session Started",
      rating: 4.8,
      reviews: 425,
    },
    {
      id: "5",
      trainerName: "Alex Thompson",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "P Training",
      totalDays: "8No",
      status: "Session Completed",
      rating: 4.6,
      reviews: 278,
    },
    {
      id: "6",
      trainerName: "Emma Davis",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "Consultation",
      totalDays: "1No",
      status: "Session Not Started",
      rating: 4.9,
      reviews: 156,
    },
    {
      id: "7",
      trainerName: "David Brown",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "Consultation",
      totalDays: "5No",
      status: "Session Completed",
      rating: 4.4,
      reviews: 203,
    },
    {
      id: "8",
      trainerName: "Lisa Garcia",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "P Training",
      totalDays: "6No",
      status: "Session Started",
      rating: 4.7,
      reviews: 334,
    },
    {
      id: "9",
      trainerName: "Ryan Miller",
      avatar:
        "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
      sessionType: "Consultation",
      totalDays: "5No",
      status: "Session Completed",
      rating: 4.3,
      reviews: 167,
    },
  ];

  // Filter and search functionality
  const filteredSessions = useMemo(() => {
    return allTrainerSessions.filter((session) => {
      const matchesSearch =
        session.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.sessionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSessions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSessions, currentPage]);

  // Timer effect for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  const handleStartSession = (trainer: TrainerSession) => {
    setSelectedTrainer(trainer);
    setShowOTPModal(true);
    setOtpTimer(60);
    setIsTimerActive(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleValidate = () => {
    const otp = otpValues.join("");
    if (otp.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    // Simulate OTP validation
    if (otp === "123456") {
      alert("Session started successfully!");
      setShowOTPModal(false);
      setOtpValues(["", "", "", "", "", ""]);
      setIsTimerActive(false);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const resendOTP = () => {
    if (otpTimer > 0) return;

    console.log("Resending OTP...");
    setOtpTimer(60);
    setIsTimerActive(true);
    setOtpValues(["", "", "", "", "", ""]);
    alert("New OTP sent to +1234567890");
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleAddClient = () => {
    setShowAddClient(true);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Session Started":
        return "text-orange-500 bg-orange-50";
      case "Session Completed":
        return "text-green-500 bg-green-50";
      case "Session Not Started":
        return "text-gray-500 bg-gray-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <PTLayout
      searchQuery={searchQuery}
      onSearchChange={handleSearch}
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusFilter}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      onAddClient={handleAddClient}
      showFilters={showFilters}
      onShowFiltersChange={setShowFilters}
      showDatePicker={showDatePicker}
      onShowDatePickerChange={setShowDatePicker}
      onResetFilters={resetFilters}
      statusOptions={[
        "all",
        "Session Started",
        "Session Completed",
        "Session Not Started",
      ]}
      searchPlaceholder="Search by trainer name, session type or ID..."
    >
      <div className="p-6">
        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedSessions.length} of {filteredSessions.length}{" "}
            sessions
            {searchQuery && ` for "${searchQuery}"`}
            {statusFilter !== "all" && ` with status "${statusFilter}"`}
          </div>
          {(searchQuery || statusFilter !== "all") && (
            <Button onClick={resetFilters} variant="outline" size="sm">
              Clear all filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {paginatedSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              {/* Trainer Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={session.avatar}
                    alt={session.trainerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {session.trainerName}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs text-gray-600">
                        {session.rating} ({session.reviews} Reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Session Type</span>
                  <span className="text-sm font-medium text-gray-900">
                    {session.sessionType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Days</span>
                  <span className="text-sm font-medium text-gray-900">
                    {session.totalDays}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-2">
                <Button
                  onClick={() => handleStartSession(session)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  START
                </Button>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(session.status)} border-0 text-xs`}
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No sessions found</div>
            <div className="text-gray-500 text-sm mb-4">
              Try adjusting your search or filter criteria
            </div>
            <Button onClick={resetFilters} variant="outline">
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400"
                  alt="Nina Elle"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">
                  Nina Elle (Nina ella)
                </span>
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOTPModal(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="text-center py-8">
            <DialogTitle className="text-lg font-semibold mb-2">
              Please enter the one time password to start the session
            </DialogTitle>
            <p className="text-sm text-gray-600 mb-8">
              a one time Password has been sent to +1234567890
            </p>

            {/* OTP Input */}
            <div className="flex justify-center space-x-3 mb-8">
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold border-gray-300"
                />
              ))}
            </div>

            <Button
              onClick={handleValidate}
              className="w-32 bg-gray-700 hover:bg-gray-800 text-white mb-4"
            >
              Validate
            </Button>

            <div className="text-center">
              <button
                onClick={resendOTP}
                disabled={otpTimer > 0}
                className={cn(
                  "text-sm transition-colors",
                  otpTimer > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-600",
                )}
              >
                Resend One Time Password{" "}
                <span className="text-blue-400">
                  {otpTimer > 0 ? `${otpTimer}sec` : ""}
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Client Modal */}
      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input placeholder="Enter client name" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder="Enter email address"
                type="email"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="Enter phone number" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Session Type</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p-training">P Training</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddClient(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert("Client added successfully!");
                  setShowAddClient(false);
                }}
                className="flex-1"
              >
                Add Client
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PTLayout>
  );
};

export default PTStartSession;
