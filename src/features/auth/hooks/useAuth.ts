import { useAuthStore } from "../store/useAuthStore";

export interface UserSession {
  moniker: string;
  email: string;
  isLogged: boolean;
}

export default function useAuth() {
  const store = useAuthStore();

  // Flawless backward compatibility mapper for existing UI features
  const user: UserSession | null = store.user
    ? {
        moniker: store.user.user_metadata?.moniker || store.user.email?.split("@")[0] || "",
        email: store.user.email || "",
        isLogged: true,
      }
    : null;

  return {
    user,
    loading: store.loading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
  };
}
