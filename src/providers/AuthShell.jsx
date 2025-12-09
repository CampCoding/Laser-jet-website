"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

const AuthRedirectContext = createContext(null);

export function useAuthRedirect() {
  return useContext(AuthRedirectContext);
}

export function AuthShell({ children }) {
  const searchParams = useSearchParams();
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    // 1) If we have ?redirect=... in URL, save it
    const qRedirect = searchParams.get("redirect");
    if (qRedirect) {
      sessionStorage.setItem("authRedirect", qRedirect);
      setRedirect(qRedirect);
      return;
    }

    // 2) Otherwise, reuse what we already stored
    const stored = sessionStorage.getItem("authRedirect");
    if (stored) {
      setRedirect(stored);
    }
  }, [searchParams]);

  return (
    <AuthRedirectContext.Provider value={redirect}>
      {children}
    </AuthRedirectContext.Provider>
  );
}
