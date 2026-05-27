import { useState } from "react";

export interface UserSession {
  moniker: string;
  email: string;
  isLogged: boolean;
}

const MOCK_USER = {
  moniker: "ReaderOne",
  email: "reader@sanctuary.com",
  password: "password123",
};

export default function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email || !password) {
      setError("Please fill in all credentials.");
      setLoading(false);
      return false;
    }

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      setUser({
        moniker: MOCK_USER.moniker,
        email: MOCK_USER.email,
        isLogged: true,
      });
      setLoading(false);
      return true;
    } else {
      setError("Invalid email or password.");
      setLoading(false);
      return false;
    }
  };

  const register = async (
    moniker: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!moniker || !email || !password) {
      setError("Please fill in all registration fields.");
      setLoading(false);
      return false;
    }

    if (email.indexOf("@") === -1) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return false;
    }

    setUser({
      moniker,
      email,
      isLogged: true,
    });
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };
}
