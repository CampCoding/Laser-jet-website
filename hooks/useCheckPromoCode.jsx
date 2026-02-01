// hooks/useCheckPromoCode.js
"use client";

import { useCallback, useRef, useState } from "react";
import axios from "axios";
import GetMytoken from "../src/lib/GetuserToken";

const API_URL = "https://lesarjet.camp-coding.site/api/promo-codes/check";

export default function useCheckPromoCode() {
  const [data, setData] = useState(null); // full API response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ يمنع إن ريكوست قديم يكتب فوق الجديد
  const requestIdRef = useRef(0);

  const reset = useCallback(() => {
    setData(null);
    setError("");
    setLoading(false);
  }, []);

  const checkPromo = useCallback(async ({ code, orderTotal }) => {
    const reqId = ++requestIdRef.current;

    setLoading(true);
    setError("");

    try {
      const token = await GetMytoken();

      if (!token) throw new Error("Missing token");
      if (!code?.trim()) throw new Error("Missing promo code");

      const totalNum = Number(orderTotal);
      if (orderTotal == null || Number.isNaN(totalNum)) {
        throw new Error("Invalid order total");
      }

      const res = await axios.post(
        API_URL,
        { code: code.trim(), order_total: totalNum },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // لو في ريكوست أحدث اتعمل، تجاهل ده
      if (reqId !== requestIdRef.current) return null;

      setData(res.data);
      return res.data;
    } catch (err) {
      if (reqId !== requestIdRef.current) return null;

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to check promo code";

      setError(msg);
      setData(null);
      return null;
    } finally {
      // ما نقفلش loading لو فيه ريكوست أحدث شغال
      if (reqId === requestIdRef.current) setLoading(false);
    }
  }, []);

  return { checkPromo, data, loading, error, reset };
}
