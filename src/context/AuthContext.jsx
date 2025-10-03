import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  const value = {
    session,
    user,
    loading,

    async signIn({ email, password }) {
      return supabase.auth.signInWithPassword({ email, password });
    },

    // signUp admite options para pasar user_metadata
    async signUp({ email, password, options }) {
      return supabase.auth.signUp({ email, password, options });
    },

    async signOut() {
      return supabase.auth.signOut();
    },

    // actualizar user_metadata
    async updateUserMetadata(data) {
      const { data: res, error } = await supabase.auth.updateUser({ data });
      if (!error && res?.user) {
        // refresca el usuario en memoria para que el cambio se refleje ya
        setUser(res.user);
      }
      return { data: res, error };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
