"use client";

import Link from "next/link";
import {
  Bell,
  Heart,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  User,
  Wallet,
  CreditCard,
  Landmark,
  MapPin,
  Receipt,
  Send,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { Spinner } from "../../../components/ui/spinner";

export default function AccountSidebar({ onNavigate }) {
  const {
    data: profileData,
    status,
    error,
  } = useSelector((state) => state.profile);

  const accountData = profileData?.data ?? null;
  console.log("profileData"  , profileData)

  if (status === "failed") {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-white p-4 shadow-md">
        <p className="text-sm text-red-600">خطأ: {error}</p>
      </div>
    );
  }

  return (
    <aside
      dir="rtl"
      className="w-full lg:w-72 max-w-full lg:max-w-xs rounded-2xl border border-blue-600 bg-white p-4 shadow-2xl md:sticky md:top-24"
    >
      {status === "loading" ? (
        <div className="flex items-center justify-center py-8 sm:py-10">
          <Spinner className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : !accountData ? (
        <p className="text-sm text-red-600">تعذر تحميل بيانات الحساب</p>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <User className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-blue-600">
                {accountData?.username}
              </span>
              <span className="text-xs text-slate-500">
                {accountData?.phone}
              </span>
            </div>
          </div>

          {/* Wallet */}
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs text-slate-500">رصيد المحفظة</p>
                <p className="text-sm font-semibold text-blue-600">
                  {typeof accountData?.balance === "number"
                    ? accountData.balance.toFixed(2)
                    : "0.00"}{" "}
                  <span className="text-xs text-slate-500">جنيه</span>
                </p>
              </div>
              <Wallet className="h-6 w-6 text-slate-500" />
            </div>
          </div>

          {/* Extra Info */}
          <div className=" grid grid-cols-1 sm:grid-cols-1">
            <SidebarInfo label="المبلغ المتوفر" value="0.00 جنيه" />
            <SidebarInfo
              label="الحد الأقصى للسداد الشهري"
              value="0.00 جنيه"
            />
          </div>
          <hr className="shadow-2xl" />

          {/* Main nav */}
          <nav className="mt-4 space-y-1 text-sm">
            <SidebarLink
              href="/account/wallet"
              label="المحفظة"
              icon={Wallet}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/deposit"
              label="الإيداع"
              icon={Landmark}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/send-money"
              label="إرسال الأموال"
              icon={Send}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/Transactions"
              label="المعاملات"
              icon={Receipt}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/mini-money"
              label="خدمة ميني ماني"
              icon={CreditCard}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/Installments"
              label="الأقساط"
              icon={CreditCard}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/fines"
              label="الغرامات"
              icon={CreditCard}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/addresses"
              label="العناوين"
              icon={MapPin}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/notifications"
              label="الإشعارات"
              icon={Bell}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/wishlist"
              label="قائمة المفضلة"
              icon={Heart}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/change-password"
              label="تغيير كلمة المرور"
              icon={Lock}
              onClick={onNavigate}
            />
            <SidebarLink
              href="/account/complaints"
              label="الشكاوى"
              icon={MessageCircle}
              onClick={onNavigate}
            />
          </nav>

          {/* Contact */}
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              تواصل معنا
            </p>
            <div className="space-y-1 text-sm">
              <SidebarLink
                href="https://wa.me/+201004331113"
                label="WhatsApp"
                icon={MessageCircle}
                onClick={onNavigate}
              />
              <SidebarLink
                href="tel:+201004331113"
                label="Phone"
                icon={Phone}
                onClick={onNavigate}
              />
              <SidebarLink
                href="mailto:Info@laserjet.com.eg"
                label="Mail"
                icon={Mail}
                onClick={onNavigate}
              />
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-red-50 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            onClick={() => {
              if (onNavigate) onNavigate();
              signOut({ callbackUrl: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>

          {/* Footer links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] text-slate-400">
            <Link
              href="/privacy-and-terms"
              className="text-blue-400 transition-all hover:text-blue-800"
              onClick={onNavigate}
            >
              سياسة الخصوصية
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/terms-and-conditions"
              className="text-blue-400 transition-all hover:text-blue-800"
              onClick={onNavigate}
            >
              شروط وأحكام الاستخدام
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/refund-policy"
              className="text-blue-400 transition-all hover:text-blue-800"
              onClick={onNavigate}
            >
              سياسة الإسترجاع
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}

function SidebarLink({ href, label, icon: Icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-50"
    >
      <div className="flex flex-row-reverse items-center gap-3">
        <span className="text-sm">{label}</span>
      </div>
      <Icon className="h-4 w-4 text-slate-400" />
    </Link>
  );
}

function SidebarInfo({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}
