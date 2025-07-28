import React, { useState, useEffect, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react";
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
import { usePTSession, TrainerSession } from "@/contexts/PTSessionContext";
import { smsService } from "@/services/smsService";
import { useToast } from "@/hooks/useToast";

const PTStartSession = () => {
  const {
    trainerSessions,
    addClient,
    startSession,
    endSession,
    sendOTP,
    verifyOTP,
    resendOTP,
    currentOTPSession,
    refreshData,
  } = usePTSession();

  const { toast } = useToast();
  
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerSession | null>(null);
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
  const [otpLoading, setOtpLoading] = useState(false);
  const [sessionAction, setSessionAction] = useState<"start" | "end" | null>(null);
  
  // Add Client Form State
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    sessionType: "P Training",
  });

  const itemsPerPage = 9;

  // Filter and search functionality
  const filteredSessions = useMemo(() => {
    let filtered = trainerSessions;
    
    if (searchQuery) {
      filtered = filtered.filter((session) => {
        return (
          session.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.sessionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }

    return filtered;
  }, [trainerSessions, searchQuery, statusFilter]);

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

  const handleStartSession = async (trainer: TrainerSession) => {
    if (trainer.status === "Session Started") {
      toast.error("Session is already started!");
      return;
    }

    setSelectedTrainer(trainer);
    setSessionAction("start");
    setShowOTPModal(true);
    setOtpTimer(60);
    setIsTimerActive(true);
    setOtpLoading(true);

    // Send OTP
    try {
      const result = await sendOTP(trainer.clientPhone || "+1234567890", trainer.id);
      if (result.success) {
        toast.success(`OTP sent to ${smsService.getDisplayPhoneNumber(trainer.clientPhone || "+1234567890")}`);
        console.log("Development OTP:", result.otp); // For development testing
      } else {
        toast.error(result.message);
        setShowOTPModal(false);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
      setShowOTPModal(false);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleEndSession = async (trainer: TrainerSession) => {
    if (trainer.status !== "Session Started") {
      toast.error("No active session to end!");
      return;
    }

    try {
      const success = await endSession(trainer.id);
      if (success) {
        toast.success("Session ended successfully!");

        // Send session completion notification
        if (trainer.clientPhone) {
          const duration = trainer.startTime
            ? Math.floor((new Date().getTime() - trainer.startTime.getTime()) / 60000)
            : 60;
          await smsService.sendSessionCompletionNotification(
            trainer.clientPhone,
            trainer.trainerName,
            duration
          );
        }

        refreshData();
      } else {
        toast.error("Failed to end session");
      }
    } catch (error) {
      toast.error("Failed to end session");
      console.error("Error ending session:", error);
    }
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

  const handleValidate = async () => {
    const otp = otpValues.join("");
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (!selectedTrainer) {
      toast.error("No session selected");
      return;
    }

    setOtpLoading(true);
    
    try {
      const isValid = await verifyOTP(selectedTrainer.id, otp);
      
      if (isValid) {
        if (sessionAction === "start") {
          const success = await startSession(selectedTrainer.id, selectedTrainer.clientPhone || "");
          if (success) {
            toast.success("Session started successfully!");
            // Send session start notification
            if (selectedTrainer.clientPhone) {
              await smsService.sendSessionStartNotification(
                selectedTrainer.clientPhone,
                selectedTrainer.trainerName
              );
            }
          } else {
            toast.error("Failed to start session");
          }
        } else if (sessionAction === "end") {
          const success = await endSession(selectedTrainer.id);
          if (success) {
            toast.success("Session ended successfully!");
            // Send session completion notification
            if (selectedTrainer.clientPhone) {
              const duration = selectedTrainer.startTime 
                ? Math.floor((new Date().getTime() - selectedTrainer.startTime.getTime()) / 60000)
                : 60;
              await smsService.sendSessionCompletionNotification(
                selectedTrainer.clientPhone,
                selectedTrainer.trainerName,
                duration
              );
            }
          } else {
            toast.error("Failed to end session");
          }
        }
        
        setShowOTPModal(false);
        setOtpValues(["", "", "", "", "", ""]);
        setIsTimerActive(false);
        setSessionAction(null);
        refreshData();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOTPHandler = async () => {
    if (otpTimer > 0 || !selectedTrainer) return;

    setOtpLoading(true);
    try {
      const success = await resendOTP(selectedTrainer.id);
      if (success) {
        setOtpTimer(60);
        setIsTimerActive(true);
        setOtpValues(["", "", "", "", "", ""]);
        toast.success("New OTP sent!");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
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

  const handleClientFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientForm.name || !clientForm.email || !clientForm.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!smsService.isValidPhoneNumber(clientForm.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const success = await addClient(clientForm);
      if (success) {
        toast.success("Client added successfully!");
        setShowAddClient(false);
        setClientForm({ name: "", email: "", phone: "", sessionType: "P Training" });
        refreshData();
      } else {
        toast.error("Failed to add client");
      }
    } catch (error) {
      toast.error("Failed to add client");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Session Started":
        return "text-orange-500 bg-orange-50 border-orange-200";
      case "Session Completed":
        return "text-green-500 bg-green-50 border-green-200";
      case "Session Not Started":
        return "text-gray-500 bg-gray-50 border-gray-200";
      default:
        return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  const formatSessionDuration = (session: TrainerSession) => {
    if (session.status === "Session Started" && session.startTime) {
      const now = new Date();
      const diff = Math.floor((now.getTime() - session.startTime.getTime()) / 60000);
      return `${diff} min`;
    } else if (session.duration) {
      return `${session.duration} min`;
    }
    return "";
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
            Showing {paginatedSessions.length} of {filteredSessions.length} sessions
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
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
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
                <div className="flex items-center space-x-2">
                  {session.status === "Session Started" && (
                    <div className="flex items-center text-xs text-orange-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatSessionDuration(session)}
                    </div>
                  )}
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
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
                {session.clientPhone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Client Phone</span>
                    <span className="text-sm font-medium text-gray-900">
                      {smsService.getDisplayPhoneNumber(session.clientPhone)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleStartSession(session)}
                    disabled={session.status === "Session Started" || session.status === "Session Completed"}
                    className={cn(
                      "flex-1",
                      session.status === "Session Not Started"
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : session.status === "Session Started"
                        ? "bg-orange-500 text-white cursor-not-allowed"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    )}
                  >
                    {session.status === "Session Started" ? "RUNNING" : "START"}
                  </Button>
                  <Button
                    onClick={() => handleEndSession(session)}
                    disabled={session.status === "Session Not Started" || session.status === "Session Completed"}
                    className={cn(
                      "flex-1",
                      session.status === "Session Started"
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : session.status === "Session Completed"
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    {session.status === "Session Completed" ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        COMPLETED
                      </>
                    ) : (
                      "END"
                    )}
                  </Button>
                </div>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(session.status)} border text-xs`}
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
                  src={selectedTrainer?.avatar || ""}
                  alt={selectedTrainer?.trainerName || ""}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">
                  {selectedTrainer?.trainerName}
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
              Please enter the one time password to {sessionAction} the session
            </DialogTitle>
            <p className="text-sm text-gray-600 mb-8">
              A one time password has been sent to{" "}
              {selectedTrainer?.clientPhone 
                ? smsService.getDisplayPhoneNumber(selectedTrainer.clientPhone)
                : "+1234567890"
              }
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
                  disabled={otpLoading}
                />
              ))}
            </div>

            <Button
              onClick={handleValidate}
              disabled={otpLoading || otpValues.join("").length !== 6}
              className="w-32 bg-gray-700 hover:bg-gray-800 text-white mb-4"
            >
              {otpLoading ? "Validating..." : "Validate"}
            </Button>

            <div className="text-center">
              <button
                onClick={resendOTPHandler}
                disabled={otpTimer > 0 || otpLoading}
                className={cn(
                  "text-sm transition-colors",
                  otpTimer > 0 || otpLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-600",
                )}
              >
                {otpLoading ? "Sending..." : "Resend One Time Password"}{" "}
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
          <form onSubmit={handleClientFormSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client Name *</label>
              <Input
                placeholder="Enter client name"
                value={clientForm.name}
                onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input
                placeholder="Enter email address"
                type="email"
                value={clientForm.email}
                onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number *</label>
              <Input
                placeholder="Enter phone number"
                value={clientForm.phone}
                onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: (555) 123-4567 or +1 555 123 4567
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Session Type</label>
              <Select
                value={clientForm.sessionType}
                onValueChange={(value) => setClientForm(prev => ({ ...prev, sessionType: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P Training">P Training</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Group Training">Group Training</SelectItem>
                  <SelectItem value="Nutrition Coaching">Nutrition Coaching</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddClient(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                Add Client
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PTLayout>
  );
};

export default PTStartSession;
