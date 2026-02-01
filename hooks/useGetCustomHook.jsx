"use client";

import { useState, useCallback, useLayoutEffect } from "react";

const BASE_URL = "https://lesarjet.camp-coding.site/api/user/wishlist/list";

export default function useWishlist(token) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    // لو مفيش توكن: فضّي الليست واطلع
    if (!token) {
      setWishlist([]);
      setLoading(false);
      setError(null);
      return;
    }
    
    const controller = new AbortController();

    try {
      setLoading(true);
      setError(null);
      console.log("fetching wishlist");

      const res = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ حط التوكن هنا
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء جلب قائمة المفضلة");
      }

      const json = await res.json();

      if (json?.success) {
        setWishlist(json.data || []);
      } else {
        throw new Error(json?.message || "فشل في جلب قائمة المفضلة");
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Wishlist error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [token]);

  // أول مرة وأي تغيير في التوكن
  useLayoutEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // refetch يدوي
  const refetch = () => {
    fetchWishlist();
  };

  return {
    wishlist,
    loading,
    error,
    refetch,
    count: wishlist.length || 0,
  };
}
