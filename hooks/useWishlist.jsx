// src/hooks/useAddToWishList.js
"use client";

import { useCallback, useState } from "react";
import GetMytoken from "@/lib/GetuserToken";

export function useAddToWishList({ onSuccess, onError } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const addToWishList = useCallback(
    async (product_id) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = await GetMytoken();

        if (!token) {
          const result = {
            success: false,
            message:
              "من فضلك سجل دخول أولاً قبل إضافة المنتجات إلى قائمة المفضلة",
            requireLogin: true,
          };
          setData(result);
          onSuccess?.(result);
          return result;
        }

        const res = await fetch(
          "https://lesarjet.camp-coding.site/api/user/wishlist/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ product_id }),
          }
        );

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = json?.message || "Failed to add to wishlist";
          const err = new Error(msg);
          setError(err);
          onError?.(err);
          throw err;
        }

        setData(json);
        onSuccess?.(json);
        return json;
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Unexpected error");
        setError(e);
        onError?.(e);
        throw e;
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
    addToWishList,
    isLoading,
    data,
    error,
    reset,
  };
}
