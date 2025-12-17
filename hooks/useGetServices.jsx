"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const SERVICES_API = "https://lesarjet.camp-coding.site/api/services/user/list";

export default function useGetServices(options = {}) {
  const {
    onlyActive = true, // لو true يرجّع الخدمات النشطة فقط
    autoFetch = true, // لو false مش هيعمل fetch تلقائي
  } = options;

  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(SERVICES_API);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Request failed");
      }

      const list = res.data?.data?.services || [];
      const filtered = onlyActive
        ? list.filter((s) => Number(s.is_active) === 1)
        : list;

      setServices(filtered);
      setPagination(res.data?.data?.pagination || null);

      return filtered;
    } catch (e) {
      setError(e?.message || "Failed to load services");
      setServices([]);
      setPagination(null);
      return [];
    } finally {
      setLoading(false);
    }
  }, [onlyActive]);

  useEffect(() => {
    if (!autoFetch) return;
    fetchServices();
  }, [autoFetch, fetchServices]);

  return {
    services,
    pagination,
    loading,
    error,
    refetch: fetchServices, // ✅ تستخدمها لو عايز تعيد الجلب
  };
}
