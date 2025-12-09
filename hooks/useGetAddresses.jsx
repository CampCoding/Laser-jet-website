import { useState, useCallback } from "react";
import { toast } from "sonner";

export default function useAddresses(accessToken) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = "https://lesarjet.camp-coding.site/api/address";

  const getAuthHeaders = useCallback(() => {
    if (!accessToken) return {};
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }, [accessToken]);

  // 🟦 Fetch addresses (GET)
  // 🟦 Fetch addresses (GET)
  const fetchAddresses = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${baseUrl}/list`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "فشل تحميل العناوين");
      }

      const data = await res.json();

      // ✅ يدعم الشكل القديم والجديد:
      // { data: { addresses: [...] } } أو { addresses: [...] }
      const list = data?.data?.addresses || data?.addresses || [];

      setAddresses(list);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError(err.message);
      toast.error(err.message || "حدث خطأ أثناء تحميل العناوين");
    } finally {
      setLoading(false);
    }
  }, [accessToken, baseUrl, getAuthHeaders]);

  // 🟥 Delete address (DELETE) 
  const deleteAddress = useCallback(
    async (id) => {
      if (!accessToken || !id) return;

      try {
        const res = await fetch(`${baseUrl}/delete/${id}`, {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "فشل حذف العنوان");
        }

        await fetchAddresses();
        toast.success("تم حذف العنوان بنجاح");
      } catch (err) {
        console.error("Error deleting address:", err);
        toast.error(err.message || "حدث خطأ أثناء الحذف");
      }finally {
        setLoading(false);
      }
    },
    [accessToken, baseUrl, getAuthHeaders, fetchAddresses]
  );

  // 🟨 Update address (PUT)
  const updateAddress = useCallback(
    async (address) => {
      if (!accessToken || !address?.id) return;

      try {
        const res = await fetch(`${baseUrl}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            id: address.id,
            alias: address.alias,
            details: address.details,
            region_id: address.region_id,
            latitude: address.latitude,
            longitude: address.longitude,
            is_primary: !!address.is_primary,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "فشل تحديث العنوان");
        }

        toast.success("تم تحديث العنوان بنجاح");
        await fetchAddresses();
      } catch (err) {
        console.error("UPDATE ERROR:", err);
        toast.error(err.message || "حدث خطأ أثناء تحديث العنوان");
      }
    },
    [accessToken, baseUrl, getAuthHeaders, fetchAddresses]
  );

  // 🟩 Add address (POST)
  const addAddress = useCallback(
    async ({ alias, details, longitude, latitude, region_id }) => {
      if (!accessToken) return;

      try {
        const res = await fetch(`${baseUrl}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            alias,
            details,
            longitude,
            latitude,
            region_id,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "فشل إضافة العنوان");
        }

        const data = await res.json();
        toast.success(data?.message || "تم إضافة العنوان بنجاح");
        await fetchAddresses();
      } catch (err) {
        console.error("Error adding address:", err);
        toast.error(err.message || "حدث خطأ أثناء إضافة العنوان");
      }finally {
        setLoading(false);
      }
    },
    [accessToken, baseUrl, getAuthHeaders, fetchAddresses]
  );

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    deleteAddress,
    updateAddress,
    addAddress,
    setAddresses, // لو حبيت تعدّلها يدويًا من الكومبوننت
  };
}
