import { useState, useCallback } from "react";
import { toast } from "sonner";
import GetMytoken from "../src/lib/GetuserToken";

export default function useGetHomeData() {
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "https://lesarjet.camp-coding.site/api/pages/home/list";

  // 🟦 Fetch addresses (GET)
  const fetchHomeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await GetMytoken();
      console.log("tokenFromHome", token);
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

      setHomeData(list);
    } catch (err) {
      console.error("Error fetching home paged data:", err);
      setError(err.message);
      toast.error(err.message || "حدث خطأ أثناء  تحميل الصفحة الرئيسية ");
    } finally {
      setLoading(false);
    }
  };

  return {
    homeData,
    loading,
    error,
    fetchHomeData,
    setHomeData,
  };
}
