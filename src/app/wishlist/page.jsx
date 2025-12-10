"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "../_commponent/Card/ProductCard";
import { Select } from "antd";
import { useSession } from "next-auth/react";
import useWishlist from "../../../hooks/useGetCustomHook";

// استخراج الماركة من details (العلامة التجارية / ماركة)
const getBrand = (item) => {
  const brandDetail =
    item.details?.find(
      (d) =>
        d.label === "العلامة التجارية" ||
        d.label === "ماركة" ||
        d.label?.toLowerCase?.().includes("brand")
    ) || null;

  return brandDetail ? brandDetail.value : "غير محدد";
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  // ✅ استخدم الـ hook الجديد
  const { wishlist: items, loading, error, refetch } = useWishlist(token);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [hasOfferOnly, setHasOfferOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price-asc | price-desc | offer-first
  // 🌀 حالة التحميل
  if (loading) {
    return (
      <main className="mx-auto container  px-4 md:px-10 py-8 space-y-6 lg:space-y-8">
        <header className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">قائمة المفضلة</h1>
            <p className="mt-1 text-sm text-gray-500">
              جاري تحميل المنتجات المفضلة الخاصة بك...
            </p>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="h-32 rounded-xl bg-gray-100 mb-3" />
              <div className="h-3 w-3/4 rounded-full bg-gray-100 mb-2" />
              <div className="h-3 w-1/2 rounded-full bg-gray-100 mb-1" />
              <div className="h-3 w-1/3 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </main>
    );
  }
  console.log("loading", loading);
  // لو مش عامل لوجين
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
          للوصول إلى قائمة المفضلة الخاصة بك، يجب أن تقوم بتسجيل الدخول.
        </p>
        <Link
          href={{
            pathname: "/login",
            query: { redirect: "/wishlist" },
          }}
          className="rounded-full bg-blue-600 px-6 py-3 text-white! transition-all! hover:shadow-2xl! hover:scale-110 font-semibold hover:bg-blue-700! "
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  // ❌ حالة الخطأ
  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
          <p className="text-sm font-semibold text-red-700">
            حدث خطأ أثناء جلب قائمة المفضلة
          </p>
          <p className="mt-1 text-xs text-red-500">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </main>
    );
  }

  // الفئات المتاحة
  const categories = useMemo(() => {
    const setCat = new Set();
    items.forEach((item) => {
      if (item.category?.title) setCat.add(item.category.title);
    });
    return Array.from(setCat);
  }, [items]);

  // تطبيق الفلترة + الترتيب
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((item) => {
        const inTitle = item.title?.toLowerCase().includes(q);
        const inCat = item.category?.title?.toLowerCase().includes(q);
        const inDetails = item.details?.some((d) =>
          `${d.label} ${d.value}`.toLowerCase().includes(q)
        );
        return inTitle || inCat || inDetails;
      });
    }

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category?.title === categoryFilter);
    }

    if (brandFilter !== "all") {
      result = result.filter((item) => getBrand(item) === brandFilter);
    }

    if (hasOfferOnly) {
      result = result.filter((item) => !!item.offer);
    }

    if (sortBy === "price-asc") {
      result.sort(
        (a, b) =>
          (a.offer?.sell_value ?? a.sell_price) -
          (b.offer?.sell_value ?? b.sell_price)
      );
    } else if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          (b.offer?.sell_value ?? b.sell_price) -
          (a.offer?.sell_value ?? a.sell_price)
      );
    } else if (sortBy === "offer-first") {
      result.sort((a, b) => (b.offer ? 1 : 0) - (a.offer ? 1 : 0));
    }

    return result;
  }, [items, search, categoryFilter, brandFilter, hasOfferOnly, sortBy]);

  // لما المستخدم يشيل منتج من المفضلة (من جوه ProductCard)
  const handleRemove = (id) => {
    // 🔹 مش هنلمس الـ hook نفسه، لكن نعمل refetch بعد شوية
    // أو تقدر تعتمد على revalidate من API لو AddToWishList بيرجع الليست الجديدة
    // هنا هنكتفي بـ refetch:
    refetch();
  };

  return (
    <main
      dir="rtl"
      className="mx-auto container  px-4 md:px-10 py-8 space-y-6 lg:space-y-8"
    >
      {/* الهيدر */}
      <header className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قائمة المفضله</h1>
          <p className="mt-1 text-sm text-gray-500">
            {items.length === 0
              ? "قائمة المفضلة فارغة حاليًا."
              : `لديك ${items.length} منتج في قائمة المفضلة، يتم عرض ${filteredItems.length} منها حسب الفلاتر.`}
          </p>
        </div>
      </header>

      {/* الفلاتر */}
      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* البحث */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              البحث
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم المنتج، الفئة، المواصفات..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* الترتيب */}
          <div className="w-full md:w-56">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              ترتيب حسب
            </label>
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              className="w-full"
              size="large"
              options={[
                { value: "recommended", label: "الافتراضي (الأفضل لك)" },
                { value: "price-asc", label: "السعر: من الأقل للأعلى" },
                { value: "price-desc", label: "السعر: من الأعلى للأقل" },
                { value: "offer-first", label: "الأولوية للمنتجات المخفّضة" },
              ]}
            />
          </div>
        </div>

        {/* باقي الفلاتر */}
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">الفئة:</span>
            <Select
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1"
              size="middle"
              popupClassName="rounded-xl"
              options={[
                { value: "all", label: "الكل" },
                ...categories.map((cat) => ({
                  value: cat,
                  label: cat,
                })),
              ]}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-50 px-3 py-1">
            <input
              type="checkbox"
              checked={hasOfferOnly}
              onChange={(e) => setHasOfferOnly(e.target.checked)}
              className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">منتجات عليها عروض فقط</span>
          </label>
        </div>
      </section>

      {/* شبكة المنتجات */}
      <section>
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            لا توجد نتائج مطابقة للفلاتر الحالية.
            <br />
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
                setBrandFilter("all");
                setHasOfferOnly(false);
                setSortBy("recommended");
              }}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => {
              const normalizedProduct = {
                product_id: item.product_id,
                product_title: item.title,
                product_description: item.description,
                price: item.offer?.sell_value ?? item.sell_price,
                images: [
                  {
                    image_url: item?.images?.[0]?.image || "",
                  },
                ],
                offer: item.offer,
                installments: item.installments,
                category: item.category,
              };

              return (
                <ProductCard
                  key={item.product_id}
                  product={normalizedProduct}
                  onWishlistChange={() => handleRemove(item.product_id)}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
