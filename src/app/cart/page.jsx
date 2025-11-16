"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

// helper لتنسيق السعر
const formatPrice = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(value);

// 👇 دالة جلب الكارت
async function getCart() {
  // مؤقتًا داتا ثابتة
  return {
    success: true,
    message: "تم جلب سلة تسوقك بنجاح",
    data: [
      {
        product_id: 175,
        quantity: 1,
        sell_price: 1980,
        title: "خلاط مع 2 مطحنة",
        images:
          "https://camp-coding.site/laserjet/uploads/products/1762883330028.jpg",
        offer: { offer_value: 4, sell_value: 1900.8 },
      },
      {
        product_id: 187,
        quantity: 1,
        sell_price: 22277.8,
        title:
          "Oppo Reno14 F 5G - 256GB/12GB - Opal Blue (صنع في مصر)",
        images:
          "https://camp-coding.site/laserjet/uploads/products/1762880050417.png",
        offer: { offer_value: 16.5, sell_value: 18601.963 },
      },
    ],
  };
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      const data = await getCart();
      setCart(data);
    }
    fetchCart();
  }, []);

  if (status === "loading" || !cart) {
    return <p className="text-center text-xl mt-10">...جاري التحميل</p>;
  }

  // لو مش عامل لوجين
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          الرجاء تسجيل الدخول أولًا
        </h1>
        <p className="text-gray-600 mb-6">
          للوصول إلى سلة التسوق الخاصة بك، يجب أن تقوم بتسجيل الدخول.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  const items = cart.data || [];

  // حساب الإجماليات
  const subtotal = items.reduce(
    (sum, item) => sum + item.sell_price * item.quantity,
    0
  );
  const totalWithOffers = items.reduce(
    (sum, item) => sum + (item.offer?.sell_value ?? item.sell_price) * item.quantity,
    0
  );
  const totalDiscount = subtotal - totalWithOffers;

  return (
    <main
      dir="rtl"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row"
    >
      {/* عمود المنتجات */}
      <section className="flex-1">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">سلة التسوق</h1>
        <p className="mb-6 text-sm text-gray-500">
          {items.length === 0
            ? "سلة التسوق الخاصة بك فارغة."
            : `لديك ${items.length} منتج في السلة.`}
        </p>

        <div className="space-y-4">
          {items.map((item) => {
            const unitPrice = item.sell_price;
            const offerPrice = item.offer?.sell_value ?? null;
            const lineTotal = (offerPrice ?? unitPrice) * item.quantity;

            return (
              <div
                key={item.product_id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
              >
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
                  <Image
                    src={item.images}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div>
                    <h2 className="mb-1 text-sm font-semibold text-gray-900">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-baseline gap-2">
                        {offerPrice && (
                          <span className="text-base font-bold text-emerald-600">
                            {formatPrice(offerPrice)}
                          </span>
                        )}
                        <span
                          className={
                            offerPrice
                              ? "text-xs text-gray-400 line-through"
                              : "text-base font-semibold text-gray-900"
                          }
                        >
                          {formatPrice(unitPrice)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        الكمية: <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="text-xs font-medium text-gray-900">
                        إجمالي المنتج: {formatPrice(lineTotal)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-xs">
                      <button className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50">
                        إزالة من السلة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
              لا توجد منتجات في سلتك حاليًا.
              <br />
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                تصفح المنتجات
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ملخص الطلب */}
      <aside className="w-full max-w-sm self-start rounded-2xl bg-white p-5 shadow-md">
        <h2 className="mb-4 text-lg font-bold text-gray-900">ملخص الطلب</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span>الإجمالي قبل الخصم</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-emerald-600">
              <span>إجمالي الخصم</span>
              <span>- {formatPrice(totalDiscount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-base font-bold text-gray-900">
            <span>الإجمالي المستحق</span>
            <span>{formatPrice(totalWithOffers)}</span>
          </div>
        </div>

        <button className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
          إتمام الشراء
        </button>
      </aside>
    </main>
  );
}

