"use client";

import { Wallet, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

export default function WalletCard() {
  const { data, status, error } = useSelector((state) => state.transactions);
  const wallet = data?.data?.wallet;

  // 🟡 Loading
  if (status === "loading") {
    return (
      <div className="w-full px-2 sm:px-4" dir="rtl">
        <div className="mx-auto mt-4 max-w-5xl">
          <div className="animate-pulse rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 md:p-8 shadow-md">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <div className="h-5 w-24 rounded bg-slate-200 sm:h-6 sm:w-32" />
              <div className="h-8 w-8 rounded-full bg-slate-200 sm:h-10 sm:w-10" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="h-3 w-32 rounded bg-slate-200 sm:h-4 sm:w-40" />
                <div className="h-3 w-24 rounded bg-slate-200 sm:h-4 sm:w-32" />
                <div className="h-3 w-40 rounded bg-slate-200 sm:h-4 sm:w-48" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-32 rounded bg-slate-200 sm:h-6 sm:w-40" />
                <div className="h-3 w-36 rounded bg-slate-200 sm:h-4 sm:w-52" />
                <div className="h-3 w-28 rounded bg-slate-200 sm:h-4 sm:w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔴 Error
  if (status === "failed") {
    return (
      <div className="w-full px-2 sm:px-4" dir="rtl">
        <div className="mx-auto mt-4 max-w-5xl">
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-3 sm:p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5" />
            <div>
              <p className="mb-1 text-sm font-semibold sm:text-base">
                حدث خطأ أثناء تحميل المعاملات
              </p>
              <p className="text-xs text-red-600/80 sm:text-sm">
                {error || "برجاء المحاولة مرة أخرى لاحقاً."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ⛔ No data
  if (!data || !wallet) {
    return (
      <div className="w-full px-2 sm:px-4" dir="rtl">
        <div className="mx-auto mt-4 max-w-5xl">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center text-xs text-slate-700 sm:p-4 sm:text-sm">
            لا توجد بيانات معاملات حالياً.
          </div>
        </div>
      </div>
    );
  }

  const isFineActive = wallet.fine > 0;

  return (
    <div className="w-full px-2 sm:px-4" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md">
          {/* خلفيات للمكتب فقط */}
          <div className="pointer-events-none absolute -left-20 top-10 hidden h-40 w-40 rounded-full bg-blue-50 opacity-60 blur-3xl lg:block" />
          <div className="pointer-events-none absolute -right-24 -bottom-10 hidden h-52 w-52 rounded-full bg-cyan-50 opacity-60 blur-3xl lg:block" />

          <div className="relative p-4 pt-5 sm:p-6 sm:pt-7 md:p-8 md:pt-10">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between sm:mb-6 md:mb-8">
              <div className="max-w-[70%]">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl">
                  محفظتك
                </h2>
                <p className="mt-1 text-[11px] text-slate-500 sm:text-xs md:text-sm">
                  استعرض رصيدك الحالي وحالة الغرامات بشكل سريع وواضح
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden flex-col items-end text-[10px] text-slate-500 sm:flex sm:text-xs">
                  <span>حالة الحساب</span>
                  <span className="mt-1 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 sm:px-2.5 sm:text-[11px]">
                    نشط
                  </span>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50 shadow-sm sm:h-11 sm:w-11 md:h-12 md:w-12">
                  <Wallet className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </div>

            {/* Content grid */}
            <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-[1.1fr,1fr]">
              {/* Left: user info */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4 md:p-5">
                  <h3 className="mb-2 text-xs font-semibold text-slate-800 sm:mb-3 sm:text-sm">
                    بيانات صاحب المحفظة
                  </h3>
                  <div className="space-y-2.5 text-[11px] sm:space-y-3 sm:text-sm">
                    <Row label="اسم المستخدم" value={wallet.username} />
                    <Row
                      label="رقم الهاتف"
                      value={wallet.phone}
                      valueClassName="ltr"
                    />
                    <Row
                      label="رقم المحفظة"
                      value={wallet?.id || "غير متوفر"}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2 text-[10px] text-slate-500 sm:text-[11px] md:text-xs">
                  يمكن استخدام هذا الرصيد في عمليات الدفع والتحويل داخل النظام
                  وفقاً للصلاحيات المتاحة لك.
                </div>
              </div>

              {/* Right: balance + fines */}
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Balance */}
                <div className="rounded-2xl bg-gradient-to-l from-blue-600 via-indigo-600 to-cyan-500 p-3 sm:p-4 md:p-5 text-white shadow-md">
                  <div className="mb-2 flex items-center justify-between sm:mb-3">
                    <span className="text-[11px] text-blue-100 sm:text-xs md:text-sm">
                      الرصيد الحالي
                    </span>
                    <span className="text-[9px] text-blue-100/80 sm:text-[10px] md:text-xs">
                      آخر تحديث: الآن تقريباً
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="mb-0.5 text-[10px] text-blue-100/90 sm:mb-1 sm:text-[11px] md:text-xs">
                        الرصيد المتاح للاستخدام
                      </p>
                      <p className="text-2xl font-extrabold tracking-tight sm:text-[26px] md:text-3xl">
                        {wallet?.balance?.toFixed(2)}{" "}
                        <span className="text-xs font-semibold text-blue-100 sm:text-sm">
                          جنيه
                        </span>
                      </p>
                    </div>
                    <div className="text-right text-[9px] text-blue-100/90 sm:text-[10px] md:text-xs">
                      <p>إجمالي الرصيد</p>
                      <p className="mt-1 text-blue-50">
                        بدون احتساب الغرامات المعلّقة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fines */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4 md:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          isFineActive
                            ? "border border-red-100 bg-red-50 text-red-500"
                            : "border border-emerald-100 bg-emerald-50 text-emerald-500"
                        }`}
                      >
                        <AlertCircle className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        الغرامات
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-2.5 sm:text-[11px] ${
                        isFineActive
                          ? "border border-red-100 bg-red-50 text-red-700"
                          : "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {wallet.fine_status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500">إجمالي الغرامات</span>
                    <span
                      className={
                        isFineActive
                          ? "font-semibold text-red-600"
                          : "font-medium text-slate-400"
                      }
                    >
                      {wallet.fine.toFixed(2)}{" "}
                      <span className="text-[11px] font-normal">جنيه</span>
                    </span>
                  </div>

                  {isFineActive ? (
                    <p className="mt-2 text-[10px] leading-relaxed text-red-500/85 sm:text-[11px] md:text-xs">
                      يُفضّل تسوية الغرامات في أقرب وقت لتجنب أي قيود على استخدام
                      المحفظة أو إجراء عمليات مالية جديدة.
                    </p>
                  ) : (
                    <p className="mt-2 text-[10px] text-emerald-600/85 sm:text-[11px] md:text-xs">
                      لا توجد غرامات مستحقة حالياً. يمكنك استخدام محفظتك بحرية
                      تامة.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] text-slate-400 sm:text-[11px] md:text-xs">
                أي عملية جديدة سيتم تسجيلها في سجل معاملاتك فوراً.
              </p>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto sm:text-sm">
                  إيداع رصيد
                </button>
                <button className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto sm:text-sm">
                  عرض سجل المعاملات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** صف لعرض (label / value) بشكل متجاوب */
function Row({ label, value, valueClassName = "" }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[11px] text-slate-500 sm:text-xs">{label}</span>
      <span
        className={`text-right text-[11px] font-medium text-slate-900 sm:text-xs ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}
