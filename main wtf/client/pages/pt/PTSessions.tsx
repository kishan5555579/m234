import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PTLayout from "@/components/PTLayout";

interface SessionDetail {
  id: string;
  clientId: string;
  sessionDate: string;
  fullName: string;
  contactNumber: string;
  sessionType: string;
  totalDuration: number;
  remainingDays: number;
  status: "Booked" | "Confirmed" | "Pending";
}

const PTSessions = () => {
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
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const itemsPerPage = 10;

  const allSessions: SessionDetail[] = [
    {
      id: "1",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      sessionType: "P Training",
      totalDuration: 900,
      remainingDays: 500,
      status: "Booked",
    },
    {
      id: "2",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      sessionType: "P Training",
      totalDuration: 900,
      remainingDays: 500,
      status: "Confirmed",
    },
    {
      id: "3",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 1000,
      remainingDays: 500,
      status: "Confirmed",
    },
    {
      id: "4",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 900,
      remainingDays: 500,
      status: "Confirmed",
    },
    {
      id: "5",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 1000,
      remainingDays: 500,
      status: "Confirmed",
    },
    {
      id: "6",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Sarah Wilson",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 900,
      remainingDays: 500,
      status: "Pending",
    },
    {
      id: "7",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Mike Johnson",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 900,
      remainingDays: 500,
      status: "Pending",
    },
    {
      id: "8",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Emily Davis",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 900,
      remainingDays: 500,
      status: "Pending",
    },
    {
      id: "9",
      clientId: "#AhgGABB",
      sessionDate: "23/08/2022",
      fullName: "Alex Thompson",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 900,
      remainingDays: 500,
      status: "Pending",
    },
    {
      id: "10",
      clientId: "#BhgGACC",
      date: "24/08/2022",
      fullName: "Lisa Garcia",
      contactNumber: "1234567890",
      sessionType: "P Training",
      totalDuration: 1200,
      remainingDays: 300,
      status: "Confirmed",
    },
    {
      id: "11",
      clientId: "#ChgGADD",
      sessionDate: "24/08/2022",
      fullName: "David Brown",
      contactNumber: "1234567890",
      sessionType: "Consultation",
      totalDuration: 800,
      remainingDays: 700,
      status: "Booked",
    },
    {
      id: "12",
      clientId: "#DhgGAEE",
      sessionDate: "25/08/2022",
      fullName: "Emma Wilson",
      contactNumber: "1234567890",
      sessionType: "P Training",
      totalDuration: 950,
      remainingDays: 450,
      status: "Pending",
    },
  ];

  // Filter and search functionality
  const filteredSessions = useMemo(() => {
    return allSessions.filter((session) => {
      const matchesSearch =
        session.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.contactNumber.includes(searchQuery) ||
        session.sessionType.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleAddClient = () => {
    setShowAddClient(true);
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId],
    );
  };

  const handleSelectAll = () => {
    if (selectedSessions.length === paginatedSessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(paginatedSessions.map((session) => session.id));
    }
  };

  const getStatusBadge = (status: "Booked" | "Confirmed" | "Pending") => {
    let colorClasses = "";
    switch (status) {
      case "Booked":
        colorClasses = "text-red-600 bg-red-50";
        break;
      case "Confirmed":
        colorClasses = "text-green-600 bg-green-50";
        break;
      case "Pending":
        colorClasses = "text-orange-600 bg-orange-50";
        break;
    }

    return (
      <Badge variant="secondary" className={`border-0 text-xs ${colorClasses}`}>
        {status}
      </Badge>
    );
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
      statusOptions={["all", "Booked", "Confirmed", "Pending"]}
      searchPlaceholder="Search by client name, ID, type or contact..."
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

        {/* Table with blue border as shown in image */}
        <div className="bg-white rounded-lg border-4 border-blue-500 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Checkbox
                      checked={
                        selectedSessions.length === paginatedSessions.length &&
                        paginatedSessions.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedSessions.includes(session.id)}
                        onCheckedChange={() => handleSelectSession(session.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {session.clientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.sessionDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.sessionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${session.totalDuration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${session.remainingDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(session.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Show result:
                <Select defaultValue="1">
                  <SelectTrigger className="inline-flex w-16 ml-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-2">...</span>}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

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

      {/* Add Client Modal */}
      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input placeholder="Enter client name" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Contact Number</label>
              <Input placeholder="Enter contact number" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Session Type</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P Training">P Training</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Total Duration</label>
              <Input
                placeholder="Enter duration in minutes"
                type="number"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
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
                  alert("Session added successfully!");
                  setShowAddClient(false);
                }}
                className="flex-1"
              >
                Add Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PTLayout>
  );
};

export default PTSessions;
