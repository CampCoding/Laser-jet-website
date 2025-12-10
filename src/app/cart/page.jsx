"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // ✅ أضفنا useState
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { getCartThunk } from "../../store/cartSlice";
import DeletePtoductitem from "@/CartAction/DeleteProduct";
import NewAddToCartButton from "../_commponent/NewCartButton";

// helper لتنسيق السعر
const formatPrice = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(value);

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.user?.accessToken;

  const {
    items,
    status: cartStatus,
    error: cartError,
  } = useSelector((state) => state.cart);

  // ✅ نتحكم في اللودينج الأول فقط
  const [initialLoading, setInitialLoading] = useState(true);

  // جلب بيانات السلة بعد ما المستخدم يكون Authenticated
  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    if (!accessToken) return;

    dispatch(getCartThunk({ token: accessToken }));
  }, [dispatch, accessToken, sessionStatus]);

  // ✅ نوقف اللودينج الأول لما السيشن و السلة يخلصوا تحميل لأول مرة
  useEffect(() => {
    if (
      sessionStatus !== "loading" &&
      cartStatus !== "loading" &&
      initialLoading
    ) {
      setInitialLoading(false);
    }
  }, [sessionStatus, cartStatus, initialLoading]);

  // حذف منتج من السلة ثم إعادة جلبها من الـ slice
  async function deleteProd(product_id) {
    if (!product_id) return;

    const res = await DeletePtoductitem(product_id);
    console.log("Delete Product Response:", res);

    if (res?.success) {
      toast.success("تم حذف المنتج من السلة");
      if (accessToken) {
        dispatch(getCartThunk({ token: accessToken }));
      }
    } else {
      toast.error(res?.message || "تعذر حذف المنتج من السلة");
    }
  }

  // 🔹 شاشة اللودينج العامة → فقط أول مرة
  if (initialLoading) {
    return <p className="text-center text-xl mt-10">...جاري التحميل</p>;
  }

  // لو مش عامل لوجين
  if (sessionStatus === "unauthenticated" || !session) {
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
          للوصول إلى سلة التسوق الخاصة بك، يجب أن تقوم بتسجيل الدخول.
        </p>
        <Link
          href={{
            pathname: "/login",
            query: { redirect: "/cart" },
          }}
          className="rounded-full bg-blue-600 px-6 py-3 text-white transition-all hover:shadow-2xl hover:scale-110 font-semibold hover:bg-blue-700"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  // لو حصل خطأ في جلب السلة
  if (cartStatus === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-3 text-red-600">
          حدث خطأ في جلب سلة التسوق
        </h1>
        <p className="text-gray-600 mb-4 text-sm">
          {cartError || "تعذّر جلب بيانات السلة، حاول مرة أخرى لاحقًا."}
        </p>
        <button
          onClick={() => {
            if (accessToken) {
              dispatch(getCartThunk({ token: accessToken }));
            }
          }}
          className="rounded-full bg-blue-600 px-5 py-2 text-white text-sm font-semibold hover:bg-blue-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const cartItems = items || [];

  // حساب الإجماليات
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.sell_price * item.quantity,
    0
  );
  const totalWithOffers = cartItems.reduce(
    (sum, item) =>
      sum + (item.offer?.sell_value ?? item.sell_price) * item.quantity,
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
          {cartItems.length === 0
            ? "سلة التسوق الخاصة بك فارغة."
            : `لديك ${cartItems.length} منتج في السلة.`}
        </p>

        <div className="space-y-4">
          {cartItems.map((item) => {
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
                        الكمية:{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="text-xs font-medium text-gray-900">
                        إجمالي المنتج: {formatPrice(lineTotal)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-xs">
                      <button
                        onClick={() => deleteProd(item.product_id)}
                        className="transition duration-150 cursor-pointer rounded-full border border-gray-300 px-3 py-1 hover:bg-red-600 hover:text-white"
                      >
                        إزالة من السلة
                      </button>
                      <NewAddToCartButton product={item} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {cartItems.length === 0 && (
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

        <button
          onClick={() => {
            if (!cartItems.length) {
              toast.error("لا يوجد منتجات في السلة");
              return;
            }
            router.push("/checkout");
          }}
          className="mt-5 w-full cursor-pointer rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 text-center block"
        >
          إتمام الشراء
        </button>
      </aside>
    </main>
  );
}
