import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface TrainerSession {
  id: string;
  trainerName: string;
  avatar: string;
  sessionType: string;
  totalDays: string;
  status: "Session Started" | "Session Completed" | "Session Not Started";
  rating: number;
  reviews: number;
  clientPhone?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  sessionType: string;
  trainerId?: string;
  avatar: string;
  createdAt: Date;
}

export interface OTPSession {
  id: string;
  sessionId: string;
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  isUsed: boolean;
}

interface PTSessionContextType {
  // Data
  trainerSessions: TrainerSession[];
  clients: Client[];
  currentOTPSession: OTPSession | null;

  // Session Actions
  startSession: (sessionId: string, phoneNumber: string) => Promise<boolean>;
  endSession: (sessionId: string) => Promise<boolean>;
  updateSessionStatus: (sessionId: string, status: TrainerSession["status"]) => void;

  // Client Actions
  addClient: (client: Omit<Client, "id" | "createdAt">) => Promise<boolean>;
  updateClient: (id: string, updates: Partial<Client>) => void;
  getClientsByTrainer: (trainerId: string) => Client[];

  // OTP Actions
  sendOTP: (phoneNumber: string, sessionId: string) => Promise<{ success: boolean; otp?: string; message: string }>;
  verifyOTP: (sessionId: string, otp: string) => Promise<boolean>;
  resendOTP: (sessionId: string) => Promise<boolean>;

  // Search and Filter
  searchSessions: (query: string) => TrainerSession[];
  filterSessionsByStatus: (status: string) => TrainerSession[];

  // Real-time updates
  refreshData: () => void;
}

const PTSessionContext = createContext<PTSessionContextType | undefined>(undefined);

export const usePTSession = () => {
  const context = useContext(PTSessionContext);
  if (context === undefined) {
    throw new Error("usePTSession must be used within a PTSessionProvider");
  }
  return context;
};

interface PTSessionProviderProps {
  children: ReactNode;
}

