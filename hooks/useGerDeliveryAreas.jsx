import { useState, useCallback } from "react";
import { toast } from "sonner";
import GetMytoken from "../src/lib/GetuserToken";

export default function useGetDeliveryAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl =
    "https://lesarjet.camp-coding.site/api/delivery-areas/list?page=1&per_page=100000";

  // 🟦 Fetch addresses (GET)
  const fetchDliveryAreas = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await GetMytoken();
      const res = await fetch(`${baseUrl}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "فشل تحميل ");
      }

      const data = await res.json();
      console.log("HomeData", data);

      // ✅ يدعم الشكل القديم والجديد:
      const list = data.data;

      setAreas(list);
    } catch (err) {
      console.error("Error fetching home delivery areas data:", err);
      setError(err.message);
      toast.error(err.message || "حدث خطأ أثناء  تحميل  مناطق التوصيل ");
    } finally {
      setLoading(false);
    }
  };

  return {
    areas,
    loading,
    error,
    fetchDliveryAreas,
    setAreas,
  };
}
