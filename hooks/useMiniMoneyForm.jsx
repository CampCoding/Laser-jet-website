"use client";

import { useState, useCallback, useEffect } from "react";
import GetMytoken from "../src/lib/GetuserToken";

export   function  useMiniMoneySubmit(options) {
  const {
    endpoint = "https://lesarjet.camp-coding.site/api/credit-forms/create",
    type = "compliment",
    details = [],
    authToken, // 👈 توكن الـ Bearer
    // userId,  // لو الـ API محتاج user_id ممكن ترجعه تاني
  } = options || {};
const [toekn, setToken] = useState(authToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submitForm = useCallback(
    async (values) => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const formData = new FormData();

        // 🔹 نفس الحقول الموجودة في Postman
        formData.append("full_name", values.full_name);
        formData.append("national_id", values.national_id);
        formData.append("email", values.email);
        formData.append("address_in_card", values.address_in_card);
        formData.append("current_address", values.current_address);
        formData.append("job", values.job);
        formData.append("salary", String(values.salary));

        // 🔹 mapping لحالة التأمين حسب الـ API (exists / not-exists)
        const insuranceMapped =
          values.insurance_status === "insured" ? "exists" : "not-exists";
        formData.append("insurance_status", insuranceMapped);

        formData.append("birthday", values.birthday);
        formData.append("type", type);

        // لو الـ API محتاج user_id صرّح هنا:
        // if (userId !== undefined && userId !== null) {
        //   formData.append("user_id", String(userId));
        // }

        // 🔹 details[0][label] / value ... مثل Postman
        details.forEach((detail, index) => {
          formData.append(`details[${index}][label]`, detail.label);
          formData.append(`details[${index}][value]`, detail.value);
        });

        // 🔹 الملفات – نفس اسم الفيلد بالظبط "docs" و "images"
        if (values.docs && values.docs.length) {
          Array.from(values.docs).forEach((file) => {
            formData.append("docs", file); // 👈 بدون []
          });
        }

        if (values.images && values.images.length) {
          Array.from(values.images).forEach((file) => {
            formData.append("images", file); // 👈 بدون []
          });
        }

        const token = await GetMytoken();
        console.log("token" , token)

        // 🔹 إعداد الهيدرز
        const headers = new Headers();
        if (authToken) {
          headers.append("Authorization", `Bearer ${token}`);
        }

        const res = await fetch(endpoint, {
          method: "POST",
          headers:{
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          redirect: "follow",
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "حدث خطأ أثناء إرسال البيانات");
        }

        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          data = { message: "تم إرسال البيانات بنجاح" };
        }

        setSuccess(data);
        return data;
      } catch (err) {
        console.error("MiniMoney submit error:", err);
        setError(err.message || "حدث خطأ غير متوقع");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, type, details, authToken]
  );

  return { submitForm, isLoading, error, success };
}
