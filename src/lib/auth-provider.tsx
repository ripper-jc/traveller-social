import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axiosInstance from "./axios";

interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", {
        username,
        password,
      });

      const userData = response.data;

      // Store user data as JSON
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Store token directly without quotes - remove any quotes if present
      if (userData) {
        // Remove any surrounding quotes that might be in the token
        const cleanToken = userData.replace(/^"|"$/g, "");
        localStorage.setItem("user_token", cleanToken);
      }

      // Redirect can be handled by the component using this hook
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/users/register", {
        username,
        email,
        password,
      });

      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Store token directly without quotes - remove any quotes if present
      if (userData.token) {
        // Remove any surrounding quotes that might be in the token
        const cleanToken = userData.token.replace(/^"|"$/g, "");
        localStorage.setItem("user_token", cleanToken);
      }

      // Redirect can be handled by the component using this hook
      return userData;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("user_token"); // Also remove the token
    // Redirect can be handled by the component
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
