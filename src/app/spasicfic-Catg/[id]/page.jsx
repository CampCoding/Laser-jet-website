"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Heart, Star, Search } from "lucide-react";
import "aos/dist/aos.css";
import AOS from "aos";
import Container from "../../_commponent/utils/Container";
import { Button } from "../../../components/ui/button";
import AddToCartButton from "../../_commponent/CartButton";

export default function Page() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const products = [
    {
      id: 1,
      title: "Home Appliance Deluxe",
      image: "/image_mrJAiGHB_1732459023323_raw.jpg",
      description: "جهاز منزلي متعدد الاستخدامات عالي الجودة.",
      price: 1200,
    },
    {
      id: 2,
      title: "Oppo Reno2F",
      image: "/image_mrJAiGHB_1732459023323_raw.jpg",
      description: "هاتف ذكي بشاشة عالية الدقة وكاميرا ممتازة.",
      price: 3500,
    },
    {
      id: 3,
      title: "Laptop Pro 14",
      image: "/image_mrJAiGHB_1732459023323_raw.jpg",
      description: "كمبيوتر محمول خفيف وسريع لأداء الأعمال اليومية.",
      price: 5500,
    },
    {
      id: 4,
      title: "Modern Sofa Set",
      image: "/image_mrJAiGHB_1732459023323_raw.jpg",
      description: "أثاث منزلي عصري ومريح للجلوس.",
      price: 2500,
    },
    {
      id: 5,
      title: "Summer T-Shirt",
      image: "/image_mrJAiGHB_1732459023323_raw.jpg",
      description: "ملابس صيفية خفيفة ومريحة.",
      price: 500,
    },
  ];

  // 🔍 Filter products by search term (title + description)
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    const q = searchTerm.toLowerCase();

    return products.filter((product) => {
      const title = product.title.toLowerCase();
      const desc = product.description.toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [searchTerm, products]);

  return (
    <Container>
      {/* Header + search bar */}
      <div className="flex flex-col gap-4 my-10 md:my-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-600 animate-underline">
            {name}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            عدد المنتجات:{" "}
            <span className="font-semibold">{filteredProducts.length}</span>
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن منتج بالاسم أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-9 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Empty state if no results */}
      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-500 text-sm md:text-base">
            لا توجد منتجات مطابقة لبحثك حاليًا.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
          <Card
          key={product.id}
          className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          data-aos="fade-up"
        >
          {/* Badge */}
         
        
          {/* Favorite */}
          <button
            type="button"
            className="absolute left-4 top-4 z-10 rounded-full bg-white/80 p-1.5 shadow-sm transition hover:bg-white"
          >
            <Heart className="h-5 w-5 text-red-500 transition group-hover:scale-110" />
          </button>
        
          <CardHeader className="flex flex-col items-center p-4">
            <CardTitle className="w-full">
              <div className="relative mb-4 h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-50 to-slate-100 shadow-md">
                <Image
                  src={product.image}
                  fill
                  alt={product.description}
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </CardTitle>
        
            <CardDescription className="w-full">
              <h1 className="mb-1 text-center text-lg font-semibold text-gray-900 line-clamp-1">
                {product.title}
              </h1>
            </CardDescription>
        
            <CardDescription className="w-full text-center text-sm text-gray-600 line-clamp-2">
              {product.description}
            </CardDescription>
          </CardHeader>
        
          <CardContent className="mt-auto flex flex-col gap-3 border-t border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>0.0</span>
                <span className="text-[11px] text-gray-400">(لا توجد مراجعات)</span>
              </div>
        
              <div className="text-right">
                <p className="text-xs text-gray-400">السعر</p>
                <p className="text-xl font-bold text-blue-600">
                  {product.price.toLocaleString("en-EG")}{" "}
                  <span className="text-xs font-medium text-gray-500">EGP</span>
                </p>
              </div>
            </div>
        
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                متوفر الآن
              </span>
        
              <AddToCartButton />
            </div>
          </CardContent>
        </Card>
        
          ))}
        </div>
      )}
    </Container>
  );
}
