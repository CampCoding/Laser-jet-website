

"use client"


import { ChevronsLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

const EmptyCheckout = () => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 backdrop-blur p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10">
        <ShoppingBag className="h-8 w-8 text-blue-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">سلة التسوق فارغة</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        لم تقم بإضافة أي منتجات بعد. تصفّح الأقسام واختر ما يناسبك ثم ارجع
        لإتمام الطلب.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full hover:shadow-2xl transition-all! bg-blue-600! px-6 py-3 text-sm font-bold text-white! shadow-md hover:bg-blue-700"
        >
          <span>تصفح المنتجات</span>
          <span className="text-base"><ChevronsLeft /></span>
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          العودة للرئيسية
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
          🔥 عروض يومية
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
          🚚 شحن سريع
        </span>
        <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-700">
          💳 طرق دفع متعددة
        </span>
      </div>
    </div>
  );
};

export default EmptyCheckout;
