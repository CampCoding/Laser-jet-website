"use client";

import { WifiOff, RefreshCcw, RotateCw } from "lucide-react";

export default function OfflineOverlay({ onRetry }) {
  return (
    <div className="fixed inset-0 z-999999999 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center px-4">
      {/* subtle background blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
        {/* header strip */}
        <div className="bg-linear-to-l from-blue-600 to-blue-500 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <WifiOff className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-extrabold">أنت غير متصل بالإنترنت</h2>
              <p className="text-xs text-white/90 mt-1">
                لا يمكن إكمال بعض العمليات بدون اتصال.
              </p>
            </div>
          </div>
        </div>

        {/* content */}
        <div className="px-6 py-6 text-center">
          <p className="text-sm text-slate-600 leading-relaxed">
            تأكد من تشغيل البيانات أو الـ Wi-Fi ثم اضغط{" "}
            <span className="font-bold text-slate-900">إعادة المحاولة</span>.
          </p>

          <div className="mt-5 grid gap-2">
         

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <RotateCw className="h-4 w-4 transition-transform group-hover:rotate-90" />
              تحديث الصفحة
            </button>
          </div>

          {/* tips */}
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-right">
            <p className="text-xs font-bold text-slate-900 mb-2">نصائح سريعة:</p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc pr-5">
              <li>افتح وضع الطيران ثم ألغِه.</li>
              <li>بدّل بين Wi-Fi والبيانات.</li>
              <li>تأكد من وجود تغطية شبكة.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
