import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface PersonalTrainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  avatar: string;
  clients: number;
  paymentsCollected: number;
  paymentsPending: number;
  status: "Active" | "Inactive";
  createdAt: Date;
  specialization: string;
  experience: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  avatar: string;
  paymentsCollected: number;
  paymentsPending: number;
  status: "Active" | "Inactive";
  trainerId: string;
  joinDate: Date;
  membershipType: string;
  address: string;
}

export interface SalesRecord {
  id: string;
  leadId: string;
  personalTrainer: string;
  trainerAvatar: string;
  clientName: string;
  clientAvatar: string;
  serviceType: string;
  totalValue: number;
  status: "In Progress" | "Complete" | "Pending";
  payment: "Paid" | "Pending" | "Refunded";
  date: Date;
}

export interface AdminStats {
  totalSales: number;
  monthlySales: number;
  newUsers: number;
  balancePayment: number;
  salesGrowth: number;
  monthlyGrowth: number;
  userGrowth: number;
  paymentGrowth: number;
}

interface AdminDataContextType {
  // Data
  personalTrainers: PersonalTrainer[];
  clients: Client[];
  salesRecords: SalesRecord[];
  adminStats: AdminStats;

  // Actions
  addPersonalTrainer: (
    trainer: Omit<PersonalTrainer, "id" | "createdAt">,
  ) => void;
  updatePersonalTrainer: (
    id: string,
    updates: Partial<PersonalTrainer>,
  ) => void;
  deletePersonalTrainer: (id: string) => void;

  addClient: (client: Omit<Client, "id" | "joinDate">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addSalesRecord: (record: Omit<SalesRecord, "id">) => void;
  updateSalesRecord: (id: string, updates: Partial<SalesRecord>) => void;

  // Computed data
  getTrainerClients: (trainerId: string) => Client[];
  getTrainerSales: (trainerId: string) => SalesRecord[];
  calculateTrainerStats: (trainerId: string) => {
    collected: number;
    pending: number;
    clients: number;
  };

  // Filters and search
  searchPersonalTrainers: (query: string) => PersonalTrainer[];
  searchClients: (query: string) => Client[];
  searchSalesRecords: (query: string) => SalesRecord[];

  // Analytics
  getSalesAnalytics: (period: "week" | "month" | "year") => any;
  refreshStats: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(
  undefined,
);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
};

interface AdminDataProviderProps {
  children: ReactNode;
}

export const AdminDataProvider: React.FC<AdminDataProviderProps> = ({
  children,
}) => {
  const [personalTrainers, setPersonalTrainers] = useState<PersonalTrainer[]>(
    [],
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalSales: 7265,
    monthlySales: 3671,
    newUsers: 156,
    balancePayment: 2318,
    salesGrowth: 11.01,
    monthlyGrowth: -0.5,
    userGrowth: 5.25,
    paymentGrowth: 6.08,
  });

