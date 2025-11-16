"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Heart, ChevronRight, ShoppingCart } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import SpasificProd from "@/CallApi/SpasificProd";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import AddToCartButton from "../../_commponent/CartButton";
export default function ProductDetailsPage() {

  const [isFav, setIsFav] = useState(false);
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  console.log(id);
const[alltext,setalltext]=useState(false)
  async function GetSpasificdata(id) {
    const data = await SpasificProd(id);
    if (data.message === "تم جلب المنتج بنجاح") {
      console.log(data);
      setProduct(data.data.products[0]); // أول منتج فقط
    }
  }

  useEffect(() => {
    GetSpasificdata(id);
  }, [id]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center text-gray-500">
        جاري تحميل المنتج...
      </div>
    );
  }

  // تحديد الصورة
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0].image_url
      : "/image_mrJAiGHB_1732459023323_raw.jpg";

  // السعر النهائي
  const finalPrice = product.offer?.sell_value
    ? product.offer.sell_value
    : product.sell_price;

  return (
    <div className=" w-full md:container  mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Card
        data-aos="fade-up"
        className="border border-gray-200 shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl transition-all bg-gradient-to-b from-white to-gray-50"
      >
        {/* العنوان */}
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-blue-700 flex items-center gap-3">
            <Link href="/">
              <ChevronRight className="w-8 h-8 hover:text-blue-500 transition-colors" />
            </Link>
            تفاصيل المنتج
          </CardTitle>
        </CardHeader>

        {/* الصورة والوصف القصير جنب بعض */}
        <CardContent className="flex flex-col md:flex-row items-center md:items-start lg:items-center justify-center py-8 px-6">
          {/* الصورة */}
         <div className="w-full md:w-[350px]">
  <Carousel
    className="w-full max-w-[350px] mx-auto"
    opts={{ loop: true }}
    plugins={[
      Autoplay({
        delay: 2500, 
        stopOnInteraction: false,
        stopOnMouseEnter: true, 
      }),
    ]}
  >
    <CarouselContent>
      {product.images?.map((img, index) => (
        <CarouselItem key={index}>
          <div className="relative w-full h-[350px] rounded-2xl overflow-hidden shadow-md">


   {/* 🔥 لو في عرض يظهر فوق الصورة */}
            {product.offer?.offer_value && (
              <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold z-20 shadow-lg">
                {product.offer.offer_value}%
              </div>
            )}


            <Image
              src={img.image_url}
              fill
              alt={product.title}
              className="object-cover rounded-2xl"
            />
          </div>
        </CarouselItem>
      ))}


      
    </CarouselContent>

    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>

          {/* الوصف القصير + السعر */}
          <div className="flex-1 text-center md:text-left mt-6 md:mt-0 md:ml-6">
            {/* الوصف القصير */}
            <CardDescription
              data-aos="fade-up"
              className="text-gray-700 text-lg mb-4 text-center md:text-left"
            >
              {product.title}

 


            </CardDescription>
         <div
  data-aos="fade-up"
  data-aos-delay="100"
  className="text-2xl font-bold text-blue-600 mb-4 direction-ltr "
>
  {product.offer?.sell_value ? (
    <div className="flex flex-col    ">
      <span className="text-gray-500 line-through text-lg">
        {product.sell_price} جنيه
      </span>
      <span className="text-blue-700 text-3xl font-bold">
        {product.offer.sell_value} جنيه
      </span>
    </div>
  ) : (
    <span>{product.sell_price} جنيه</span>
  )}
</div>
       


          </div>
        </CardContent>

        {/* الوصف الطويل */}
        <CardContent
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg px-6 pb-8"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-4 md:text-right">
            الوصف
          </h2>
          <p className={alltext?"":"line-clamp-2"}>{product.description}  </p> <span onClick={()=>setalltext(!alltext)} className="cursor-pointer text-blue-600" >{alltext?"اقل":"عرض المزيد "} </span>

          {/* المواصفات الفنية */}
          {product.details && product.details.length > 0 && (
            <div className="my-6">



              
              <h1 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-300 pb-2">
                المواصفات الفنية
              </h1>
              <ul className="list-disc list-inside space-y-2">
                {product.details.map((item) => (
                  <li
                    key={item.product_detail_id}
                    className="relative px-2 py-1 border-b border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-colors duration-300"
                  >
                    {item.label}: {item.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        {/* زر أضف للسلة */}
     <AddToCartButton productId={product.product_id} />
      </Card>
    </div>
  );
}

















// import SpasificProd from '@/CallApi/SpasificProd'
// import React from 'react'

// export default async function page({params}) {
//     const {id} = await params
//     const data = await SpasificProd(id)
//     console.log(data);
//   return (
//     <div>
//       spasific product {id}
//     </div>
//   )
// }