export const PTSessionProvider: React.FC<PTSessionProviderProps> = ({ children }) => {
  const [trainerSessions, setTrainerSessions] = useState<TrainerSession[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [currentOTPSession, setCurrentOTPSession] = useState<OTPSession | null>(null);

  // Initialize with mock data
  useEffect(() => {
    const mockSessions: TrainerSession[] = [
      {
        id: "1",
        trainerName: "Nina Elle (Nina ella)",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "P Training",
        totalDays: "9No",
        status: "Session Started",
        rating: 4.7,
        reviews: 312,
        clientPhone: "+1234567890",
        startTime: new Date(),
      },
      {
        id: "2",
        trainerName: "Nina Elle (Nina ella)",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "Consultation",
        totalDays: "5No",
        status: "Session Completed",
        rating: 4.7,
        reviews: 312,
        endTime: new Date(Date.now() - 3600000), // 1 hour ago
        duration: 60,
      },
      {
        id: "3",
        trainerName: "Mike Johnson",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "Consultation",
        totalDays: "2No",
        status: "Session Not Started",
        rating: 4.5,
        reviews: 189,
      },
      {
        id: "4",
        trainerName: "Sarah Wilson",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "P Training",
        totalDays: "8No",
        status: "Session Started",
        rating: 4.8,
        reviews: 425,
        clientPhone: "+1234567891",
        startTime: new Date(Date.now() - 1800000), // 30 minutes ago
      },
      {
        id: "5",
        trainerName: "Alex Thompson",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "P Training",
        totalDays: "8No",
        status: "Session Completed",
        rating: 4.6,
        reviews: 278,
        endTime: new Date(Date.now() - 7200000), // 2 hours ago
        duration: 90,
      },
      {
        id: "6",
        trainerName: "Emma Davis",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "Consultation",
        totalDays: "1No",
        status: "Session Not Started",
        rating: 4.9,
        reviews: 156,
      },
      {
        id: "7",
        trainerName: "David Brown",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "Consultation",
        totalDays: "5No",
        status: "Session Completed",
        rating: 4.4,
        reviews: 203,
        endTime: new Date(Date.now() - 86400000), // 1 day ago
        duration: 45,
      },
      {
        id: "8",
        trainerName: "Lisa Garcia",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "P Training",
        totalDays: "6No",
        status: "Session Started",
        rating: 4.7,
        reviews: 334,
        clientPhone: "+1234567892",
        startTime: new Date(Date.now() - 900000), // 15 minutes ago
      },
      {
        id: "9",
        trainerName: "Ryan Miller",
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: "Consultation",
        totalDays: "5No",
        status: "Session Completed",
        rating: 4.3,
        reviews: 167,
        endTime: new Date(Date.now() - 43200000), // 12 hours ago
        duration: 30,
      },
    ];

    const mockClients: Client[] = [
      {
        id: "cl1",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1234567890",
        sessionType: "P Training",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        createdAt: new Date("2023-11-01"),
      },
      {
        id: "cl2",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1234567891",
        sessionType: "Consultation",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        createdAt: new Date("2023-11-02"),
      },
      {
        id: "cl3",
        name: "Mike Davis",
        email: "mike.davis@email.com",
        phone: "+1234567892",
        sessionType: "P Training",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        createdAt: new Date("2023-11-03"),
      },
    ];

    setTrainerSessions(mockSessions);
    setClients(mockClients);
  }, []);

  // Generate a random 6-digit OTP
  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP to phone number
  const sendOTP = async (phoneNumber: string, sessionId: string): Promise<{ success: boolean; otp?: string; message: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const otp = generateOTP();
      const otpSession: OTPSession = {
        id: `otp_${Date.now()}`,
        sessionId,
        phoneNumber,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        isUsed: false,
      };

      setCurrentOTPSession(otpSession);

      // In a real app, you would send SMS here using a service like Twilio
      // For demo purposes, we'll just log it and return success
      console.log(`Sending OTP ${otp} to ${phoneNumber}`);
      
      return {
        success: true,
        otp: otp, // In production, don't return OTP in response
        message: `OTP sent successfully to ${phoneNumber}`
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send OTP. Please try again."
      };
    }
  };

  // Verify OTP
  const verifyOTP = async (sessionId: string, otp: string): Promise<boolean> => {
    if (!currentOTPSession || currentOTPSession.sessionId !== sessionId) {
      return false;
    }

    if (currentOTPSession.isUsed) {
      return false;
    }

    if (new Date() > currentOTPSession.expiresAt) {
      return false;
    }

    if (currentOTPSession.otp !== otp) {
      return false;
    }

    // Mark OTP as used
    setCurrentOTPSession(prev => prev ? { ...prev, isUsed: true } : null);
    return true;
  };

  // Resend OTP
  const resendOTP = async (sessionId: string): Promise<boolean> => {
    if (!currentOTPSession || currentOTPSession.sessionId !== sessionId) {
      return false;
    }

    const result = await sendOTP(currentOTPSession.phoneNumber, sessionId);
    return result.success;
  };

  // Start session
  const startSession = async (sessionId: string, phoneNumber: string): Promise<boolean> => {
    try {
      setTrainerSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { 
                ...session, 
                status: "Session Started" as const,
                startTime: new Date(),
                clientPhone: phoneNumber
              }
            : session
        )
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  // End session - removes session from data
  const endSession = async (sessionId: string): Promise<boolean> => {
    try {
      const session = trainerSessions.find(s => s.id === sessionId);
      if (!session || session.status !== "Session Started") {
        return false;
      }

      // Calculate session duration for notification
      const endTime = new Date();
      const duration = session.startTime
        ? Math.floor((endTime.getTime() - session.startTime.getTime()) / 60000) // minutes
        : 0;

      // Remove the session from the data instead of marking it completed
      setTrainerSessions(prev => prev.filter(s => s.id !== sessionId));

      return true;
    } catch (error) {
      return false;
    }
  };

  // Update session status
  const updateSessionStatus = (sessionId: string, status: TrainerSession["status"]) => {
    setTrainerSessions(prev => 
      prev.map(session => 
        session.id === sessionId ? { ...session, status } : session
      )
    );
  };

  // Add client
  const addClient = async (client: Omit<Client, "id" | "createdAt">): Promise<boolean> => {
    try {
      const newClient: Client = {
        ...client,
        id: `cl_${Date.now()}`,
        createdAt: new Date(),
      };

      setClients(prev => [...prev, newClient]);

      // Auto-create a session for the new client
      const newSession: TrainerSession = {
        id: `session_${Date.now()}`,
        trainerName: "Current Trainer", // This should be the logged-in trainer
        avatar: "https://cdn.builder.io/api/v1/image/assets%2F4fd6adf83c1646c6853676927841fb27%2F3b7549571549429083ff19cafabe4e77?format=webp&width=400",
        sessionType: client.sessionType,
        totalDays: "1No",
        status: "Session Not Started",
        rating: 5.0,
        reviews: 0,
        clientPhone: client.phone,
      };

      setTrainerSessions(prev => [...prev, newSession]);

      // Trigger admin data sync for client addition
      window.dispatchEvent(new CustomEvent('ptClientAdded', {
        detail: {
          ...newClient,
          trainerId: 'pt1', // Current trainer ID - should come from auth context
          paymentsCollected: 0,
          paymentsPending: Math.floor(Math.random() * 2000) + 500,
          status: 'Active' as const,
          joinDate: new Date(),
          membershipType: client.sessionType,
          address: 'Client Address', // Should be collected in form
          gender: 'Male' as const, // Should be collected in form
        }
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  // Update client
  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  // Get clients by trainer
  const getClientsByTrainer = (trainerId: string): Client[] => {
    return clients.filter(client => client.trainerId === trainerId);
  };

  // Search sessions
  const searchSessions = (query: string): TrainerSession[] => {
    if (!query.trim()) return trainerSessions;
    const lowerQuery = query.toLowerCase();
    return trainerSessions.filter(session =>
      session.trainerName.toLowerCase().includes(lowerQuery) ||
      session.sessionType.toLowerCase().includes(lowerQuery) ||
      session.id.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter sessions by status
  const filterSessionsByStatus = (status: string): TrainerSession[] => {
    if (status === "all") return trainerSessions;
    return trainerSessions.filter(session => session.status === status);
  };

  // Refresh data (for real-time updates)
  const refreshData = () => {
    // In a real app, this would fetch fresh data from the server
    // For now, we'll just trigger a re-render
    setTrainerSessions(prev => [...prev]);
    setClients(prev => [...prev]);
  };

  return (
    <PTSessionContext.Provider
      value={{
        trainerSessions,
        clients,
        currentOTPSession,
        startSession,
        endSession,
        updateSessionStatus,
        addClient,
        updateClient,
        getClientsByTrainer,
        sendOTP,
        verifyOTP,
        resendOTP,
        searchSessions,
        filterSessionsByStatus,
        refreshData,
      }}
    >
      {children}
    </PTSessionContext.Provider>
  );
};
