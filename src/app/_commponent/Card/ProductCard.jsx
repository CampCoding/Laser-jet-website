"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  AddToCartButton,
}) {
  return (
    <Card
      className="relative group overflow-hidden border border-gray-100 shadow-md rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all"
      data-aos="zoom-in-up"
    >
      {/* زر القلب */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(product.product_id);
        }}
        className={`absolute top-4 right-4 z-10 transition-all duration-300 cursor-pointer backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 group
          `}
      >
        <Heart
          fill={isFavorite ? "red" : "none"}
          className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* محتوى الكارد */}
      <Link
        href={{
          pathname: `/spasific-product/${product.product_id}`,
          query: { data: JSON.stringify(product) },
        }}
      >
        <CardHeader className="p-4 flex flex-col w-full items-center cursor-pointer">
          <CardTitle>
            <div className="relative w-full h-[180px] mb-4 rounded-xl shadow-inner transition-all">
              <Image
                src={product.images[0].image_url}
                fill
                alt={product.description}
                className="object-cover group-hover:scale-110 transition-all"
              />
            </div>
          </CardTitle>

          <h1 className="font-bold line-clamp-1 text-md text-gray-800 text-center mb-2 group-hover:text-orange-600 transition-colors">
            {product.product_title}
          </h1>

          <CardDescription className="text-gray-500 text-center text-[13px] line-clamp-2 font-medium">
            {product.product_description}
          </CardDescription>
        </CardHeader>
      </Link>

      <CardContent className="p-4 flex justify-between items-center border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-1 text-yellow-400">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span className="text-gray-700">0.0</span>
        </div>

        <p className="text-lg font-semibold text-orange-600">
          {product.price} <span className="text-sm text-gray-600">جنيه</span>
        </p>
      </CardContent>

      <div className="px-4 pb-4">
        <AddToCartButton product={product} />
      </div>
    </Card>
  );
}
