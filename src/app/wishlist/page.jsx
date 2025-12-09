"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ShowWishList from "@/CartAction/ShowWishList";
import AddToCartButton from "../_commponent/CartButton";
import { Heart } from "lucide-react";
import ProductCard from "../_commponent/Card/ProductCard";
import AddToWishList from "../../CartAction/AddToWishList";
import { toast } from "sonner";
import { Select } from "antd";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();

  const [items, setItems] = useState([]); // استخدام state ديناميكي
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [hasOfferOnly, setHasOfferOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price-asc | price-desc | offer-first
  const [favorites, setFavorites] = useState({});
  // جلب البيانات من API
  async function GetDataInwishList() {
    try {
      const data = await ShowWishList();
      if (data?.success && data?.data) {
        setItems(data?.data); // حط كل العناصر اللي رجعت من API
        console.log("wishlist_data", data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }

  useEffect(() => {
    GetDataInwishList();
  }, []);
  async function HandleTowishlist(product_id) {
    try {
      const data = await AddToWishList(product_id);
      if (data.success) {
        // تحديث favorites
        const wishData = await ShowWishList();
        const wishItems = wishData?.data || [];
        setFavorites((prev) => ({
          ...prev,
          [product_id]: wishItems.some((w) => w.product_id === product_id),
        }));

        // ✅ إزالة العنصر من items لو تم مسحه من المفضلة
        if (!wishItems.some((w) => w.product_id === product_id)) {
          setItems((prev) =>
            prev.filter((item) => item.product_id !== product_id)
          );
        }

        toast.success(data.message, { duration: 5000, position: "top-center" });
      }
    } catch (error) {
      console.error(error);
    }
  }

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

  console.log("filteredItems", filteredItems);

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
          className="rounded-full bg-blue-600 px-6 py-3 text-white!  transition-all! hover:shadow-2xl! hover:scale-110 font-semibold hover:bg-blue-700! "
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-6xl px-4 py-8 space-y-6 lg:space-y-8"
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const normalizedProduct = {
                product_id: item.product_id,
                product_title: item.title,
                product_description: item.description,
                price: item.offer?.sell_value ?? item.sell_price,
                images: [
                  {
                    image_url: item?.images?.[0]?.image || "", // fallback
                  },
                ],
              };

              return (
                <ProductCard
                  key={item.product_id}
                  product={normalizedProduct}
                  isFavorite={true}
                  onToggleFavorite={HandleTowishlist}
                  AddToCartButton={AddToCartButton}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
