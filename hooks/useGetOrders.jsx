"use client";

import { useState, useEffect } from "react";

const API_URL = "https://lesarjet.camp-coding.site/api/order/list";

export default function useOrders(token, page = 1, perPage = 10) {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // لو مفيش توكن => لا نعمل ريكويست
    if (!token) {
      setOrders([]);
      setPagination(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(API_URL);

        if (page) url.searchParams.set("page", String(page));
        if (perPage) url.searchParams.set("per_page", String(perPage));

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`فشل الاتصال بالسيرفر (status: ${res.status})`);
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "تعذر جلب الطلبات");
        }

        setOrders(json?.data?.orders || []);
        setPagination(json?.data?.pagination || null);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching orders:", err);
        setError(err.message || "حدث خطأ غير متوقع أثناء جلب الطلبات");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, [token, page, perPage]);

  return { orders, pagination, loading, error };
}
