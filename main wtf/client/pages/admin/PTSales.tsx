import React, { useState, useMemo } from "react";
import { useAdminData, SalesRecord } from "@/contexts/AdminDataContext";
import { useAdminToast } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddSaleModalProps {
  onSave: (sale: Omit<SalesRecord, "id">) => void;
  onClose: () => void;
  trainers: Array<{ id: string; name: string; avatar: string }>;
  clients: Array<{
    id: string;
    name: string;
    avatar: string;
    trainerId: string;
  }>;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  onSave,
  onClose,
  trainers,
  clients,
}) => {
  const [formData, setFormData] = useState({
    leadId: `#CM${Math.floor(Math.random() * 10000)}`,
    personalTrainer: "",
    clientName: "",
    serviceType: "",
    totalValue: "",
    status: "In Progress" as "In Progress" | "Complete" | "Pending",
    payment: "Pending" as "Paid" | "Pending" | "Refunded",
  });

  const selectedTrainer = trainers.find(
    (t) => t.name === formData.personalTrainer,
  );
  const availableClients = clients.filter((c) =>
    selectedTrainer ? c.trainerId === selectedTrainer.id : true,
  );
  const selectedClient = clients.find((c) => c.name === formData.clientName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.personalTrainer ||
      !formData.clientName ||
      !formData.serviceType ||
      !formData.totalValue
    ) {
      return;
    }

    onSave({
      leadId: formData.leadId,
      personalTrainer: formData.personalTrainer,
      trainerAvatar: selectedTrainer?.avatar || "",
      clientName: formData.clientName,
      clientAvatar: selectedClient?.avatar || "",
      serviceType: formData.serviceType,
      totalValue: parseInt(formData.totalValue),
      status: formData.status,
      payment: formData.payment,
      date: new Date(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Add New Sale</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead ID
            </label>
            <Input
              value={formData.leadId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, leadId: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal Trainer
            </label>
            <Select
              value={formData.personalTrainer}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  personalTrainer: value,
                  clientName: "",
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trainer" />
              </SelectTrigger>
              <SelectContent>
                {trainers.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.name}>
                    {trainer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <Select
              value={formData.clientName}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, clientName: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {availableClients.map((client) => (
                  <SelectItem key={client.id} value={client.name}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, serviceType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal Training">
                  Personal Training
                </SelectItem>
                <SelectItem value="Group Training">Group Training</SelectItem>
                <SelectItem value="Nutrition Coaching">
                  Nutrition Coaching
                </SelectItem>
                <SelectItem value="Fitness Assessment">
                  Fitness Assessment
                </SelectItem>
                <SelectItem value="Custom Program">Custom Program</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Value ($)
            </label>
            <Input
              type="number"
              min="0"
              value={formData.totalValue}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, totalValue: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value: "In Progress" | "Complete" | "Pending") =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment
            </label>
            <Select
              value={formData.payment}
              onValueChange={(value: "Paid" | "Pending" | "Refunded") =>
                setFormData((prev) => ({ ...prev, payment: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2 pt-3">
            <Button type="submit" className="flex-1 h-9 text-sm">
              Add Sale
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-9 text-sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div
          className={`flex items-center space-x-1 text-xs ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

const PTSales: React.FC = () => {
  const {
    salesRecords,
    personalTrainers,
    clients,
    adminStats,
    getSalesAnalytics,
    searchSalesRecords,
    addSalesRecord,
    updateSalesRecord,
  } = useAdminData();
  const toast = useAdminToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "year">(
    "month",
  );
  const [sortField, setSortField] = useState<keyof SalesRecord>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOnlyPaid, setShowOnlyPaid] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  // Get analytics based on selected time period
  const periodStats = useMemo(() => {
    return getSalesAnalytics(timePeriod);
  }, [timePeriod, getSalesAnalytics]);

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = searchSalesRecords(searchQuery);

    // Show only paid if requested
    if (showOnlyPaid) {
      filtered = filtered.filter((record) => record.payment === "Paid");
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter);
    }

    // Apply payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((record) => record.payment === paymentFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "date") {
        aVal = new Date(aVal as Date).getTime();
        bVal = new Date(bVal as Date).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    salesRecords,
    searchQuery,
    statusFilter,
    paymentFilter,
    sortField,
    sortDirection,
    searchSalesRecords,
  ]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRecords.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredAndSortedRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage);

  const handleSort = (field: keyof SalesRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddSale = (sale: Omit<SalesRecord, "id">) => {
    addSalesRecord(sale);
    toast.success("Sale record added successfully!");
  };

  const trainerOptions = personalTrainers.map((pt) => ({
    id: pt.id,
    name: pt.name,
    avatar: pt.avatar,
  }));

  const clientOptions = clients.map((c) => ({
    id: c.id,
    name: c.name,
    avatar: c.avatar,
    trainerId: c.trainerId,
  }));

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId],
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === paginatedRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(paginatedRecords.map((record) => record.id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Sales"
          value={formatCurrency(periodStats.totalSales)}
          change={adminStats.salesGrowth}
          trend="up"
        />
        <StatsCard
          title="Monthly Sales"
          value={formatCurrency(periodStats.monthlySales)}
          change={adminStats.monthlyGrowth}
          trend="down"
        />
        <StatsCard
          title="New Users"
          value={periodStats.newUsers.toString()}
          change={adminStats.userGrowth}
          trend="up"
        />
        <StatsCard
          title="Balance Payment"
          value={formatCurrency(periodStats.balancePayment)}
          change={adminStats.paymentGrowth}
          trend="up"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search sales records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="mr-2" />
              Add Sale
            </Button>
            <Button
              size="sm"
              variant={showOnlyPaid ? "default" : "outline"}
              onClick={() => setShowOnlyPaid(!showOnlyPaid)}
            >
              <Filter size={16} className="mr-2" />
              {showOnlyPaid ? "Show All" : "Paid Only"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              <ArrowUpDown size={16} className="mr-2" />
              Sort {sortDirection === "asc" ? "Desc" : "Asc"}
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-36">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table with blue border as shown in screenshot */}
        <div className="border-2 border-blue-400 rounded-lg m-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <Checkbox
                      checked={
                        selectedRecords.length === paginatedRecords.length &&
                        paginatedRecords.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button
                      onClick={() => handleSort("leadId")}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Lead ID</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button
                      onClick={() => handleSort("personalTrainer")}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Personal Trainer</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button
                      onClick={() => handleSort("clientName")}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Client Name</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button
                      onClick={() => handleSort("serviceType")}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Service Type</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button
                      onClick={() => handleSort("totalValue")}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Total Value</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Status</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    <button
                      onClick={() => handleSort("payment")}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Payment</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onCheckedChange={() => handleSelectRecord(record.id)}
                      />
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {record.leadId}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={record.trainerAvatar}
                          alt={record.personalTrainer}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900">
                          {record.personalTrainer}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={record.clientAvatar}
                          alt={record.clientName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-900">
                          {record.clientName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      {record.serviceType}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {formatCurrency(record.totalValue)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : record.status === "Complete"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.payment === "Paid"
                            ? "bg-green-100 text-green-800"
                            : record.payment === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show result</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </Button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-gray-400">...</span>
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              ›
            </Button>
          </div>
        </div>
      </div>

      {/* Add Sale Modal */}
      {showAddModal && (
        <AddSaleModal
          onSave={handleAddSale}
          onClose={() => setShowAddModal(false)}
          trainers={trainerOptions}
          clients={clientOptions}
        />
      )}
    </div>
  );
};

export default PTSales;
