"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useGetOffers({ page = 1, per_page = 10 } = {}) {
  const { data: session, status } = useSession();

  const [data, setData] = useState(null); // ← ده هيكون json.data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = session?.user?.accessToken; // عدّل الاسم لو مختلف عندك

  useEffect(() => {
    let cancelled = false;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `https://lesarjet.camp-coding.site/api/product/offers/list?page=${page}&per_page=${per_page}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.message || "Failed to fetch offers");
        }

        if (!cancelled) {
          setData(json?.data ?? null);
        }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // لو session لسه بيحمّل
    if (status === "loading") return;

    // لو مفيش token (مش عامل login مثلًا)
    if (!token) {
      setLoading(false);
      setData(null);
      return;
    }

    fetchOffers();

    return () => {
      cancelled = true;
    };
  }, [page, per_page, token, status]);

  const offers = data?.offers || [];
  const pagination = data?.pagination || {};

  const current_page = Number(pagination.current_page) || page;
  const last_page = Number(pagination.totalPages) || 1;
  const total = Number(pagination.total) || 0;

  return {
    data,
    offers,
    pagination: { ...pagination, current_page, totalPages: last_page, total },
    loading,
    error,
  };
}
