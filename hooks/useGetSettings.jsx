"use client"


import { useState, useCallback } from "react";
import { toast } from "sonner";

export default function useGetSettings(accessToken) {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "https://lesarjet.camp-coding.site/api/settings/list";

 

  // 🟦 Fetch Settings (GET)
  const fetchSettings = useCallback(async () => {

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}`, {
        method: "GET",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "فشل تحميل العناوين");
      }

      const data = await res.json();

      // ✅ يدعم الشكل القديم والجديد:
      const list = data?.data || data || [];

      setSettings(list);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError(err.message);
      toast.error(err.message || "حدث خطأ أثناء تحميل العناوين");
    } finally {
      setLoading(false);
    }
  }, [accessToken, baseUrl]);


  return {
    settings,
    loading,
    error,
    fetchSettings,
    setSettings, // لو حبيت تعدّلها يدويًا من الكومبوننت
  };
}
