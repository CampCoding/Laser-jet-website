"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AccountSidebar from "../_commponent/account/accountSideBar";
import Container from "../_commponent/utils/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionsThunk,
  resetTransactions,
} from "../../store/transactionsSlice";
import { useSession } from "next-auth/react";
import { fetchProfile } from "../../store/profileSlice";

const AccountLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { data: session, status: sessionStatus } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const accessToken = session?.user?.accessToken;

  const {
    data: profileData,
    status: profileStatus,
    error,
  } = useSelector((state) => state.profile);

  const accountData = profileData?.data ?? null;

  // جلب المعاملات
  useEffect(() => {
    dispatch(getTransactionsThunk({}));

    return () => {
      dispatch(resetTransactions());
    };
  }, [dispatch]);

  // جلب البروفايل بعد توفر التوكن
  useEffect(() => {
    if (!accessToken) return;

    if (profileStatus === "loading" || profileStatus === undefined) {
      dispatch(fetchProfile({ token: accessToken }));
    }
  }, [dispatch, accessToken, profileStatus]);

  if (profileStatus === "loading" || !profileData) {
    return <p className="text-center text-xl mt-10">...جاري التحميل</p>;
  }

  // لو مش عامل تسجيل دخول
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <svg
          className="w-20 h-20 text-blue-700 drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M19 3H5c-1.11 0-2 .89-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-8.92 12.58L11.5 17l5-5l-5-5l-1.42 1.41L12.67 11H3v2h9.67z"
            strokeWidth={0.5}
            stroke="currentColor"
          ></path>
        </svg>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          الرجاء تسجيل الدخول أولًا
        </h1>
        <p className="text-gray-600 mb-6">
          للوصول إلى حسابك، يجب أن تقوم بتسجيل الدخول.
        </p>
        <Link
          href={{
            pathname: "/login",
            query: { redirect: "/account" },
          }}
          className="rounded-full bg-blue-600 px-6 py-3 text-white!  transition-all! hover:shadow-2xl! hover:scale-110 font-semibold hover:bg-blue-700! "
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <Container className="mx-auto flex flex-col lg:flex-row items-start gap-4 lg:gap-6 px-3 sm:px-4 py-6 sm:py-8">
        {/* Sidebar desktop فقط */}
        <div className="hidden w-full lg:block lg:w-72 flex-shrink-0">
          <AccountSidebar />
        </div>

        {/* Content area */}
        <section className="w-full flex-1 rounded-2xl border border-blue-600 bg-white p-3 sm:p-4 lg:p-6 shadow-2xl">
          {/* هيدر صغير في الموبايل + زر فتح الدروار */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <div className="flex flex-col">
              <h1 className="text-base font-semibold text-slate-800">
                لوحة الحساب
              </h1>
              <p className="text-xs text-gray-500">
                إدارة المحفظة، الأقساط، العناوين والمزيد.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer rounded-full border whitespace-nowrap border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
            >
              قائمة الحساب
            </button>
          </div>

          {children}
        </section>
      </Container>

      {/* 📱 Drawer للـ Sidebar في الموبايل فقط */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute inset-y-0 right-0 flex h-full w-72 max-w-[85%] flex-col bg-white shadow-2xl transition-transform duration-300 translate-x-0">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                حسابي
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-full px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                إغلاق
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {/* نمرر onNavigate عشان اللينكات جوه الـ Sidebar تقفل الدروار */}
              <AccountSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountLayout;
