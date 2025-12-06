"use client";

import { useCallback, useState } from "react";
import GetMytoken from "../src/lib/GetuserToken";

/**
 * Custom hook to send money
 *
 * Usage:
 * const { sendMoney, isLoading, isSuccess, error, data, reset } = useSendMoney({
 *   onSuccess: (res) => console.log("✅", res),
 *   onError: (err) => console.log("❌", err.message),
 * });
 */
export function useSendMoney({ onSuccess, onError } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sendMoney = useCallback(
    async (payload) => {
      setIsLoading(true);
      setIsSuccess(false);
      setError(null);

      try {
        const token = await GetMytoken();

        const res = await fetch(
          "https://lesarjet.camp-coding.site/api/user/money/create",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            // cache: "no-store",
          }
        );

        const json = await res.json();

        if (!res.ok) {
          const message = json?.message || "Failed to send money";
          throw new Error(message);
        }

        setData(json);
        setIsSuccess(true);

        // كول باك نجاح اختياري
        if (typeof onSuccess === "function") {
          onSuccess(json);
        }

        return json;
      } catch (err) {
        const normalizedError =
          err instanceof Error ? err : new Error("Unexpected error");

        setError(normalizedError);

        // كول باك خطأ اختياري
        if (typeof onError === "function") {
          onError(normalizedError);
        }

        throw normalizedError; // لو حابب تتعامل مع الخطأ في الكومبوننت نفسه
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setData(null);
  }, []);

  return {
    sendMoney,
    isLoading,
    isSuccess,
    error,
    data,
    reset,
  };
}
