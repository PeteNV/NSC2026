import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { loadUser, saveUser, type UserData } from "@/utils/storage";

type UserContextValue = {
  user: UserData | null;
  setUser: (data: UserData) => void;
  loaded: boolean;
  onboarded: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUserState] = useState<UserData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadUser();
      if (cancelled) return;
      if (stored) setUserState(stored);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setUser = useCallback((data: UserData) => {
    setUserState(data);
    saveUser(data);
  }, []);

  const onboarded = user?.onboarded ?? false;

  const value = useMemo<UserContextValue>(
    () => ({ user, setUser, loaded, onboarded }),
    [user, setUser, loaded, onboarded],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
