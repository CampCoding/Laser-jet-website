"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../store/profileSlice";
import Link from "next/link";
import {
  User,
  Phone,
  Smartphone,
  ShieldCheck,
  CalendarClock,
  Wallet,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";

const Account = () => {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.user?.accessToken;

  const dispatch = useDispatch();
  const {
    data: profileData,
    status: profileStatus,
    error,
  } = useSelector((state) => state.profile);

  const accountData = profileData?.data ?? null;



  // 🔄 حالة التحميل
  if (profileStatus === "loading" || !accountData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-full bg-slate-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-4/6 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ❌ حالة الخطأ
  if (profileStatus === "failed") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-sm text-red-600 mb-3">
            خطأ أثناء تحميل بيانات الحساب:
          </p>
          <p className="text-xs text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchProfile({ token: accessToken }))}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // 🧮 تجهيز بعض القيم للعرض
  const {
    username,
    phone,
    status,
    role,
    last_login,
    updated_at,
    balance,
    fine,
    fine_status,
    is_verified,
    isHaveCart,
    installable,
    user_id,
  } = accountData;

  const formattedBalance =
    typeof balance === "number"
      ? balance.toLocaleString("ar-EG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : balance;

  const formattedFine =
    typeof fine === "number"
      ? fine.toLocaleString("ar-EG", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : fine;

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      const d = new Date(value);
      return d.toLocaleString("ar-EG");
    } catch {
      return value;
    }
  };

  return (
    <div
      className="min-h-full rounded-lg bg-linear-to-b from-slate-50 via-slate-100 to-slate-200 px-4 py-8"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex flex-col gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            حسابي
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-xl">
            هنا يمكنك متابعة بيانات حسابك، حالة رصيدك، والغرامات إن وجدت، مع
            حالة تفعيل الحساب.
          </p>
        </header>

        {/* TOP GRID: PROFILE + SUMMARY */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* CARD: معلومات أساسية */}
          <div className="md:col-span-2 bg-white/90 backdrop-blur rounded-2xl shadow-md p-4 md:p-5 border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xl font-bold shadow-md">
                {username?.charAt(0) || "م"}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">
                    {username || "مستخدم"}
                  </h2>
                  {is_verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                      <ShieldCheck className="w-3 h-3" />
                      حساب موثق
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
                      <AlertTriangle className="w-3 h-3" />
                      غير موثق
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  رقم المستخدم: <span className="font-semibold">{user_id}</span>{" "}
                  · الصلاحية:{" "}
                  <span className="font-semibold">
                    {role === "user" ? "عميل" : role}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500">رقم الهاتف:</span>
                <span className="font-semibold text-slate-900">{phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500">حالة الحساب:</span>
                <span
                  className={`font-semibold ${
                    status === "active"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {status === "active" ? "نشط" : "متوقف"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500">آخر تسجيل دخول:</span>
                <span className="font-semibold text-slate-900">
                  {formatDate(accountData.last_login)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500">آخر تحديث للبيانات:</span>
                <span className="font-semibold text-slate-900">
                  {formatDate(accountData.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD: الملخص المالي */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                ملخص الحساب المالي
              </h3>
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">الرصيد الحالي:</span>
                <span
                  className={`font-bold ${
                    balance < 0 ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {formattedBalance}{" "}
                  <span className="text-xs text-gray-500">جنيه</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">الغرامة:</span>
                <span className="font-semibold text-slate-900">
                  {formattedFine}{" "}
                  <span className="text-xs text-gray-500">جنيه</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">حالة الغرامة:</span>
                <span
                  className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                    fine_status === "stopped"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {fine_status === "stopped" ? "موقوفة" : fine_status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">قابل للتقسيط:</span>
                <span className="font-semibold text-slate-900">
                  {installable === "1" ? "نعم" : "لا"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">لديك سلة فعالة:</span>
                <span className="font-semibold text-slate-900">
                  {isHaveCart ? "نعم" : "لا"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <Link
                href="/orders"
                className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                عرض طلباتي
              </Link>
            </div>
          </div>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-md p-4 md:p-5 border border-slate-100">
          <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3">
            تفاصيل إضافية
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500">اسم المستخدم في النظام:</span>
              </div>
              <p className="font-semibold text-slate-900 mr-6">
                {username || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500">رقم الهاتف المسجل:</span>
              </div>
              <p className="font-semibold text-slate-900 mr-6">
                {phone || "-"}
              </p>
            </div>

            {/* تقدر تضيف حقول عنوان / هوية / إلخ هنا لاحقاً */}
            {/* مثال: */}
            {/* <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500">العنوان:</span>
              </div>
              <p className="font-semibold text-slate-900 mr-6">
                {accountData.address || "لم يتم إدخال العنوان بعد"}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
