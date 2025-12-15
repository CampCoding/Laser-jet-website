"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AddToCartButton from "../CartButton";
import { useEffect, useState } from "react";
import AddToWishList from "../../../CartAction/AddToWishList";
import { toast } from "sonner";

export default function ProductCard({ product, onWishlistChange = () => {} }) {
  const [inFav, setInFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // ✅ حالة المفضلة الأولية من الـ API
  useEffect(() => {
    setInFav(product?.isInWishlist === 1 || product?.isInWishlist === true);
  }, [product]);

  // ✅ إضافة / إزالة من المفضلة
  async function handleToWishlist() {
    if (favLoading) return;
    setFavLoading(true);

    try {
      const data = await AddToWishList(product?.product_id);

      if (data?.success) {
        toast.success("تم إضافة المنتج للمفضلة بنجاح", {
          duration: 5000,
          position: "top-center",
        });
        setInFav((prev) => !prev);
        onWishlistChange();
      } else {
        toast.error(data?.message || "حدث خطأ أثناء تحديث المفضلة");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحديث المفضلة");
    } finally {
      setFavLoading(false);
    }
  }

  // 🔹 الصورة الرئيسية
  const mainImage = product?.images?.[0]?.image_url || null;

  // 🔹 بيانات العرض
  const priceNumber = Number(product?.sell_price) || 0;
  const offerData = product?.offer || null;

  const hasOffer =
    offerData?.sell_value &&
    Number(offerData.sell_value) > 0 &&
    Number(offerData.sell_value) < priceNumber;

  const originalPrice = priceNumber;
  const offerPrice = hasOffer ? Number(offerData.sell_value) : originalPrice;

  const discountPercent =
    hasOffer && originalPrice > 0
      ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
      : null;

  // 🔹 حالة السلة (تمريرها للزر)
  const inCart =
    product?.isInCart === 1 ||
    product?.isInCart === true ||
    product?.in_cart == 1 ||
    product?.in_cart == true;

  return (
    <Card
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white/80 shadow-md backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
      dir="rtl"
    >
      {/* 🔴 Badge العرض */}
      {hasOffer && (
        <div className="absolute left-0 top-3 z-10 rounded-r-full bg-red-500/95 px-3 py-1 text-[11px] font-bold text-white shadow-md">
          عرض خاص {discountPercent ? `- ${discountPercent}%` : ""}
        </div>
      )}

      {/* زر القلب */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToWishlist();
        }}
        disabled={favLoading}
        aria-pressed={inFav}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 p-0.5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-60"
      >
        <Heart
          className={`h-5 w-5 transition-transform duration-300 ${
            inFav
              ? "fill-red-500 text-red-500"
              : "text-gray-600 group-hover:scale-110"
          }`}
        />
      </button>

      {/* محتوى الكارد */}
      <Link
        href={{
          pathname: `/spasific-product/${product.product_id}`,
        }}
        className="flex-1"
      >
        <CardHeader className="flex w-full flex-col items-stretch p-3 sm:p-4 cursor-pointer">
          <CardTitle className="w-full">
            <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl shadow-inner transition-all sm:h-44 md:h-48 lg:h-52 bg-slate-50">
              {mainImage ? (
                <Image
                  src={mainImage}
                  fill
                  alt={
                    product?.description ||
                    product?.product_title ||
                    "صورة المنتج"
                  }
                  className="object-cover  bg-linear-to-bl from-white to-blue-100 transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  لا توجد صورة متاحة
                </div>
              )}
            </div>
          </CardTitle>

          <h1 className="mb-1 line-clamp-1 text-right text-xs font-bold text-gray-800 transition-colors group-hover:text-orange-600 sm:text-sm md:text-base">
            {product?.product_title || product?.title || "منتج بدون عنوان"}
          </h1>

          <CardDescription className="line-clamp-2 text-right text-[11px] font-medium text-gray-500 sm:text-xs md:text-sm">
            {product?.product_description ||
              product?.description ||
              "لا يوجد وصف متاح لهذا المنتج حالياً."}
          </CardDescription>
        </CardHeader>
      </Link>

      {/* السعر */}
      <CardContent className="mt-auto flex items-center justify-between border-t border-gray-100 px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex flex-col items-end gap-0.5">
          {/* السعر الحالي */}
          <p className="text-sm font-semibold text-orange-600 sm:text-base md:text-lg">
            {offerPrice.toLocaleString("ar-EG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            <span className="text-[11px] text-gray-600 sm:text-xs md:text-sm">
              جنيه
            </span>
          </p>

          {/* السعر القديم لو فيه عرض */}
          {hasOffer && (
            <p className="text-[11px] text-gray-400 line-through sm:text-xs">
              {originalPrice.toLocaleString("ar-EG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-[10px]">جنيه</span>
            </p>
          )}
        </div>
      </CardContent>

      {/* زر إضافة للسلة */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="w-full">
          <AddToCartButton product={product} inCart={inCart} />
        </div>
      </div>
    </Card>
  );
}
