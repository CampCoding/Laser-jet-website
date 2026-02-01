"use client";

import { useState, useEffect } from "react";
import GetMytoken from "../src/lib/GetuserToken";

const BASE_URL = "https://lesarjet.camp-coding.site/api/product/list";

export default function useProductsSearch(filters = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // لو الـ API بيرجعها
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQueryString = (p) => {
    const search = new URLSearchParams();

    if (p.keyword !== undefined) {
      search.append("keywords", p.keyword || "");
    }

    if (p.min_price) search.append("min_price", p.min_price);
    if (p.max_price) search.append("max_price", p.max_price);
    if (p.date_from) search.append("date_from", p.date_from);
    if (p.date_to) search.append("date_to", p.date_to);
    if (p.min_sold) search.append("min_sold", p.min_sold);
    if (p.max_sold) search.append("max_sold", p.max_sold);

    if (p.sort_by) search.append("sort_by", p.sort_by);
    if (p.sort_order) search.append("sort_order", p.sort_order);

    // ✅ فلترة بفئة واحدة فقط
    if (p.category_id) {
      search.append("category_id", p.category_id);
    }

    // ✅ رقم الصفحة
    if (p.page) {
      search.append("page", p.page);
    }

    // لو حابب تتحكم في عدد العناصر في الصفحة:
    if (p.per_page) {
      search.append("per_page", p.per_page);
    }

    return search.toString();
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const qs = buildQueryString(filters);
        const url = qs ? `${BASE_URL}?${qs}` : BASE_URL;
        const token = await GetMytoken();

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("حدث خطأ في تحميل البيانات");
        }

        const json = await res.json();

        // 🔄 دعم الشكلين للـ response:
        // 1) { success, data: { products, categories, pagination } }
        // 2) { products, pagination, categories }
        if (json?.success && json.data) {
          const d = json.data;
          setProducts(d.products || []);
          setCategories(d.categories || []);
          setPagination(d.pagination || null);
        } else {
          setProducts(json.products || []);
          setCategories(json.categories || []);
          setPagination(json.pagination || null);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [
    filters.keyword,
    filters.min_price,
    filters.max_price,
    filters.date_from,
    filters.date_to,
    filters.min_sold,
    filters.max_sold,
    filters.sort_by,
    filters.sort_order,
    filters.category_id,
    filters.page,
    filters.per_page,
  ]);

  return {
    products,
    categories,
    pagination,
    loading,
    error,
  };
}
