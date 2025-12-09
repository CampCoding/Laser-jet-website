"use client";

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import HomeApi from "@/CallApi/HomaApi";
import Container from "../../utils/Container";
import { Button } from "../../../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriesSwiper() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const swiperRef = useRef(null);

  async function GetCatg() {
    try {
      const res = await HomeApi();
      if (res?.message === "تم جلب البيانات بنجاح") {
        setData(res?.data?.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetCatg();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 md:py-16">
      {/* خلفية ديكورية ناعمة */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
      </div>

      <Container className="relative z-10 mx-auto">
        {/* هيدر السكشن */}
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-center md:justify-between">
          {/* النصوص */}
          <div
            className="space-y-3 text-center md:text-right"
            data-aos="fade-up"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              اكتشف منتجاتك حسب الفئة
            </div>

            <h2 className="bg-gradient-to-r from-blue-700 via-sky-500 to-blue-700 bg-clip-text text-2xl font-extrabold tracking-wide text-transparent sm:text-3xl md:text-4xl">
              تسوّق من أفضل الفئات لدينا
            </h2>

            <p className="mx-auto max-w-xl text-xs text-slate-500 sm:text-sm md:mx-0">
              اختر الفئة التي تناسب احتياجاتك، وتصفّح مجموعة واسعة من المنتجات
              بتجربة سلسة وسريعة على جميع الأجهزة.
            </p>

            {!loading && data.length > 0 && (
              <p className="text-xs text-slate-500 sm:text-sm">
                متوفر حاليًا{" "}
                <span className="font-semibold text-blue-700">
                  {data.length} فئة
                </span>{" "}
                يمكنك البدء منها.
              </p>
            )}
          </div>

          {/* زر عرض الكل + أزرار التنقل */}
          <div
            className="flex flex-col items-center gap-3 md:items-end"
            data-aos="fade-left"
          >
            <div className="flex items-center gap-2">
              <Link href={"/categories"}>
                <Button className="cursor-pointer rounded-full bg-blue-600 px-5 py-2 text-xs sm:text-sm font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 transition">
                  عرض كل الفئات
                </Button>
              </Link>
            </div>

            {/* أزرار النقر يمين/يسار للـ swiper في الشاشات الكبيرة */}
            {!loading && data.length > 0 && (
              <div className="hidden items-center gap-2 md:flex">
                <button
                  aria-label="السابق"
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  aria-label="التالي"
                  onClick={() => swiperRef.current?.slideNext()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* حالة التحميل – Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 animate-pulse"
              >
                <div className="h-[110px] w-full rounded-3xl bg-slate-200/70 sm:h-[130px] md:h-[140px]" />
                <div className="h-3 w-20 rounded-full bg-slate-200/80" />
              </div>
            ))}
          </div>
        )}

        {/* لو مفيش داتا */}
        {!loading && data.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-slate-500">
              لا توجد فئات متاحة حاليًا، حاول لاحقًا.
            </p>
          </div>
        )}

        {/* Swiper الحقيقي */}
        {!loading && data.length > 0 && (
          <Swiper
            modules={[Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={18}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 3, spaceBetween: 18 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 6, spaceBetween: 22 },
              1280: { slidesPerView: 8, spaceBetween: 24 },
            }}
            className="w-full"
          >
            {data.map((cat, index) => (
              <SwiperSlide key={cat.id || `${cat.category_id}-${index}`}>
                <Link
                  href={{
                    pathname: `/spasicfic-Catg/${cat?.category_id}`,
                    query: { name: cat?.category_title },
                  }}
                >
                  <div
                    data-aos="zoom-in"
                    data-aos-delay={index * 60}
                    className="group flex cursor-pointer flex-col items-center"
                  >
                    {/* إطار خارجي جريتنت + Glass effect */}
                    <div className="relative w-full">
                      {/* هالة جريتنت عند الهوفر */}
                      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/15 via-sky-400/15 to-blue-700/15 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />

                      {/* الكرت */}
                      <div className="relative mb-3 h-[120px] w-full overflow-hidden rounded-3xl bg-white/90 shadow-sm ring-1 ring-slate-100 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:ring-blue-100 sm:h-[130px] md:h-[145px]">
                        <Image
                          src={cat?.category_image}
                          alt={cat?.category_title || "category"}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        />

                        {/* Overlay خفيف */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* لمعة سريعة */}
                        <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 duration-1000 ease-in-out group-hover:translate-x-[120%] group-hover:opacity-100" />
                      </div>
                    </div>

                    {/* عنوان الفئة */}
                    <p className="max-w-[130px] text-center text-xs font-semibold text-slate-800 transition-all duration-500 group-hover:scale-105 group-hover:text-blue-700 sm:text-sm md:text-base">
                      {cat?.category_title}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
}
