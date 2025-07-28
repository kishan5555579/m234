import React, { useState, useMemo } from "react";
import { useAdminData, PersonalTrainer } from "@/contexts/AdminDataContext";
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
  ChevronDown,
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
  trainer: PersonalTrainer;
  onSave: (updates: Partial<PersonalTrainer>) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ trainer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: trainer.name,
    email: trainer.email,
    phone: trainer.phone,
    status: trainer.status,
    specialization: trainer.specialization,
    experience: trainer.experience.toString(),
    clients: trainer.clients.toString(),
    paymentsCollected: trainer.paymentsCollected.toString(),
    paymentsPending: trainer.paymentsPending.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status as "Active" | "Inactive",
      specialization: formData.specialization,
      experience: parseInt(formData.experience),
      clients: parseInt(formData.clients),
      paymentsCollected: parseInt(formData.paymentsCollected),
      paymentsPending: parseInt(formData.paymentsPending),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Edit Personal Trainer</h3>
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
              Specialization
            </label>
            <Input
              value={formData.specialization}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (years)
            </label>
            <Input
              type="number"
              value={formData.experience}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, experience: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Clients
            </label>
            <Input
              type="number"
              min="0"
              value={formData.clients}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, clients: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payments Collected ($)
            </label>
            <Input
              type="number"
              min="0"
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
              Payments Pending ($)
            </label>
            <Input
              type="number"
              min="0"
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
          <div className="flex space-x-2 pt-3">
            <Button type="submit" className="flex-1 h-9 text-sm">
              Save Changes
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

const PersonalTrainers: React.FC = () => {
  const {
    personalTrainers,
    updatePersonalTrainer,
    deletePersonalTrainer,
    searchPersonalTrainers,
  } = useAdminData();
  const toast = useAdminToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof PersonalTrainer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingTrainer, setEditingTrainer] = useState<PersonalTrainer | null>(
    null,
  );
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrainers, setSelectedTrainers] = useState<string[]>([]);

  const filteredAndSortedTrainers = useMemo(() => {
    let filtered = searchPersonalTrainers(searchQuery);

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((trainer) => trainer.status === statusFilter);
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
    personalTrainers,
    searchQuery,
    statusFilter,
    sortField,
    sortDirection,
    searchPersonalTrainers,
  ]);

  const paginatedTrainers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTrainers.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredAndSortedTrainers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTrainers.length / itemsPerPage);

  const handleSort = (field: keyof PersonalTrainer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (trainer: PersonalTrainer) => {
    setEditingTrainer(trainer);
  };

  const handleDelete = (trainerId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this trainer? This will also remove all associated clients.",
      )
    ) {
      deletePersonalTrainer(trainerId);
      toast.success("Personal trainer deleted successfully!");
    }
  };

  const handleSaveEdit = (updates: Partial<PersonalTrainer>) => {
    if (editingTrainer) {
      updatePersonalTrainer(editingTrainer.id, updates);
      toast.success("Personal trainer updated successfully!");
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

  const handleSelectTrainer = (trainerId: string) => {
    setSelectedTrainers((prev) =>
      prev.includes(trainerId)
        ? prev.filter((id) => id !== trainerId)
        : [...prev, trainerId],
    );
  };

  const handleSelectAll = () => {
    if (selectedTrainers.length === paginatedTrainers.length) {
      setSelectedTrainers([]);
    } else {
      setSelectedTrainers(paginatedTrainers.map((trainer) => trainer.id));
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
                      selectedTrainers.length === paginatedTrainers.length &&
                      paginatedTrainers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Personal Trainer</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <button
                    onClick={() => handleSort("clients")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>No of Clients</span>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTrainers.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedTrainers.includes(trainer.id)}
                      onCheckedChange={() => handleSelectTrainer(trainer.id)}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {trainer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trainer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        {[...Array(Math.min(trainer.clients, 4))].map(
                          (_, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center"
                            >
                              <span className="text-xs font-bold text-yellow-900">
                                👤
                              </span>
                            </div>
                          ),
                        )}
                        {trainer.clients > 4 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">
                              +{trainer.clients - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      {trainer.clients === 0 && (
                        <span className="text-gray-400 text-sm">
                          No clients
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {formatCurrency(trainer.paymentsCollected)}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {formatCurrency(trainer.paymentsPending)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trainer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {trainer.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(trainer)}>
                          <Edit3 size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(trainer.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      {editingTrainer && (
        <EditModal
          trainer={editingTrainer}
          onSave={handleSaveEdit}
          onClose={() => setEditingTrainer(null)}
        />
      )}
    </div>
  );
};

export default PersonalTrainers;
