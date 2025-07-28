import React, { useState, useMemo } from "react";
import { useAdminData, Client } from "@/contexts/AdminDataContext";
import { useAdminToast } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditModalProps {
  client: Client | null;
  trainers: Array<{ id: string; name: string }>;
  onSave: (client: Client | null, updates: Partial<Client>) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  client,
  trainers,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    gender: client?.gender || "Male",
    status: client?.status || "Active",
    trainerId: client?.trainerId || "",
    membershipType: client?.membershipType || "Basic",
    address: client?.address || "",
    paymentsCollected: client?.paymentsCollected?.toString() || "0",
    paymentsPending: client?.paymentsPending?.toString() || "0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(client, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender as "Male" | "Female" | "Other",
      status: formData.status as "Active" | "Inactive",
      trainerId: formData.trainerId,
      membershipType: formData.membershipType,
      address: formData.address,
      paymentsCollected: parseInt(formData.paymentsCollected),
      paymentsPending: parseInt(formData.paymentsPending),
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">
          {client ? "Edit Client" : "Add New Client"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal Trainer
            </label>
            <Select
              value={formData.trainerId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, trainerId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trainer" />
              </SelectTrigger>
              <SelectContent>
                {trainers.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membership Type
            </label>
            <Select
              value={formData.membershipType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, membershipType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payments Collected
            </label>
            <Input
              type="number"
              value={formData.paymentsCollected}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentsCollected: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payments Pending
            </label>
            <Input
              type="number"
              value={formData.paymentsPending}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentsPending: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Full address"
            />
          </div>
          <div className="flex space-x-2 pt-3">
            <Button type="submit" className="flex-1 h-9 text-sm">
              {client ? "Save Changes" : "Add Client"}
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

const ClientDetails: React.FC = () => {
  const {
    clients,
    personalTrainers,
    updateClient,
    deleteClient,
    addClient,
    searchClients,
  } = useAdminData();
  const toast = useAdminToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Client>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const filteredAndSortedClients = useMemo(() => {
    let filtered = searchClients(searchQuery);

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    clients,
    searchQuery,
    statusFilter,
    sortField,
    sortDirection,
    searchClients,
  ]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedClients.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredAndSortedClients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);

  const handleSort = (field: keyof Client) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClient(clientId);
      toast.success("Client deleted successfully!");
    }
  };

  const handleSave = (client: Client | null, updates: Partial<Client>) => {
    if (client) {
      updateClient(client.id, updates);
      toast.success("Client updated successfully!");
    } else {
      addClient(updates as Omit<Client, "id" | "joinDate">);
      toast.success("Client added successfully!");
    }
  };

  const getTrainerName = (trainerId: string) => {
    const trainer = personalTrainers.find((pt) => pt.id === trainerId);
    return trainer?.name || "Unassigned";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const trainerOptions = personalTrainers.map((pt) => ({
    id: pt.id,
    name: pt.name,
  }));

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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6" />

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
                placeholder="Search by name, email, or others..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="text-gray-600">
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <Checkbox
                    checked={
                      selectedClients.length === paginatedClients.length &&
                      paginatedClients.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Client Name</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => handleSort("gender")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Gender</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => handleSort("phone")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Phone Number</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => handleSort("paymentsCollected")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Payments Collected</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => handleSort("paymentsPending")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Payments Pending</span>
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
                <th className="text-center py-3 px-4 font-medium text-gray-900">
                  Edit
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => handleSelectClient(client.id)}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{client.gender}</td>
                  <td className="py-4 px-4 text-gray-900">{client.phone}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {formatCurrency(client.paymentsCollected)}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {formatCurrency(client.paymentsPending)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(client)}
                    >
                      <MoreHorizontal size={16} />
                    </Button>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <SelectItem value="50">50</SelectItem>
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

            {(() => {
              const startPage = Math.max(1, currentPage - 2);
              const endPage = Math.min(totalPages, startPage + 4);
              const pages = [];

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                    className="w-8 h-8 p-0"
                  >
                    {i}
                  </Button>,
                );
              }

              return pages;
            })()}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-gray-400">...</span>
                <Button
                  variant="outline"
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

      {/* Edit Modal */}
      {editingClient && (
        <EditModal
          client={editingClient}
          trainers={trainerOptions}
          onSave={handleSave}
          onClose={() => setEditingClient(null)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <EditModal
          client={null}
          trainers={trainerOptions}
          onSave={handleSave}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default ClientDetails;
