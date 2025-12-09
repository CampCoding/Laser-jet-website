"use client";

import { useSession } from "next-auth/react";
import useCategoryProducts from "../../../hooks/useGetProducts";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "./Card/ProductCard";

export default function RecommendedProductsSwiper({ categoryId = 37 }) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { products, loading, error } = useCategoryProducts({
    categoryId,
    initialPage: 1,
    perPage: 10,
    token,
  });

  if (loading && !products.length) {
    return (
      <p className="text-center text-sm text-gray-500 mt-4">
        ...جاري تحميل المنتجات المقترحة
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 text-center mt-4 text-sm">
        {error}
      </p>
    );
  }

  if (!products.length) {
    return null; // مفيش منتجات مقترحة
  }

  return (
    <section
      className="w-full py-8 bg-slate-50/60 border-t border-slate-100 mt-6"
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        {/* الهيدر + أزرار التنقّل (ديسكتوب) */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              منتجات قد تعجبك
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              اخترنا لك منتجات من نفس القسم تناسب اهتماماتك.
            </p>
          </div>

          {/* أزرار التنقّل – تظهر من sm وأعلى */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              className="recommend-prev-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-600 hover:shadow-md disabled:opacity-40"
            >
              {/* في RTL: السابق → سهم لليمين */}
              <ChevronRight className="h-8 w-8" />
            </button>
            <button
              type="button"
              className="recommend-next-btn flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-600 hover:shadow-md disabled:opacity-40"
            >
              {/* في RTL: التالي → سهم لليسار */}
              <ChevronLeft className="h-8 w-8" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".recommend-next-btn",
            prevEl: ".recommend-prev-btn",
          }}
          // 🔹 إعدادات عامة
          spaceBetween={12}
          slidesPerView={1.2}
          loop={products.length > 4}
          className=" pt-5! pb-10!"
          // 🔹 Breakpoints محسّنة للموبايل والديسكتوب
          breakpoints={{
            360: { slidesPerView: 1.4, spaceBetween: 12 },
            480: { slidesPerView: 2, spaceBetween: 12 },
            640: { slidesPerView: 3, spaceBetween: 14 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 18 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p.product_id} className="h-auto">
              <div className="h-full">
                <ProductCard product={p} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
