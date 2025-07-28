import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { emailService } from "@/services/emailService";

export type UserRole = "admin" | "pt";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message: string; resetLink?: string }>;
  resetPassword: (
    token: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("pt");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Mock storage for demo purposes - in production, use a real backend
  const getStoredUsers = (): Array<User & { password: string }> => {
    const stored = localStorage.getItem("wtf_users");
    return stored ? JSON.parse(stored) : [];
  };

  const storeUser = (userData: User & { password: string }) => {
    const users = getStoredUsers();
    const existingIndex = users.findIndex((u) => u.email === userData.email);
    if (existingIndex >= 0) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    localStorage.setItem("wtf_users", JSON.stringify(users));
  };

  const login = async (
    email: string,
    password: string,
    role: UserRole,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = getStoredUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password && u.role === role,
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        setSelectedRole(role);
        localStorage.setItem(
          "wtf_current_user",
          JSON.stringify(userWithoutPassword),
        );
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = getStoredUsers();
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        return false; // User already exists
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role,
      };

      storeUser(newUser);

      // Don't auto-login, just return success
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wtf_current_user");
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("wtf_current_user", JSON.stringify(updatedUser));
    }
  };

  const forgotPassword = async (
    email: string,
  ): Promise<{ success: boolean; message: string; resetLink?: string }> => {
    setIsLoading(true);
    try {
      const users = getStoredUsers();
      const user = users.find((u) => u.email === email);

      if (!user) {
        return {
          success: false,
          message: "No account found with this email address",
        };
      }

      // Send actual email using email service
      const result = await emailService.sendPasswordResetEmail(email);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const result = await emailService.resetPassword(token, newPassword);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize default users and check for existing session on mount
  useEffect(() => {
    // Initialize default users if none exist
    const users = getStoredUsers();
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: "1",
          email: "admin@wtf.com",
          password: "admin123",
          name: "Admin User",
          role: "admin" as UserRole,
        },
        {
          id: "2",
          email: "pt@wtf.com",
          password: "pt123",
          name: "Personal Trainer",
          role: "pt" as UserRole,
        },
        {
          id: "3",
          email: "trainer@wtf.com",
          password: "trainer123",
          name: "Fitness Trainer",
          role: "pt" as UserRole,
        },
      ];

      defaultUsers.forEach((user) => storeUser(user));
    }

    // Check for existing session
    const storedUser = localStorage.getItem("wtf_current_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSelectedRole(userData.role);
      } catch (error) {
        // If stored data is corrupted, clear it
        localStorage.removeItem("wtf_current_user");
      }
    }
    setIsInitializing(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedRole,
        setSelectedRole,
        login,
        register,
        logout,
        updateUser,
        forgotPassword,
        resetPassword,
        isLoading,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
