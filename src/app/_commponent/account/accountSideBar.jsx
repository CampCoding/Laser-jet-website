// components/account/AccountSidebar.tsx
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
import { useSession } from "next-auth/react";

export default function AccountSidebar() {
const session = useSession();
console.log(session);

  return (
    <aside
      dir="rtl"
      className="w-full max-w-xs rounded-2xl border border-blue-600 bg-white p-4 shadow-2xl md:sticky md:top-24"
    >
      {/* Header: الاسم + الرقم */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <User className="h-6 w-6 text-slate-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-blue-600">
            محمد السيد
          </span>
          <span className="text-xs text-slate-500">01289790034</span>
        </div>
      </div>

      {/* رصيد المحفظة */}
      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-slate-500">رصيد المحفظة</p>
            <p className="text-sm font-semibold text-blue-600">
              0.00 <span className="text-xs text-slate-500">جنيه</span>
            </p>
          </div>
          <Wallet className="h-6 w-6 text-slate-500" />
        </div>
      </div>

      {/* القائمة الرئيسية */}
      <nav className="mt-4 space-y-1 text-sm">
        <SidebarLink href="/wallet" label="المحفظة" icon={Wallet} />
        <SidebarLink href="/wallet/ibda" label="الإبداع" icon={Landmark} />
        <SidebarLink href="/wallet/send" label="إرسال الأموال" icon={Send} />
        <SidebarLink href="/wallet/transactions" label="المعاملات" icon={Receipt} />
        <SidebarLink href="/wallet/mini" label="محفظة ميني" icon={Wallet} />
        <SidebarLink href="/wallet/service-mini" label="خدمة ميني مالي" icon={CreditCard} />
        <SidebarLink href="/wallet/installments" label="الأقساط" icon={CreditCard} />

        {/* المبالغ – ممكن تخليهم مجرد معلومات بدون روابط */}
        <SidebarInfo
          label="المبلغ المتوفر"
          value="0.00 جنيه"
        />
        <SidebarInfo
          label="الحد الأقصى للسداد الشهري"
          value="0.00 جنيه"
        />

        <SidebarLink href="/account" label="الحساب" icon={User} />
        <SidebarLink href="/account/addresses" label="العناوين" icon={MapPin} />
        <SidebarLink href="/account/notifications" label="الإشعارات" icon={Bell} />
        <SidebarLink href="/account/favorites" label="قائمة المفضلة" icon={Heart} />
        <SidebarLink href="/account/change-password" label="تغيير كلمة المرور" icon={Lock} />
        <SidebarLink href="/account/complaints" label="الشكاوى" icon={MessageCircle} />
      </nav>

      {/* تواصل معنا */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-2 text-xs font-semibold text-slate-500">تواصل معنا</p>
        <div className="space-y-1 text-sm">
          <SidebarLink href="/contact/whatsapp" label="whatsapp" icon={MessageCircle} />
          <SidebarLink href="/contact/phone" label="phone" icon={Phone} />
          <SidebarLink href="/contact/mail" label="Mail" icon={Mail} />
        </div>
      </div>

      {/* زر تسجيل الخروج */}
      <button
        type="button"
        className="mt-6 cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-red-50 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        onClick={() => {
          // TODO: استبدلها بمنطق تسجيل الخروج الحقيقي (next-auth signOut مثلاً)
          console.log("Logout clicked");
        }}
      >
        <LogOut className="h-4 w-4" />
        <span>تسجيل الخروج</span>
      </button>

      {/* روابط تحتية / سياسة الخصوصية */}
      <div className="mt-4 text-center text-[11px] text-slate-400">
        <p>شروط وأحكام الاستخدام · سياسة الخصوصية</p>
      </div>
    </aside>
  );
}



function SidebarLink({ href, label, icon: Icon }) {
  return (
    <Link
      href={href}
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