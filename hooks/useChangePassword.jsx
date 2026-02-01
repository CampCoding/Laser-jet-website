"use client";

import { useState, useCallback } from "react";

export default function useChangePassword(accessToken, phone) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changePassword = useCallback(
    async ({ old_password, new_password, confirm_password }) => {
      if (!accessToken) {
        throw new Error("برجاء تسجيل الدخول أولاً");
      }

      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("old_password", old_password);
        formData.append("password", new_password);
        formData.append("confirm_password", confirm_password);
        formData.append("phone", phone || "");

        const res = await fetch(
          "https://lesarjet.camp-coding.site/api/user/update",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            data?.message || "حدث خطأ أثناء تغيير كلمة المرور، حاول مرة أخرى";
          throw new Error(msg);
        }

        return data;
      } catch (err) {
        setError(err.message || "حدث خطأ غير متوقع");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, phone]
  );

  return { changePassword, loading, error };
}
