"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import HomeApi from "@/CallApi/HomaApi";
import Container from "../../utils/Container";

export default function PanerPage() {
  const [imagesdata, setimagedata] = useState([]);

  async function GetData() {
    const data = await HomeApi();
    if (data.message === "تم جلب البيانات بنجاح") {
      setimagedata(data.data.banners);
    }
  }

  useEffect(() => {
    GetData();
  }, []);

  const progressCircle = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current)
      progressCircle.current.style.setProperty("--progress", 1 - progress);
  };

  return (
    <Container className="relative flex justify-center items-center py-10 bg-linear-to-b from-gray-50 to-gray-100">
      <div className="  shadow-xl rounded-3xl overflow-hidden">
        <Swiper
          spaceBetween={30}
          centeredSlides
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-white !opacity-60",
            bulletActiveClass: "!bg-orange-500 !opacity-100",
          }}
          modules={[Autoplay, Pagination]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="w-full rounded-3xl"
        >
          {imagesdata.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[180px] md:h-[400px] lg:h-[500px] overflow-hidden group">
                <Image
                  src={item.banner_image}
                  fill
                  alt={`banner-${item.id}`}
                  className="object-cover h-auto rounded-3xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}

          {/* دائرة التقدم */}
          {/* <div
            className="absolute bottom-6 right-8 z-10 flex items-center justify-center"
            slot="container-end"
          >
            <svg
              ref={progressCircle}
              viewBox="0 0 48 48"
              className="w-10 h-10 rotate-[-90deg]"
              style={{
                "--progress": 1,
              }}
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#155DFC"
                strokeWidth="4"
                fill="none"
                strokeDasharray="125.6"
                strokeDashoffset="calc(125.6 * var(--progress))"
                style={{
                  transition: "stroke-dashoffset 0.3s linear",
                }}
              />
            </svg>
          </div> */}
        </Swiper>
      </div>
    </Container>
  );
}


