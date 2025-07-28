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

interface PaymentDetail {
  id: string;
  clientId: string;
  date: string;
  fullName: string;
  contactNumber: string;
  firstPayment: number;
  pendingPayment: number;
  status: "Active" | "Inactive";
}

const PTPayments = () => {
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
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const itemsPerPage = 10;

  const allPayments: PaymentDetail[] = [
    {
      id: "1",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      firstPayment: 900,
      pendingPayment: 500,
      status: "Inactive",
    },
    {
      id: "2",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      firstPayment: 1000,
      pendingPayment: 500,
      status: "Active",
    },
    {
      id: "3",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      firstPayment: 900,
      pendingPayment: 500,
      status: "Active",
    },
    {
      id: "4",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      firstPayment: 1000,
      pendingPayment: 500,
      status: "Active",
    },
    {
      id: "5",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Jacob Marcus",
      contactNumber: "1234567890",
      firstPayment: 900,
      pendingPayment: 500,
      status: "Active",
    },
    {
      id: "6",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Sarah Wilson",
      contactNumber: "1234567890",
      firstPayment: 1000,
      pendingPayment: 500,
      status: "Inactive",
    },
    {
      id: "7",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Mike Johnson",
      contactNumber: "1234567890",
      firstPayment: 900,
      pendingPayment: 500,
      status: "Inactive",
    },
    {
      id: "8",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Emily Davis",
      contactNumber: "1234567890",
      firstPayment: 1000,
      pendingPayment: 500,
      status: "Active",
    },
    {
      id: "9",
      clientId: "#AhgGABB",
      date: "23/08/2022",
      fullName: "Alex Thompson",
      contactNumber: "1234567890",
      firstPayment: 900,
      pendingPayment: 500,
      status: "Active",
    },
    {
      id: "10",
      clientId: "#BhgGACC",
      date: "24/08/2022",
      fullName: "Lisa Garcia",
      contactNumber: "1234567890",
      firstPayment: 1200,
      pendingPayment: 300,
      status: "Active",
    },
    {
      id: "11",
      clientId: "#ChgGADD",
      date: "24/08/2022",
      fullName: "David Brown",
      contactNumber: "1234567890",
      firstPayment: 800,
      pendingPayment: 700,
      status: "Inactive",
    },
    {
      id: "12",
      clientId: "#DhgGAEE",
      date: "25/08/2022",
      fullName: "Emma Wilson",
      contactNumber: "1234567890",
      firstPayment: 950,
      pendingPayment: 450,
      status: "Active",
    },
  ];

  // Filter and search functionality
  const filteredPayments = useMemo(() => {
    return allPayments.filter((payment) => {
      const matchesSearch =
        payment.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.contactNumber.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage]);

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

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId],
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === paginatedPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(paginatedPayments.map((payment) => payment.id));
    }
  };

  const getStatusBadge = (status: "Active" | "Inactive") => {
    return (
      <Badge
        variant="secondary"
        className={`border-0 text-xs ${
          status === "Active"
            ? "text-green-600 bg-green-50"
            : "text-red-600 bg-red-50"
        }`}
      >
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
      statusOptions={["all", "Active", "Inactive"]}
      searchPlaceholder="Search by client name, ID or contact..."
    >
      <div className="p-6">
        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {paginatedPayments.length} of {filteredPayments.length}{" "}
            payments
            {searchQuery && ` for "${searchQuery}"`}
            {statusFilter !== "all" && ` with status "${statusFilter}"`}
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
                        selectedPayments.length === paginatedPayments.length &&
                        paginatedPayments.length > 0
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
                    Contact Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    1st Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedPayments.includes(payment.id)}
                        onCheckedChange={() => handleSelectPayment(payment.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {payment.clientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${payment.firstPayment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${payment.pendingPayment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
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
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No payments found</div>
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
            <DialogTitle>Add New Payment Record</DialogTitle>
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
              <label className="text-sm font-medium">First Payment</label>
              <Input
                placeholder="Enter amount"
                type="number"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pending Payment</label>
              <Input
                placeholder="Enter pending amount"
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
                  alert("Payment record added successfully!");
                  setShowAddClient(false);
                }}
                className="flex-1"
              >
                Add Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PTLayout>
  );
};

export default PTPayments;