  // Initialize with mock data
  useEffect(() => {
    const mockTrainers: PersonalTrainer[] = [
      {
        id: "pt1",
        name: "Devon Lane",
        email: "devon@wtffitness.com",
        phone: "+1234567890",
        address: "123 Fitness St",
        city: "New York",
        state: "NY",
        country: "USA",
        pinCode: "10001",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        clients: 4,
        paymentsCollected: 5000,
        paymentsPending: 1000,
        status: "Active",
        createdAt: new Date("2023-01-15"),
        specialization: "Weight Training",
        experience: 5,
      },
      {
        id: "pt2",
        name: "Kathryn Murphy",
        email: "kathryn@wtffitness.com",
        phone: "+1234567891",
        address: "456 Gym Ave",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        pinCode: "90210",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        clients: 3,
        paymentsCollected: 10000,
        paymentsPending: 2000,
        status: "Inactive",
        createdAt: new Date("2023-02-20"),
        specialization: "Cardio Training",
        experience: 3,
      },
      {
        id: "pt3",
        name: "Eleanor Pena",
        email: "eleanor@wtffitness.com",
        phone: "+1234567892",
        address: "789 Health Blvd",
        city: "Chicago",
        state: "IL",
        country: "USA",
        pinCode: "60601",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        clients: 1,
        paymentsCollected: 10000,
        paymentsPending: 3000,
        status: "Active",
        createdAt: new Date("2023-03-10"),
        specialization: "Yoga",
        experience: 7,
      },
      {
        id: "pt4",
        name: "Annette Black",
        email: "annette@wtffitness.com",
        phone: "+1234567893",
        address: "321 Strength Rd",
        city: "Miami",
        state: "FL",
        country: "USA",
        pinCode: "33101",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        clients: 5,
        paymentsCollected: 5000,
        paymentsPending: 1000,
        status: "Active",
        createdAt: new Date("2023-04-05"),
        specialization: "Strength Training",
        experience: 4,
      },
      {
        id: "pt5",
        name: "Guy Hawkins",
        email: "guy@wtffitness.com",
        phone: "+1234567894",
        address: "654 Fitness Way",
        city: "Dallas",
        state: "TX",
        country: "USA",
        pinCode: "75201",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
        clients: 3,
        paymentsCollected: 10000,
        paymentsPending: 2000,
        status: "Active",
        createdAt: new Date("2023-05-12"),
        specialization: "CrossFit",
        experience: 6,
      },
      {
        id: "pt6",
        name: "Floyd Miles",
        email: "floyd@wtffitness.com",
        phone: "+1234567895",
        address: "987 Workout St",
        city: "Seattle",
        state: "WA",
        country: "USA",
        pinCode: "98101",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        clients: 8,
        paymentsCollected: 25000,
        paymentsPending: 5000,
        status: "Active",
        createdAt: new Date("2023-06-18"),
        specialization: "Nutrition",
        experience: 8,
      },
    ];

    const mockClients: Client[] = [
      {
        id: "cl1",
        name: "Devon Lane",
        email: "devon.client@email.com",
        phone: "+1234567890",
        gender: "Male",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        paymentsCollected: 5000,
        paymentsPending: 1000,
        status: "Active",
        trainerId: "pt1",
        joinDate: new Date("2023-07-01"),
        membershipType: "Premium",
        address: "123 Client St, New York, NY",
      },
      {
        id: "cl2",
        name: "Kathryn Murphy",
        email: "kathryn.client@email.com",
        phone: "+1234567891",
        gender: "Female",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        paymentsCollected: 10000,
        paymentsPending: 2000,
        status: "Inactive",
        trainerId: "pt2",
        joinDate: new Date("2023-07-15"),
        membershipType: "Basic",
        address: "456 Client Ave, Los Angeles, CA",
      },
      {
        id: "cl3",
        name: "Eleanor Pena",
        email: "eleanor.client@email.com",
        phone: "+1234567892",
        gender: "Female",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        paymentsCollected: 10000,
        paymentsPending: 3000,
        status: "Active",
        trainerId: "pt3",
        joinDate: new Date("2023-08-01"),
        membershipType: "Premium",
        address: "789 Client Blvd, Chicago, IL",
      },
    ];

    // Generate mock sales records based on trainers and clients
    const mockSalesRecords: SalesRecord[] = [
      {
        id: "sr1",
        leadId: "#CM9801",
        personalTrainer: "Devon Lane",
        trainerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        clientName: "Devon Lane",
        clientAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        serviceType: "Personal Training",
        totalValue: 2500,
        status: "In Progress",
        payment: "Paid",
        date: new Date("2023-10-15"),
      },
      {
        id: "sr2",
        leadId: "#CM9802",
        personalTrainer: "Kathryn Murphy",
        trainerAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        clientName: "Kathryn Murphy",
        clientAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        serviceType: "Nutrition Coaching",
        totalValue: 1800,
        status: "Complete",
        payment: "Paid",
        date: new Date("2023-10-20"),
      },
      {
        id: "sr3",
        leadId: "#CM9803",
        personalTrainer: "Eleanor Pena",
        trainerAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        clientName: "Eleanor Pena",
        clientAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        serviceType: "Yoga Session",
        totalValue: 1200,
        status: "Pending",
        payment: "Pending",
        date: new Date("2023-10-25"),
      },
      {
        id: "sr4",
        leadId: "#CM9804",
        personalTrainer: "Annette Black",
        trainerAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        clientName: "John Smith",
        clientAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        serviceType: "Strength Training",
        totalValue: 3000,
        status: "Complete",
        payment: "Paid",
        date: new Date("2023-11-01"),
      },
      {
        id: "sr5",
        leadId: "#CM9805",
        personalTrainer: "Guy Hawkins",
        trainerAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
        clientName: "Sarah Wilson",
        clientAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        serviceType: "CrossFit Training",
        totalValue: 2200,
        status: "In Progress",
        payment: "Paid",
        date: new Date("2023-11-05"),
      },
      {
        id: "sr6",
        leadId: "#CM9806",
        personalTrainer: "Floyd Miles",
        trainerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        clientName: "Michael Brown",
        clientAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        serviceType: "Nutrition Consultation",
        totalValue: 1500,
        status: "Complete",
        payment: "Paid",
        date: new Date("2023-11-10"),
      },
      {
        id: "sr7",
        leadId: "#CM9807",
        personalTrainer: "Devon Lane",
        trainerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        clientName: "Emily Davis",
        clientAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        serviceType: "Group Training",
        totalValue: 800,
        status: "Pending",
        payment: "Pending",
        date: new Date("2023-11-12"),
      },
      {
        id: "sr8",
        leadId: "#CM9808",
        personalTrainer: "Kathryn Murphy",
        trainerAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        clientName: "Robert Johnson",
        clientAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        serviceType: "Fitness Assessment",
        totalValue: 500,
        status: "Complete",
        payment: "Paid",
        date: new Date("2023-11-15"),
      },
    ];

    setPersonalTrainers(mockTrainers);
    setClients(mockClients);
    setSalesRecords(mockSalesRecords);
  }, []);

