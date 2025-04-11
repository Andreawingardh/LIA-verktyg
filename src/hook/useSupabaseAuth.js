"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    console.log("Auth hook initialized");
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => { 
    try {
      await supabase.auth.signOut();
      console.log("User logged out");
      setUser(null);
    }catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return { user, loading, logout };
}
