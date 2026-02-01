"use client";

import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://lesarjet.camp-coding.site/api/category/list";

export default function useCategories(initialPage = 1, initialPerPage = 10) {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQueryString = (p, pp) => {
    const search = new URLSearchParams();
    if (p) search.append("page", p);
    if (pp) search.append("per_page", pp);
    return search.toString();
  };

  const fetchCategories = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);

        const qs = buildQueryString(page, perPage);
        const url = qs ? `${BASE_URL}?${qs}` : BASE_URL;

        const res = await fetch(url, {
          signal: controller?.signal,
        });

        if (!res.ok) {
          throw new Error("حدث خطأ في تحميل الفئات");
        }

        const json = await res.json();

        if (json?.success) {
          setCategories(json.data?.categories || []);
          setPagination(json.data?.pagination || null);
        } else {
          throw new Error(json?.message || "فشل في جلب الفئات");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [page, perPage]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller);

    // cleanup
    return () => controller.abort();
  }, [fetchCategories]);

  // لو حبيت refetch يدويًا (مثلاً بعد إضافة كاتيجوري جديدة)
  const refetch = () => {
    const controller = new AbortController();
    fetchCategories(controller);
  };

  return {
    categories,
    pagination,
    loading,
    error,
    page,
    perPage,
    setPage,
    setPerPage,
    refetch,
  };
}
