import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const DemoProfileContext = createContext(null);

export function DemoProfileProvider({ children }) {
  const { user } = useAuth();
  const storageKey = useMemo(() => `bankdemo:profile:${user?.id || "guest"}`, [user?.id]);

  const [ownerId, setOwnerId] = useState(null);
  const [showMineOnly, setShowMineOnly] = useState(false);

  // Cargar preferencias guardadas por usuario
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setOwnerId(parsed.ownerId ?? null);
        setShowMineOnly(!!parsed.showMineOnly);
      } else {
        setOwnerId(null);
        setShowMineOnly(false);
      }
    } catch {
      setOwnerId(null);
      setShowMineOnly(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Si no hay ownerId guardado, tomarlo de Supabase user_metadata y activar filtro
  useEffect(() => {
    if (ownerId == null) {
      const metaOwner = user?.user_metadata?.ownerId;
      const n = Number(metaOwner);
      if (Number.isInteger(n) && n > 0) {
        setOwnerId(n);
        setShowMineOnly(true);
      }
    }
  }, [user, ownerId]);

  // Guardar al cambiar
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ownerId, showMineOnly }));
    } catch {}
  }, [ownerId, showMineOnly, storageKey]);

  const value = { ownerId, setOwnerId, showMineOnly, setShowMineOnly };
  return <DemoProfileContext.Provider value={value}>{children}</DemoProfileContext.Provider>;
}

export function useDemoProfile() {
  const ctx = useContext(DemoProfileContext);
  if (!ctx) throw new Error("useDemoProfile must be used within DemoProfileProvider");
  return ctx;
}