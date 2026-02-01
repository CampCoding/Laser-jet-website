"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ShowWishList from "@/CartAction/ShowWishList";
import AddToWishList from "@/CartAction/AddToWishList";
import { toast } from "sonner";

import Container from "../../utils/Container";
import AddToCartButton from "../../CartButton";
import ProductCard from "../../Card/ProductCard";
import useGetHomeData from "../../../../../hooks/useGetHomeData";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";

export default function Recent_products() {
  const [favorites, setFavorites] = useState({});

  const { homeData, loading, error, fetchHomeData, setHomeData } =
    useGetHomeData();

  // 🟦 تحميل المنتجات + مزامنة favorites مع قائمة الأمنيات الحقيقية
  const Productdata = homeData?.recent_products || [];
  console.log("Productdata", homeData);
  // 🟦 إدارة القلب لكل منتج

  useEffect(() => {
    fetchHomeData();
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50 to-slate-100 py-6 sm:py-16">
      {/* خلفية ديكورية خفيفة */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-sky-100/70 blur-3xl" />
      </div>

      <Container className="relative z-10 mx-auto">
        {/* هيدر السكشن */}
        <div
          className="mb-8 flex flex-col gap-4 text-center md:mb-10 md:flex-row md:items-center justify-center items-center md:justify-between md:text-right"
          data-aos="fade-up"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2  rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              جديد في المتجر
            </div>

            <h2 className="bg-linear-to-r from-blue-700 via-sky-500 to-blue-700 bg-clip-text text-2xl font-extrabold tracking-wide text-transparent sm:text-3xl md:text-4xl">
              أحدث المنتجات المضافة
            </h2>

            <p className="max-w-xl text-xs text-slate-500 sm:text-sm md:max-w-md">
              اكتشف آخر ما تمت إضافته من منتجات، مع عروض وتشكيلة متجددة تناسب
              احتياجاتك اليومية.
            </p>
          </div>
          <div className="flex items-center    gap-2">
              <Link href={"/products"}>
                <Button className="cursor-pointer rounded-full bg-blue-600 px-5 py-2 text-xs sm:text-sm font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition">
                  عرض كل المنتجات
                </Button>
              </Link>
            </div>
        </div>

        {/* حالة التحميل – Skeleton */}
        {loading && (
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            data-aos="fade-up"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100 animate-pulse"
              >
                <div className="h-32 w-full rounded-xl bg-slate-200/80 sm:h-36" />
                <div className="h-3 w-3/4 rounded-full bg-slate-200/90" />
                <div className="flex items-center justify-between gap-2">
                  <div className="h-3 w-16 rounded-full bg-slate-200/90" />
                  <div className="h-8 w-16 rounded-full bg-slate-200/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* لو مفيش بيانات */}
        {!loading && Productdata.length === 0 && (
          <div
            className="flex items-center justify-center py-12"
            data-aos="fade-up"
          >
            <p className="text-sm text-slate-500">
              لا توجد منتجات حديثة متاحة حاليًا.
            </p>
          </div>
        )}

        {/* شبكة المنتجات الفعلية */}
        {!loading && Productdata.length > 0 && (
          <div
            className="grid grid-cols-2 gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            data-aos="fade-up"
          >
            {Productdata.map((product, index) => (
              <div
                key={product.product_id}
                className="transition-transform duration-300 hover:-translate-y-1"
                data-aos="zoom-in"
                data-aos-delay={index * 60}
              >
                <ProductCard
                  product={product}
                  onToggleFavorite={() => HandleTowishlist(product?.product_id)}
                />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
