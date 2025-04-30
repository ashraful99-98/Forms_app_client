import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  isBlocked: any;
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateUserRole: (id: string, role: string) => Promise<void>;
  blockUser: (id: string) => Promise<void>;
  unblockUser: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  blockUsers: (userIds: string[]) => Promise<void>; // <-- added
  unblockUsers: (userIds: string[]) => Promise<void>; // <-- added
  deleteUsers: (userIds: string[]) => Promise<void>; // <-- added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        // "http://localhost:8000/api/auth/login",
        "https://form-app-server-4-7.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      // const response = await axios.get("http://localhost:8000/api/users/me", {
      const response = await axios.get(
        "https://form-app-server-4-7.onrender.com/api/users/me",
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
    } catch (error) {
      console.log("User not logged in:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        // "http://localhost:8000/api/auth/logout",
        "https://form-app-server-4-7.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Logout error:", error);
    }
    setUser(null);
  };

  const fetchAllUsers = async () => {
    try {
      // const response = await axios.get("http://localhost:8000/api/users", {
      const response = await axios.get(
        "https://form-app-server-4-7.onrender.com/api/users",
        {
          withCredentials: true,
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      await axios.put(
        // "http://localhost:8000/api/users/updateRole",
        "https://form-app-server-4-7.onrender.com/api/users/updateRole",
        { id, role },
        { withCredentials: true }
      );
      fetchAllUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const blockUser = async (id: string) => {
    try {
      await axios.patch(
        // `http://localhost:8000/api/users/block/${id}`,
        `https://form-app-server-4-7.onrender.com/api/users/block/${id}`,
        {},
        { withCredentials: true }
      );
      fetchAllUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const unblockUser = async (id: string) => {
    try {
      await axios.patch(
        // `http://localhost:8000/api/users/unblock/${id}`,
        `https://form-app-server-4-7.onrender.com/api/users/unblock/${id}`,
        {},
        { withCredentials: true }
      );
      fetchAllUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(
        `https://form-app-server-4-7.onrender.com/api/users/${id}`,
        {
          withCredentials: true,
        }
      );
      fetchAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // New functions for multiple users
  const blockUsers = async (userIds: string[]) => {
    try {
      await axios.patch(
        "https://form-app-server-4-7.onrender.com/api/users/block",
        { userIds },
        { withCredentials: true }
      );
      fetchAllUsers();
    } catch (error) {
      console.error("Error blocking multiple users:", error);
    }
  };

  const unblockUsers = async (userIds: string[]) => {
    try {
      await axios.patch(
        "https://form-app-server-4-7.onrender.com/api/users/unblock",
        { userIds },
        { withCredentials: true }
      );
      fetchAllUsers();
    } catch (error) {
      console.error("Error unblocking multiple users:", error);
    }
  };

  const deleteUsers = async (userIds: string[]) => {
    try {
      await axios.delete("https://form-app-server-4-7.onrender.com/api/users", {
        data: { userIds },
        withCredentials: true,
      });
      fetchAllUsers();
    } catch (error) {
      console.error("Error deleting multiple users:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        logout,
        fetchCurrentUser,
        fetchAllUsers,
        updateUserRole,
        blockUser,
        unblockUser,
        deleteUser,
        blockUsers, // <--- added here
        unblockUsers, // <--- added here
        deleteUsers, // <--- added here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
