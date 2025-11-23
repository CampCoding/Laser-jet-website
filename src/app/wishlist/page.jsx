"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ShowWishList from "@/CartAction/ShowWishList";
import AddToCartButton from "../_commponent/CartButton";

// تنسيق السعر
const formatPrice = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(value);

// استخراج الماركة من details (العلامة التجارية / ماركة)
const getBrand = (item) => {
  const brandDetail =
    item.details?.find(
      (d) =>
        d.label === "العلامة التجارية" ||
        d.label === "ماركة" ||
        d.label.toLowerCase().includes("brand")
    ) || null;

  return brandDetail ? brandDetail.value : "غير محدد";
};

export default function WishlistPage() {
  const [items, setItems] = useState([]); // استخدام state ديناميكي
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [hasOfferOnly, setHasOfferOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price-asc | price-desc | offer-first

  // جلب البيانات من API
  async function GetDataInwishList() {
    try {
      const data = await ShowWishList();
      if (data?.success && data?.data) {
        setItems(data.data); // حط كل العناصر اللي رجعت من API
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }

  useEffect(() => {
    GetDataInwishList();
  }, []);

  // الفئات المتاحة
  const categories = useMemo(() => {
    const setCat = new Set();
    items.forEach((item) => {
      if (item.category?.title) setCat.add(item.category.title);
    });
    return Array.from(setCat);
  }, [items]);

  // الماركات المتاحة
  const brands = useMemo(() => {
    const setBrand = new Set();
    items.forEach((item) => {
      const b = getBrand(item);
      if (b) setBrand.add(b);
    });
    return Array.from(setBrand);
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
      result = result.filter(
        (item) => item.category?.title === categoryFilter
      );
    }

    if (brandFilter !== "all") {
      result = result.filter((item) => getBrand(item) === brandFilter);
    }

    if (hasOfferOnly) {
      result = result.filter((item) => !!item.offer);
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.offer?.sell_value ?? a.sell_price) - (b.offer?.sell_value ?? b.sell_price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.offer?.sell_value ?? b.sell_price) - (a.offer?.sell_value ?? a.sell_price));
    } else if (sortBy === "offer-first") {
      result.sort((a, b) => (b.offer ? 1 : 0) - (a.offer ? 1 : 0));
    }

    return result;
  }, [items, search, categoryFilter, brandFilter, hasOfferOnly, sortBy]);

  const totalWishlist = useMemo(
    () =>
      filteredItems.reduce((sum, item) => {
        const price = item.offer?.sell_value ?? item.sell_price;
        return sum + price;
      }, 0),
    [filteredItems]
  );

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((p) => p.product_id !== id));
  };

  const handleAddToCart = (item) => {
    console.log("Add to cart:", item.product_id);
    alert("تم إضافة المنتج إلى السلة (تجريبيًا) 👍");
  };

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-4 py-8 space-y-6 lg:space-y-8">
      {/* الهيدر */}
      <header className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قائمة الأمنيات</h1>
          <p className="mt-1 text-sm text-gray-500">
            {items.length === 0
              ? "قائمة الأمنيات فارغة حاليًا."
              : `لديك ${items.length} منتج في قائمة الأمنيات، يتم عرض ${filteredItems.length} منها حسب الفلاتر.`}
          </p>
        </div>
        {filteredItems.length > 0 && (
          <div className="rounded-2xl bg-gray-50 px-4 py-2 text-xs text-gray-700">
            إجمالي قيمة العناصر المعروضة: <span className="font-semibold">{formatPrice(totalWishlist)}</span>
          </div>
        )}
      </header>

      {/* الفلاتر */}
      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* البحث */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">البحث</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم المنتج، الفئة، المواصفات..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-gray-400">🔍</span>
            </div>
          </div>

          {/* الترتيب */}
          <div className="w-full md:w-56">
            <label className="mb-1 block text-xs font-medium text-gray-600">ترتيب حسب</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="recommended">الافتراضي (الأفضل لك)</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="offer-first">الأولوية للمنتجات المخفّضة</option>
            </select>
          </div>
        </div>

        {/* باقي الفلاتر */}
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">الفئة:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">الماركة:</span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const mainImage = item.images?.[0]?.image;
              const brand = getBrand(item);
              const price = item.sell_price;
              const offerPrice = item.offer?.sell_value ?? null;
              const discountPercent = item.offer?.offer_value ?? null;

              const bestInstallment = item.installments && [...item.installments].reverse()[0];
              let monthly = null;
              if (bestInstallment) {
                const match = bestInstallment.installment_title.match(/\d+/);
                const months = match ? parseInt(match[0], 10) : null;
                if (months && months > 0) monthly = bestInstallment.full_price / months;
              }

              return (
                <div key={item.product_id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                    {mainImage && <Image src={mainImage} alt={item.title} fill className="object-contain p-4 transition group-hover:scale-[1.03]" />}
                    {discountPercent && <div className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow">خصم %{discountPercent}</div>}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h2 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">{item.title}</h2>
                      <p className="mb-1 text-[11px] text-gray-500">{item.category?.title}{brand && ` • ${brand}`}</p>
                      {item.details && item.details.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-gray-600">
                          {item.details.slice(0, 3).map((d) => <span key={d.product_detail_id} className="rounded-full bg-gray-50 px-2 py-0.5">{d.label}: {d.value}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap items-baseline gap-2">
                        {offerPrice && <span className="text-base font-bold text-emerald-600">{formatPrice(offerPrice)}</span>}
                        <span className={offerPrice ? "text-xs text-gray-400 line-through" : "text-base font-semibold text-gray-900"}>{formatPrice(price)}</span>
                      </div>
                      {bestInstallment && monthly && <p className="text-[11px] text-blue-700">متوفر تقسيط حتى <span className="font-semibold">{bestInstallment.installment_title}</span> — تقريبًا <span className="font-semibold">{formatPrice(monthly)}</span> / شهر</p>}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        {/* <button onClick={() => handleAddToCart(item)} className="flex-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">إضافة إلى السلة</button> */}
   <AddToCartButton product={item} />
                      </div>
                      <Link href={`/products/${item.product_id}`} className="mt-1 block text-[11px] text-blue-600 hover:underline">عرض تفاصيل المنتج</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

