"use client";

import { useSession } from "next-auth/react";
import useNotifications from "../../../../../hooks/useGetNotifications";
import { Bell, RefreshCw, AlertCircle, Inbox } from "lucide-react";

export default function NotificationsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { notifications, loading, error, refetch } = useNotifications(token);

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Bell className="h-5 w-5 text-slate-500" />
          </div>
          <h2 className="mb-1 text-sm font-semibold text-slate-800">
            يرجى تسجيل الدخول
          </h2>
          <p className="text-xs text-slate-500">
            قم بتسجيل الدخول حتى تتمكن من عرض آخر الإشعارات الخاصة بحسابك.
          </p>
        </div>
      </div>
    );
  }

  // 🔄 حالة التحميل: سكيليتون بسيط
  if (loading) {
    return (
      <div className="">
        <div className="">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100">
                <Bell className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-800">
                  الإشعارات
                </h1>
                <p className="text-[11px] text-slate-400">
                  جاري تحميل الإشعارات الخاصة بك...
                </p>
              </div>
            </div>
            <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-slate-100 bg-slate-50/80 p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="h-3 w-40 rounded-full bg-slate-200" />
                  <div className="h-2 w-24 rounded-full bg-slate-200" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-full rounded-full bg-slate-200" />
                  <div className="h-2 w-3/4 rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ❌ حالة الخطأ
  if (error) {
    return (
      <div className="">
        <div className="">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <h2 className="text-sm font-semibold text-red-700">حدث خطأ</h2>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-red-700/90">
            تعذر تحميل الإشعارات في الوقت الحالي.
          </p>
          <p className="mb-4 rounded-md bg-white/70 p-2 text-[11px] leading-relaxed text-red-500">
            التفاصيل: {error}
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
          >
            <RefreshCw className="h-3 w-3" />
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const count = notifications?.length || 0;
  const hasNotifications = count > 0;

  return (
    <div className="min-h-[60vh] bg-slate-50/60 ">
      <div className="mx-auto   bg-white/90 ">
        {/* 🧾 الهيدر */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Bell className="h-4 w-4" />
              {hasNotifications && (
                <span className="absolute -top-1 -left-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-[5px] text-[9px] font-semibold text-white">
                  {count}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                الإشعارات
              </h1>
              <p className="text-[11px] text-slate-400">
                {hasNotifications
                  ? "اطلع على أحدث التحديثات والرسائل الخاصة بحسابك."
                  : "لا توجد إشعارات جديدة حاليًا."}
              </p>
            </div>
          </div>

          <button
            onClick={refetch}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 active:scale-[0.98] transition"
          >
            <RefreshCw className="h-3 w-3" />
            تحديث
          </button>
        </div>

        {/* 📨 قائمة الإشعارات أو حالة عدم وجود إشعارات */}
        {hasNotifications ? (
          <div className="space-y-3">
            {notifications.map((n) => {
              const isRead =
                n.is_read === 1 ||
                n.is_read === true ||
                n.read === 1 ||
                n.read === true;

              return (
                <div
                  key={n.id}
                  className={`group rounded-xl border p-3 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition hover:-translate-y-[1px] hover:shadow-md ${
                    isRead
                      ? "border-slate-100 bg-slate-50/60"
                      : "border-emerald-100 bg-emerald-50/70"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                          isRead
                            ? "bg-slate-200 text-slate-700"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        <Bell className="h-3 w-3" />
                      </span>
                      <h3 className="text-[13px] font-semibold text-slate-900 line-clamp-1">
                        {n.title}
                      </h3>
                    </div>
                    <span className="whitespace-nowrap text-[10px] text-slate-400">
                      {n.created_at
                        ? new Date(n.created_at).toLocaleString("ar-EG", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : null}
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-[11px] leading-relaxed text-slate-700">
                    {n.body}
                  </p>

                  {!isRead && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700/90">
                      <span className="h-[6px] w-[6px] rounded-full bg-emerald-500" />
                      <span>جديد</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Inbox className="h-5 w-5 text-slate-500" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-800">
              لا توجد إشعارات حالية
            </h3>
            <p className="mb-3 max-w-xs text-[11px] text-slate-500">
              عندما تصلك إشعارات جديدة حول طلباتك أو حسابك، ستظهر هنا بشكل
              تلقائي.
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className="h-3 w-3" />
              تحديث الآن
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
