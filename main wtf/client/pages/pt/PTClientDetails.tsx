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
import PTLayout from "@/components/PTLayout";

interface ClientDetail {
  id: string;
  clientId: string;
  date: string;
  fullName: string;
  age: number;
  email: string;
  firstPayment: number;
  sessionType: string;
}

const PTClientDetails = () => {
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
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const itemsPerPage = 10;

  const allClients: ClientDetail[] = [
    {
      id: "1",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      age: 30,
      email: "jacob.Marcus@gmail.com",
      firstPayment: 900,
      sessionType: "12",
    },
    {
      id: "2",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      age: 30,
      email: "jacob.Marcus@gmail.com",
      firstPayment: 900,
      sessionType: "24",
    },
    {
      id: "3",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      age: 30,
      email: "jacob.Marcus@gmail.com",
      firstPayment: 900,
      sessionType: "36",
    },
    {
      id: "4",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      age: 30,
      email: "jacob.Marcus@gmail.com",
      firstPayment: 900,
      sessionType: "36",
    },
    {
      id: "5",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      age: 30,
      email: "jacob.Marcus@gmail.com",
      firstPayment: 900,
      sessionType: "24",
    },
    {
      id: "6",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Sarah Wilson",
      age: 28,
      email: "sarah.wilson@gmail.com",
      firstPayment: 900,
      sessionType: "36",
    },
    {
      id: "7",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Mike Johnson",
      age: 35,
      email: "mike.johnson@gmail.com",
      firstPayment: 900,
      sessionType: "12",
    },
    {
      id: "8",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Emily Davis",
      age: 26,
      email: "emily.davis@gmail.com",
      firstPayment: 900,
      sessionType: "12",
    },
    {
      id: "9",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Alex Thompson",
      age: 32,
      email: "alex.thompson@gmail.com",
      firstPayment: 900,
      sessionType: "36",
    },
    {
      id: "10",
      clientId: "#AhgGABB",
      date: "24/08/2022",
      fullName: "Lisa Garcia",
      age: 29,
      email: "lisa.garcia@gmail.com",
      firstPayment: 900,
      sessionType: "24",
    },
    {
      id: "11",
      clientId: "#BhgGACC",
      date: "24/08/2022",
      fullName: "David Brown",
      age: 31,
      email: "david.brown@gmail.com",
      firstPayment: 1200,
      sessionType: "12",
    },
    {
      id: "12",
      clientId: "#ChgGADD",
      date: "25/08/2022",
      fullName: "Emma Wilson",
      age: 27,
      email: "emma.wilson@gmail.com",
      firstPayment: 800,
      sessionType: "24",
    },
  ];

  // Filter and search functionality
  const filteredClients = useMemo(() => {
    return allClients.filter((client) => {
      const matchesSearch =
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.clientId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "12" && client.sessionType === "12") ||
        (statusFilter === "24" && client.sessionType === "24") ||
        (statusFilter === "36" && client.sessionType === "36");

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage]);

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

  const handleSelectClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === paginatedClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients.map((client) => client.id));
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
      statusOptions={["all", "12", "24", "36"]}
      searchPlaceholder="Search by client name, email or ID..."
    >
      <div className="p-6">
        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedClients.length} of {filteredClients.length}{" "}
            clients
            {searchQuery && ` for "${searchQuery}"`}
            {statusFilter !== "all" && ` with ${statusFilter} sessions`}
          </div>
          {(searchQuery || statusFilter !== "all") && (
            <Button onClick={resetFilters} variant="outline" size="sm">
              Clear all filters
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Checkbox
                      checked={
                        selectedClients.length === paginatedClients.length &&
                        paginatedClients.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    1st Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={`hover:bg-gray-50 ${index === 3 ? "border-b-4 border-blue-500" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleSelectClient(client.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {client.clientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${client.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${client.firstPayment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.sessionType}
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
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No clients found</div>
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
              <label className="text-sm font-medium">Age</label>
              <Input placeholder="Enter age" type="number" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Session Type</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 Sessions</SelectItem>
                  <SelectItem value="24">24 Sessions</SelectItem>
                  <SelectItem value="36">36 Sessions</SelectItem>
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

export default PTClientDetails;
