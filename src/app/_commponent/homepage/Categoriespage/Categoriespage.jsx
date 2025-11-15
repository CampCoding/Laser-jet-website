"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import HomeApi from "@/CallApi/HomaApi";
import Container from "../../utils/Container";
import { Button } from "../../../../components/ui/button";

export default function CategoriesSwiper() {
  const [data, setData] = useState([]);

  async function GetCatg() {
    const res = await HomeApi();
    if (res.message === "تم جلب البيانات بنجاح") {
      setData(res?.data?.categories);
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
    <section className="py-14 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* خلفية خفيفة */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#e0f2fe_0%,_transparent_70%)] pointer-events-none"></div>

      <Container className=" mx-auto relative z-10">
        {/* العنوان */}
        <div className=" flex items-center justify-between mb-10">
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 tracking-wide text-center"
            data-aos="fade-up"
          >
            الفئات
          </h2>
          <Button
            className={
              "bg-blue-600 hover:bg-blue-700 cursor-pointer hover:scale-105 active:scale-90"
            }
          >
            عرض الكل
          </Button>
        </div>

        {/* Swiper Responsive */}
        <Swiper
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 10 },
            768: { slidesPerView: 4, spaceBetween: 10 },
            1024: { slidesPerView: 8, spaceBetween: 10 },
          }}
          className="w-full"
        >
          {data.map((cat, index) => (
            <SwiperSlide key={cat.id}>
              <Link
                href={{
                  pathname: `/spasicfic-Catg/${cat?.category_id}`,
                  query: { name: cat?.category_title },
                }}
              >
                <div
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="relative w-full h-[120px] sm:h-[140px]  md:h-[150px] mb-4 rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl bg-white">
                    <Image
                      src={cat?.category_image}
                      alt={cat?.category_title}
                      fill
                      sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 200px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                    {/* لمعة */}
                    <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[100%] duration-1000 ease-in-out"></div>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 text-center transition-all duration-500 group-hover:text-blue-600 group-hover:scale-105">
                    {cat?.category_title}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
}
