"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { getCartThunk, removeCartItemLocal } from "../../store/cartSlice";
import DeletePtoductitem from "@/CartAction/DeleteProduct";

import EmptyCheckout from "../_commponent/EmptyCheckout";
import cx from "../../lib/cx";

import { Button, Card, Steps } from "antd";
import { ShoppingBag, User, Phone, Trash } from "lucide-react";
import AddToCartButton from "../_commponent/CartButton";

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

  // ✅ ALL REFS
  const fetchedOnceRef = useRef(false);
  const initialFetchDoneRef = useRef(false);

  // ✅ ALL EFFECTS
  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    if (!accessToken) return;
    if (fetchedOnceRef.current) return;

    fetchedOnceRef.current = true;
    dispatch(getCartThunk({ token: accessToken }));
  }, [dispatch, accessToken, sessionStatus]);

  useEffect(() => {
    if (cartStatus === "succeeded" || cartStatus === "failed") {
      initialFetchDoneRef.current = true;
    }
  }, [cartStatus]);

  // ✅ PREPARE DATA (before any returns)
  const cartItems = items || [];

  // ✅ ALL MEMOS (must be before any returns)
  const { subtotal, totalWithOffers, totalDiscount } = useMemo(() => {
    const subtotalCalc = cartItems.reduce(
      (sum, item) => sum + item.sell_price * item.quantity,
      0
    );

    const totalWithOffersCalc = cartItems.reduce(
      (sum, item) =>
        sum + (item.offer?.sell_value ?? item.sell_price) * item.quantity,
      0
    );

    return {
      subtotal: subtotalCalc,
      totalWithOffers: totalWithOffersCalc,
      totalDiscount: subtotalCalc - totalWithOffersCalc,
    };
  }, [cartItems]);

  // ✅ ALL CALLBACKS/FUNCTIONS
  async function deleteProd(product_id) {
    const res = await DeletePtoductitem(product_id);

    if (res?.success) {
      toast.success("تم حذف المنتج من السلة");
      dispatch(removeCartItemLocal({ product_id }));
    } else {
      toast.error(res?.message || "تعذر حذف المنتج من السلة");
    }
  }

  // ✅ NOW SAFE TO DO CONDITIONAL RETURNS
  const shouldShowFirstLoading =
    sessionStatus === "authenticated" &&
    cartStatus === "loading" &&
    !initialFetchDoneRef.current;

  if (shouldShowFirstLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-100">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur border-b border-slate-100 shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-5 md:py-6 flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Products Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white p-5"
                    >
                      <div className="h-32 w-32 rounded-xl bg-slate-100 animate-pulse mx-auto sm:mx-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                        <div className="flex justify-between">
                          <div className="h-9 w-28 bg-slate-100 rounded-full animate-pulse" />
                          <div className="h-9 w-28 bg-slate-200 rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Skeleton */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-5" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-slate-100 rounded animate-pulse" />
                  <div className="h-10 w-full bg-slate-200 rounded-full animate-pulse mt-4" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            جاري تحميل بيانات السلة...
          </p>
        </div>
      </div>
    );
  }

  // لو مش عامل لوجين
  if (sessionStatus !== "loading" && sessionStatus === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-linear-to-b from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-5">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-slate-900">
            الرجاء تسجيل الدخول أولًا
          </h1>
          <p className="text-slate-500 mb-7 text-base">
            للوصول إلى سلة التسوق الخاصة بك، يجب أن تقوم بتسجيل الدخول.
          </p>
          <Link
            href={{
              pathname: "/login",
              query: { redirect: "/cart" },
            }}
          >
            <Button
              type="primary"
              size="large"
              className="w-full rounded-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
            >
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // لو حصل خطأ في جلب السلة
  if (cartStatus === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-linear-to-b from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
          <h1 className="text-2xl font-bold mb-3 text-red-600">
            حدث خطأ في جلب سلة التسوق
          </h1>
          <p className="text-slate-500 mb-6 text-sm">
            {cartError || "تعذّر جلب بيانات السلة، حاول مرة أخرى لاحقًا."}
          </p>
          <Button
            onClick={() => {
              fetchedOnceRef.current = false;
              initialFetchDoneRef.current = false;
              if (accessToken) dispatch(getCartThunk({ token: accessToken }));
            }}
            type="primary"
            size="large"
            className="rounded-full bg-blue-600 hover:bg-blue-700 h-11 px-6"
          >
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const currentStep = 0;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-100"
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 shadow-sm z-30">
        <div className="container mx-auto px-4 py-5 md:py-6 flex flex-col w-full gap-4 md:flex-row items-center justify-between">
          <div className="flex items-start gap-4 w-full!">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-7 h-7" />
            </div>

            <div className="w-full!">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                سلة التسوق
              </h1>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                {cartItems.length === 0
                  ? "سلة التسوق الخاصة بك فارغة."
                  : `لديك ${cartItems.length} منتج في السلة.`}
              </p>

              <div className="mt-3 w-full!">
                <Steps
                  current={currentStep}
                  direction="horizontal"
                  items={[
                    { title: "السلة" },
                    { title: "العنوان" },
                    { title: "الدفع" },
                    { title: "تأكيد" },
                  ]}
                  className={cx(
                    "[&_.ant-steps-item-title]:text-sm",
                    "[&_.ant-steps-item-description]:text-xs"
                  )}
                />
              </div>
            </div>
          </div>

          {/* user info */}
          <div className="hidden md:flex flex-col items-end text-sm md:text-base text-slate-700 gap-2">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <span className="font-medium">{session?.user?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-slate-400" />
              <span className="font-medium">{session?.user?.phone}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Products column */}
          <section
            className={cx(
              "lg:col-span-2 space-y-6 bg-red",
              cartItems.length == 0 && "lg:col-span-3!"
            )}
          >
            <Card
              className="border border-slate-100 rounded-2xl"
              bodyStyle={{ padding: 20 }}
              title={
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-emerald-500" />
                    <span className="font-bold text-slate-800 text-lg">
                      منتجات السلة
                    </span>
                  </div>
                  {cartItems.length > 0 && (
                    <span className="text-sm text-slate-500">
                      عدد المنتجات:{" "}
                      <span className="font-bold text-slate-800">
                        {cartItems.length}
                      </span>
                    </span>
                  )}
                </div>
              }
            >
              <div className="space-y-5">
                {cartItems.map((item) => {
                  const unitPrice = item.sell_price;
                  const offerPrice = item.offer?.sell_value ?? null;
                  const lineTotal = (offerPrice ?? unitPrice) * item.quantity;

                  return (
                    <div
                      key={item.product_id}
                      className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                    >
                      {offerPrice && (
                        <div className="absolute z-20 rounded-t-2xl bg-rose-500 text-white text-xs font-semibold px-12 py-1.5 shadow-md">
                          عرض خاص
                        </div>
                      )}

                      <div className="relative h-32 w-32 sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 mx-auto sm:mx-0 bg-slate-50">
                        <Image
                          src={item.images}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between gap-3">
                        <div className="flex justify-between gap-3">
                          <div className="flex-1">
                            <h2 className="mb-2 text-base md:text-lg font-bold text-slate-900 line-clamp-2">
                              {item.title}
                            </h2>

                            {item.category?.title && (
                              <p className="text-sm text-slate-400">
                                {item.category.title}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => deleteProd(item.product_id)}
                            className="self-start w-10 h-10 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all"
                            title="إزالة المنتج"
                          >
                            <Trash />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <div className="space-y-1.5 text-sm md:text-base w-full">
                            <div className="flex items-baseline gap-2">
                              {offerPrice && (
                                <span className="text-lg md:text-xl font-bold text-emerald-600">
                                  {formatPrice(offerPrice)}
                                </span>
                              )}
                              <span
                                className={
                                  offerPrice
                                    ? "text-sm md:text-base text-slate-400 line-through"
                                    : "text-lg font-bold text-slate-900"
                                }
                              >
                                {formatPrice(unitPrice)}
                              </span>
                            </div>

                            <p className="text-sm  md:text-base text-slate-500 flex  items-center gap-2">
                              <span>
                                الكمية:{" "}
                                <span className="font-bold text-slate-900">
                                  {item.quantity}
                                </span>
                              </span>
                            </p>

                            <div className="flex flex-col md:flex-row justify-between flex-start md:items-center gap-3 w-full">
                              <p className="text-sm md:text-base font-bold text-slate-900">
                                إجمالي المنتج:{" "}
                                <span className="text-emerald-600">
                                  {formatPrice(lineTotal)}
                                </span>
                              </p>
                              <div className="w-fit">
                                <AddToCartButton
                                  product={{
                                    ...item,
                                    cart_quantity: item?.quantity || 1,
                                  }}
                                  inCart={true}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {cartItems.length === 0 && <EmptyCheckout />}
              </div>
            </Card>
          </section>

          {/* Summary column */}
          {cartItems.length > 0 && (
            <aside className="lg:col-span-1 lg:sticky! lg:top-32 self-start w-full rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
              <h2 className="mb-5 text-xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                </span>
                ملخص الطلب
              </h2>

              <div className="space-y-3 text-base text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">الإجمالي قبل الخصم</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="font-medium">إجمالي الخصم</span>
                    <span className="font-bold">
                      - {formatPrice(totalDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-500 text-sm">
                  <span>تكلفة الشحن</span>
                  <span>يتم احتسابها لاحقًا</span>
                </div>

                <div className="flex items-center justify-between border-t-2 border-dashed border-slate-200 pt-4 text-lg font-bold text-slate-900">
                  <span>الإجمالي المستحق</span>
                  <span className="text-emerald-600">
                    {formatPrice(totalWithOffers)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  if (!cartItems.length) {
                    toast.error("لا يوجد منتجات في السلة");
                    return;
                  }
                  router.push("/checkout");
                }}
                type="primary"
                size="large"
                className="mt-6 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-bold shadow-lg"
              >
                إتمام الشراء
              </Button>

              <p className="mt-4 text-sm text-slate-500 text-center leading-relaxed">
                بالضغط على زر <span className="font-bold">إتمام الشراء</span>{" "}
                سيتم نقلك لصفحة إتمام الطلب.
              </p>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