  // PT Management Functions
  const addPersonalTrainer = (
    trainer: Omit<PersonalTrainer, "id" | "createdAt">,
  ) => {
    const newTrainer: PersonalTrainer = {
      ...trainer,
      id: `pt${Date.now()}`,
      createdAt: new Date(),
    };
    setPersonalTrainers((prev) => [...prev, newTrainer]);
    refreshStats();
  };

  const updatePersonalTrainer = (
    id: string,
    updates: Partial<PersonalTrainer>,
  ) => {
    setPersonalTrainers((prev) =>
      prev.map((pt) => (pt.id === id ? { ...pt, ...updates } : pt)),
    );
    refreshStats();
  };

  const deletePersonalTrainer = (id: string) => {
    setPersonalTrainers((prev) => prev.filter((pt) => pt.id !== id));
    // Also remove clients associated with this trainer
    setClients((prev) => prev.filter((client) => client.trainerId !== id));
    refreshStats();
  };

  // Client Management Functions
  const addClient = (client: Omit<Client, "id" | "joinDate">) => {
    const newClient: Client = {
      ...client,
      id: `cl${Date.now()}`,
      joinDate: new Date(),
    };
    setClients((prev) => [...prev, newClient]);

    // Update trainer's client count and payments
    const trainer = personalTrainers.find((pt) => pt.id === client.trainerId);
    if (trainer) {
      updatePersonalTrainer(trainer.id, {
        clients: trainer.clients + 1,
        paymentsCollected: trainer.paymentsCollected + client.paymentsCollected,
        paymentsPending: trainer.paymentsPending + client.paymentsPending,
      });
    }
    refreshStats();

    // Trigger real-time update event
    window.dispatchEvent(new CustomEvent('clientAdded', { detail: newClient }));

    // Auto-generate a sales record for new client
    const newSalesRecord: SalesRecord = {
      id: `sr${Date.now()}`,
      leadId: `#CM${Math.floor(Math.random() * 10000)}`,
      personalTrainer: trainer?.name || "Unknown Trainer",
      trainerAvatar: trainer?.avatar || "",
      clientName: newClient.name,
      clientAvatar: newClient.avatar,
      serviceType: newClient.membershipType || "Personal Training",
      totalValue: Math.floor(Math.random() * 3000) + 500, // Random value between 500-3500
      status: "In Progress" as const,
      payment: "Pending" as const,
      date: new Date(),
    };
    setSalesRecords((prev) => [...prev, newSalesRecord]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, ...updates } : client,
      ),
    );
    refreshStats();
  };

  const deleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    if (client) {
      const trainer = personalTrainers.find((pt) => pt.id === client.trainerId);
      if (trainer) {
        updatePersonalTrainer(trainer.id, {
          clients: Math.max(0, trainer.clients - 1),
          paymentsCollected: Math.max(
            0,
            trainer.paymentsCollected - client.paymentsCollected,
          ),
          paymentsPending: Math.max(
            0,
            trainer.paymentsPending - client.paymentsPending,
          ),
        });
      }
    }
    setClients((prev) => prev.filter((client) => client.id !== id));
    refreshStats();
  };

  // Sales Management Functions
  const addSalesRecord = (record: Omit<SalesRecord, "id">) => {
    const newRecord: SalesRecord = {
      ...record,
      id: `sr${Date.now()}`,
    };
    setSalesRecords((prev) => [...prev, newRecord]);
    refreshStats();

    // Trigger real-time update event
    window.dispatchEvent(new CustomEvent('salesRecordAdded', { detail: newRecord }));
  };

  const updateSalesRecord = (id: string, updates: Partial<SalesRecord>) => {
    setSalesRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...updates } : record,
      ),
    );
    refreshStats();
  };

  // Utility Functions
  const getTrainerClients = (trainerId: string): Client[] => {
    return clients.filter((client) => client.trainerId === trainerId);
  };

  const getTrainerSales = (trainerId: string): SalesRecord[] => {
    const trainer = personalTrainers.find((pt) => pt.id === trainerId);
    if (!trainer) return [];
    return salesRecords.filter(
      (record) => record.personalTrainer === trainer.name,
    );
  };

  const calculateTrainerStats = (trainerId: string) => {
    const trainerClients = getTrainerClients(trainerId);
    const collected = trainerClients.reduce(
      (sum, client) => sum + client.paymentsCollected,
      0,
    );
    const pending = trainerClients.reduce(
      (sum, client) => sum + client.paymentsPending,
      0,
    );
    return { collected, pending, clients: trainerClients.length };
  };

  // Search Functions
  const searchPersonalTrainers = (query: string): PersonalTrainer[] => {
    if (!query.trim()) return personalTrainers;
    const lowerQuery = query.toLowerCase();
    return personalTrainers.filter(
      (pt) =>
        pt.name.toLowerCase().includes(lowerQuery) ||
        pt.email.toLowerCase().includes(lowerQuery) ||
        pt.specialization.toLowerCase().includes(lowerQuery) ||
        pt.status.toLowerCase().includes(lowerQuery),
    );
  };

  const searchClients = (query: string): Client[] => {
    if (!query.trim()) return clients;
    const lowerQuery = query.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.email.toLowerCase().includes(lowerQuery) ||
        client.phone.includes(query) ||
        client.membershipType.toLowerCase().includes(lowerQuery) ||
        client.status.toLowerCase().includes(lowerQuery),
    );
  };

  const searchSalesRecords = (query: string): SalesRecord[] => {
    if (!query.trim()) return salesRecords;
    const lowerQuery = query.toLowerCase();
    return salesRecords.filter(
      (record) =>
        record.leadId.toLowerCase().includes(lowerQuery) ||
        record.personalTrainer.toLowerCase().includes(lowerQuery) ||
        record.clientName.toLowerCase().includes(lowerQuery) ||
        record.serviceType.toLowerCase().includes(lowerQuery) ||
        record.status.toLowerCase().includes(lowerQuery) ||
        record.payment.toLowerCase().includes(lowerQuery),
    );
  };

  // Analytics
  const getSalesAnalytics = (period: "week" | "month" | "year") => {
    // Mock analytics data based on period
    const baseStats = {
      totalSales: adminStats.totalSales,
      monthlySales: adminStats.monthlySales,
      newUsers: adminStats.newUsers,
      balancePayment: adminStats.balancePayment,
    };

    switch (period) {
      case "week":
        return {
          ...baseStats,
          totalSales: Math.floor(baseStats.totalSales * 0.23), // ~weekly equivalent
          monthlySales: Math.floor(baseStats.monthlySales * 0.23),
          newUsers: Math.floor(baseStats.newUsers * 0.23),
          balancePayment: Math.floor(baseStats.balancePayment * 0.23),
        };
      case "year":
        return {
          ...baseStats,
          totalSales: baseStats.totalSales * 12,
          monthlySales: baseStats.monthlySales * 12,
          newUsers: baseStats.newUsers * 12,
          balancePayment: baseStats.balancePayment * 12,
        };
      default:
        return baseStats;
    }
  };

  const refreshStats = () => {
    // Recalculate stats based on current data
    const totalPaymentsCollected = personalTrainers.reduce(
      (sum, pt) => sum + pt.paymentsCollected,
      0,
    );
    const totalPaymentsPending = personalTrainers.reduce(
      (sum, pt) => sum + pt.paymentsPending,
      0,
    );
    const totalClients = clients.length;

    setAdminStats((prev) => ({
      ...prev,
      totalSales: totalPaymentsCollected,
      balancePayment: totalPaymentsPending,
      newUsers: totalClients,
    }));
  };

  return (
    <AdminDataContext.Provider
      value={{
        personalTrainers,
        clients,
        salesRecords,
        adminStats,
        addPersonalTrainer,
        updatePersonalTrainer,
        deletePersonalTrainer,
        addClient,
        updateClient,
        deleteClient,
        addSalesRecord,
        updateSalesRecord,
        getTrainerClients,
        getTrainerSales,
        calculateTrainerStats,
        searchPersonalTrainers,
        searchClients,
        searchSalesRecords,
        getSalesAnalytics,
        refreshStats,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
