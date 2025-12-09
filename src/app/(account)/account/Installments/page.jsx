"use client";

import React from "react";
import { useSelector } from "react-redux";

export default function InstallmentsTable() {
  const { data, status, error } = useSelector((state) => state.transactions);

  const rawInstallments = data?.data?.installments;

  // ✅ تنظيف ودمج الداتا بحيث تناسب السامبل الكبير اللي بعتّه
  const normalizeInstallments = (installments) => {
    if (!Array.isArray(installments)) return [];

    const map = {};

    installments.forEach((inst) => {
      if (!inst) return;

      const key = `${inst.order_number}-${inst.product_id}-${inst.installment_id}`;

      // ننضف تفاصيل الأقساط من الصفوف الفاضية
      const validDetails = Array.isArray(inst.details)
        ? inst.details.filter((p) => {
            if (!p) return false;
            const hasValue =
              p.part_value !== null &&
              p.part_value !== undefined &&
              p.part_value !== "null";
            const hasStatus =
              p.part_status !== null &&
              p.part_status !== undefined &&
              p.part_status !== "null";
            const hasDate =
              p.part_due_date !== null &&
              p.part_due_date !== undefined &&
              p.part_due_date !== "null";
            const hasTitle =
              p.part_title !== null &&
              p.part_title !== undefined &&
              p.part_title !== "null";

            return hasValue || hasStatus || hasDate || hasTitle;
          })
        : [];

      if (!map[key]) {
        map[key] = {
          ...inst,
          details: validDetails,
        };
      } else {
        // لو نفس key اتكرر، ندمج الديتيلز ونكمّل أي value ناقصة
        const existingDetails = Array.isArray(map[key].details)
          ? map[key].details
          : [];

        const merged = [...existingDetails];

        validDetails.forEach((p) => {
          if (!p) return;
          const exists = merged.some(
            (ex) =>
              ex &&
              ex.part_id !== null &&
              ex.part_id !== undefined &&
              ex.part_id === p.part_id
          );
          if (!exists) merged.push(p);
        });

        map[key].details = merged;

        if (
          (map[key].value === null ||
            map[key].value === undefined ||
            map[key].value === "null") &&
          inst.value !== null &&
          inst.value !== undefined &&
          inst.value !== "null"
        ) {
          map[key].value = inst.value;
        }
      }
    });

    // نحذف أي قسط مافهوش value حقيقي ولا تفاصيل حقيقية
    return Object.values(map).filter((inst) => {
      const hasValue =
        inst.value !== null &&
        inst.value !== undefined &&
        inst.value !== "null";
      const hasDetails =
        Array.isArray(inst.details) && inst.details.length > 0;
      return hasValue || hasDetails;
    });
  };

  const installments = normalizeInstallments(rawInstallments);
  const firstUser = installments[0]?.user;

  // ✅ Helpers
  const getStatusLabel = (status) => {
    if (status === "paid") return "مدفوع";
    if (status === "pending") return "قيد السداد";
    if (status === "late") return "متأخر";
    return "غير معروف";
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "late":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    if (!isFinite(num)) return "-";
    const rounded = Math.round(num); // تقريب لأقرب جنيه
    return rounded.toLocaleString("ar-EG") + " ج.م";
  };

  const formatDueDate = (raw) => {
    if (!raw) return "-";
    // الداتا جاية بالشكل: "2025-12-01 06:51:25"
    const [datePart] = String(raw).split(" ");
    return datePart || raw;
  };

  const getInstallmentSummary = (inst) => {
    const details = inst?.details || [];
    const total = details.reduce(
      (sum, part) => sum + Number(part.part_value || 0),
      0
    );
    const paid = details
      .filter((p) => p.part_status === "paid")
      .reduce((sum, part) => sum + Number(part.part_value || 0), 0);

    const remaining = total - paid;
    const progress = total > 0 ? Math.round((paid / total) * 100) : 0;

    return { total, paid, remaining, progress };
  };

  // ✅ Loading / error / empty states
  if (status === "loading") {
    return (
      <div className="p-6" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 w-40 bg-gray-100 rounded mb-4 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white animate-pulse"
              >
                <div className="h-4 w-64 bg-gray-100 rounded mb-3" />
                <div className="h-3 w-full bg-gray-100 rounded mb-2" />
                <div className="h-3 w-4/5 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-6" dir="rtl">
        <div className="max-w-3xl mx-auto rounded-2xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">
          <strong className="font-semibold">حدث خطأ في تحميل الأقساط:</strong>{" "}
          <span>{String(error || "خطأ غير معروف")}</span>
        </div>
      </div>
    );
  }

  if (!data || !installments || installments.length === 0) {
    return (
      <div className="p-6" dir="rtl">
        <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center text-gray-600 shadow-sm">
          لا يوجد أقساط مسجلة حالياً.
        </div>
      </div>
    );
  }

  return (
    <section className="p-6" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* الهيدر */}
        <header className="flex flex-col gap-4 mb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">جدول الأقساط</h2>
              <p className="text-sm text-gray-500 mt-1">
                متابعة كاملة لحالة كل قسط: المدفوع، المتبقي، وتواريخ الاستحقاق.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                مدفوع
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                مستحق / قيد السداد
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                متأخر
              </span>
            </div>
          </div>

          {/* كارت بيانات العميل */}
          {firstUser && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">العميل:</span>
                <span>{firstUser.name || "بدون اسم"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">الجوال:</span>
                <span>{firstUser.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">الرقم القومي:</span>
                <span>{firstUser.national_id || "-"}</span>
              </div>
            </div>
          )}
        </header>

        {/* قائمة الأقساط */}
        <div className="space-y-5">
          {installments.map((inst) => {
            const { total, paid, remaining, progress } =
              getInstallmentSummary(inst);

            return (
              <article
                key={`${inst.order_number}-${inst.product_id}-${inst.installment_id}`}
                className="border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* رأس الكارت */}
                <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      {inst.product || "منتج بدون اسم"}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                      رقم الطلب:{" "}
                      <span className="font-semibold text-gray-800">
                        {inst.order_number}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      كود خطة التقسيط:{" "}
                      <span className="font-mono">
                        {inst.installment_id || "-"}
                      </span>
                    </p>
                  </div>

                  {/* ملخص مبالغ */}
                  <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                    <div className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
                      إجمالي الأقساط:{" "}
                      <span className="font-semibold">
                        {total > 0 ? formatCurrency(total) : "-"}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800">
                      المدفوع:{" "}
                      <span className="font-semibold">
                        {paid > 0 ? formatCurrency(paid) : "0 ج.م"}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-800">
                      المتبقي:{" "}
                      <span className="font-semibold">
                        {remaining > 0 ? formatCurrency(remaining) : "0 ج.م"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* شريط التقدم */}
                <div className="px-4 md:px-6 pt-3 pb-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                    <span>نسبة السداد</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* جدول الأقساط التفصيلي */}
                <div className="px-2 md:px-4 pb-4 pt-2">
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="min-w-full text-xs md:text-sm text-right">
                      <thead className="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                          <th className="p-3 whitespace-nowrap">القسط</th>
                          <th className="p-3 whitespace-nowrap">القيمة</th>
                          <th className="p-3 whitespace-nowrap">الحالة</th>
                          <th className="p-3 whitespace-nowrap">
                            تاريخ الاستحقاق
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inst.details && inst.details.length > 0 ? (
                          inst.details.map((part) => (
                            <tr
                              key={part.part_id || `${inst.installment_id}-${part.part_due_date}-${part.part_value}`}
                              className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors"
                            >
                              <td className="p-3 whitespace-nowrap text-gray-800">
                                {part.part_title || "قسط"}
                              </td>
                              <td className="p-3 whitespace-nowrap font-semibold text-gray-900">
                                {part.part_value
                                  ? formatCurrency(part.part_value)
                                  : "-"}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span
                                  className={
                                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] md:text-xs " +
                                    getStatusBadgeClasses(part.part_status)
                                  }
                                >
                                  <span
                                    className={
                                      "inline-block h-1.5 w-1.5 rounded-full " +
                                      (part.part_status === "paid"
                                        ? "bg-emerald-500"
                                        : part.part_status === "late"
                                        ? "bg-red-500"
                                        : "bg-amber-400")
                                    }
                                  />
                                  {getStatusLabel(part.part_status)}
                                </span>
                              </td>
                              <td className="p-3 whitespace-nowrap text-gray-700">
                                {formatDueDate(part.part_due_date)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="p-4 text-center text-gray-500 text-xs"
                            >
                              لا توجد تفاصيل أقساط متاحة لهذه الخطة.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
