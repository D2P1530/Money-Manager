import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/lib/storage";

const AUTH_KEY = "mm-auth";

type AuthContextValue = {
  estConnecte: boolean;
  connexion: (email: string, motDePasse: string) => boolean;
  deconnexion: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const identifiants = {
  email: "demo@journal.local",
  motDePasse: "demo123",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [estConnecte, setEstConnecte] = useLocalStorage<boolean>(AUTH_KEY, false);

  const value = useMemo<AuthContextValue>(
    () => ({
      estConnecte,
      connexion: (email, motDePasse) => {
        if (email === identifiants.email && motDePasse === identifiants.motDePasse) {
          setEstConnecte(true);
          return true;
        }
        return false;
      },
      deconnexion: () => setEstConnecte(false),
    }),
    [estConnecte, setEstConnecte]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
