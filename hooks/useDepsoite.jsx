// src/hooks/useDeposit.js
"use client";

import { useState, useCallback } from "react";
import GetMytoken from "../src/lib/GetuserToken";

export function useDeposit({ onSuccess, onError } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const deposit = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await GetMytoken();

        const res = await fetch(
          "https://lesarjet.camp-coding.site/api/admin/transactions/deposite/create",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const json = await res.json();

        if (!res.ok) {
          const message = json?.message || "Failed to fetch transactions";
          const err = new Error(message);
          setError(err);
          if (typeof onError === "function") onError(err);
          throw err;
        }

        setData(json);
        if (typeof onSuccess === "function") onSuccess(json);

        return json;
      } catch (err) {
        if (!(err instanceof Error)) {
          const wrapped = new Error("Unexpected error");
          setError(wrapped);
          if (typeof onError === "function") onError(wrapped);
          throw wrapped;
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setData(null);
    setError(null);
  }, []);

  return {
    deposit,
    isLoading,
    data,
    error,
    reset,
  };
}
