// src/hooks/useCategoryProducts.js
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "https://lesarjet.camp-coding.site/api";

export default function useCategoryProducts({
  categoryId,
  initialPage = 1,
  perPage = 12,
  token = null,        // 👈 لو حابب تبعت توكن عشان isInCart و isInWishlist
  enabled = true,      // 👈 لو false مش هيعمل fetch لحد ما تفعّله
}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true); // للسكيلتون أول مرة بس
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    async (overridePage) => {
      if (!categoryId || !enabled) return;

      const currentPage = overridePage ?? page;

      try {
        setLoading(true);
        if (firstLoading) setFirstLoading(true);
        setError(null);

        const res = await axios.get(`${API_BASE_URL}/product/list`, {
          params: {
            category_id: categoryId,
            page: currentPage,
            per_page: perPage,
          },
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        const apiData = res.data;

        if (!apiData.success) {
          throw new Error(apiData.message || "تعذّر جلب المنتجات");
        }

        const data = apiData.data || {};
        setProducts(data.products || []);
        setPagination(data.pagination || null);
        setPage(data.pagination?.current_page || currentPage);
      } catch (err) {
        console.error("useCategoryProducts error:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "حدث خطأ غير متوقع أثناء جلب المنتجات"
        );
      } finally {
        setLoading(false);
        setFirstLoading(false);
      }
    },
    [categoryId, page, perPage, token, enabled, firstLoading]
  );

  // 📥 جلب أولي + كل ما يتغير categoryId أو perPage
  useEffect(() => {
    if (!enabled || !categoryId) return;
    setPage(initialPage);
    fetchProducts(initialPage);
  }, [categoryId, perPage, enabled, initialPage, fetchProducts]);

  // 🧭 دوال تنقل بين الصفحات
  const hasNextPage =
    pagination && pagination.current_page < pagination.totalPages;
  const hasPrevPage = pagination && pagination.current_page > 1;

  const goToPage = (newPage) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchProducts(newPage);
  };

  const nextPage = () => {
    if (!hasNextPage) return;
    fetchProducts(pagination.current_page + 1);
  };

  const prevPage = () => {
    if (!hasPrevPage) return;
    fetchProducts(pagination.current_page - 1);
  };

  const refetch = () => fetchProducts();

  return {
    products,
    pagination,
    page,
    setPage: goToPage, // 👈 يخليك تستخدمه في UI
    loading,
    firstLoading,      // لو محتاج تفرق بين أول تحميل وبين تغيّر صفحة
    error,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    refetch,
  };
}
