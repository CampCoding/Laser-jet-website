import { useState, useCallback } from "react";
import { toast } from "sonner";
import GetMytoken from "../src/lib/GetuserToken";

export default function useProductData(id) {
  const [prodData, setProdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = `https://lesarjet.camp-coding.site/api/product/list?product_id=${id}`;

  // 🟦 Fetch addresses (GET)
  const fetchProdData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await GetMytoken();
      const res = await fetch(`${url}`, {
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

      setProdData(list);
    } catch (err) {
      console.error("Error fetching product  data:", err);
      setError(err.message);
      toast.error(err.message || "حدث خطأ أثناء  تحميل  بيانات المنتج ");
    } finally {
      setLoading(false);
    }
  };

  return {
    prodData,
    loading,
    error,
    fetchProdData,
    setProdData,
  };
}
