"use client";

import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://lesarjet.camp-coding.site/api/notification/list";

/**
 * 📨 Hook لجلب الإشعارات الخاصة باليوزر الحالي
 *
 * @param {string} token - توكن المستخدم (JWT) مثلاً من NextAuth session
 *
 * Example:
 *   const { notifications, loading, error, refetch } = useNotifications(accessToken);
 */
export default function useNotifications(token) {
  const [notifications, setNotifications] = useState([]); // data.data.addresses
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔁 دالة الجلب نفسها (نستخدمها في useEffect وrefetch)
  const fetchNotifications = useCallback(
    async (signal) => {
      if (!token) {
        // مفيش توكن → مفيش كول
        setNotifications([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(BASE_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ مهم
          },
          signal,
        });

        if (!res.ok) {
          throw new Error("حدث خطأ أثناء جلب الإشعارات");
        }

        const json = await res.json();

        if (!json?.success) {
          throw new Error(json?.message || "فشل في جلب الإشعارات");
        }

        const list = json?.data?.addresses || [];
        setNotifications(list);
      } catch (err) {
        // لو الـ fetch اتكنسل بــ AbortController
        if (err.name === "AbortError") return;
        console.error("Notifications error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // 🔥 أول تحميل + كل ما التوكن يتغير
  useEffect(() => {
    const controller = new AbortController();
    fetchNotifications(controller.signal);
    return () => controller.abort();
  }, [fetchNotifications]);

  // 🧵 refetch manual لو عايز تحدث الليست بعد action
  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchNotifications(controller.signal);
    return () => controller.abort();
  }, [fetchNotifications]);

  return {
    notifications, // array من الإشعارات (data.data.addresses)
    loading,
    error,
    refetch,
  };
}
