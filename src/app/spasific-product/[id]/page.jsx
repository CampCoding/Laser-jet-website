"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ChevronRight, Heart, Package, Truck, Shield, Check, Star } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import SpasificProd from "@/CallApi/SpasificProd";
import AddToCartButton from "../../_commponent/CartButton";
import AddToWishList from "../../../CartAction/AddToWishList";
import ShowWishList from "../../../CartAction/ShowWishList";
import { toast } from "sonner";

export default function ProductDetailsPage() {
const [isFav, setIsFav] = useState(false);
const [product, setProduct] = useState(null);
const { id } = useParams();
const [alltext, setAlltext] = useState(false);

async function GetSpasificdata(id) {
const data = await SpasificProd(id);
if (data.message === "تم جلب المنتج بنجاح") {
const prod = data.data.products[0];
setProduct(prod);


  const wishData = await ShowWishList();
  const wishItems = wishData?.data || [];
  setIsFav(wishItems.some(w => w.product_id === prod.product_id));
}


}

async function HandleTowishlist(product_id) {
try {
const data = await AddToWishList(product_id);
if (data.success) {
const wishData = await ShowWishList();
const wishItems = wishData?.data || [];
setIsFav(wishItems.some(w => w.product_id === product_id));
toast.success(data.message);
}
} catch (error) {
console.error(error);
toast.error("حدث خطأ، حاول مرة أخرى");
}
}

useEffect(() => { GetSpasificdata(id); }, [id]);
useEffect(() => { AOS.init({ duration: 900, easing: "ease-out-cubic", once: true }); }, []);

if (!product) return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50"> <div className="text-center"> <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mb-4"></div> <p className="text-gray-600 text-xl font-semibold">جاري تحميل المنتج...</p> </div> </div>
);

return ( <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 md:py-12"> <div className="w-full md:container mx-auto px-4 sm:px-6 lg:px-8">


    {/* Breadcrumb */}
    <div data-aos="fade-down" className="mb-6">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all group bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md">
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        <span className="text-sm font-medium">العودة للرئيسية</span>
      </Link>
    </div>

    <Card data-aos="fade-up" className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 tracking-wide py-6">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
          <Package className="w-8 h-8" />
          تفاصيل المنتج
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-10">
        {/* Image Section */}
        <div className="flex flex-col items-center justify-center" data-aos="fade-right">
          <div className="relative w-full h-full">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-50 to-gray-100">
              {product.offer?.offer_value && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold z-20 shadow-lg animate-pulse">
                  خصم {product.offer.offer_value}%
                </div>
              )}
              <button
                onClick={() => HandleTowishlist(product.product_id)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-20 group"
              >
                <Heart className={`w-6 h-6 ${isFav ? "fill-red-500 text-red-500" : "text-gray-600"} group-hover:scale-110 transition-transform`} />
              </button>
              <Image src={product.images?.[0]?.image_url} alt={product.title} fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-6" data-aos="fade-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="text-gray-600 text-sm font-medium">(248 تقييم)</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">متوفر</span>
          </div>

          {/* Price */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
            {product.offer?.sell_value ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <p className="text-2xl line-through text-gray-500">{product.sell_price} جنيه</p>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                    وفر {product.sell_price - product.offer.sell_value} جنيه
                  </span>
                </div>
                <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {product.offer.sell_value} جنيه
                </p>
              </div>
            ) : (
              <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 tracking-wide">
                {product.sell_price} جنيه
              </p>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:shadow-lg transition-all cursor-pointer group">
              <Truck className="w-7 h-7 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-center font-medium text-gray-700">شحن سريع</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:shadow-lg transition-all cursor-pointer group">
              <Shield className="w-7 h-7 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-center font-medium text-gray-700">ضمان أصلي</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:shadow-lg transition-all cursor-pointer group">
              <Check className="w-7 h-7 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-center font-medium text-gray-700">جودة عالية</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">الوصف</h3>
            <p className={`text-gray-700 text-base leading-relaxed ${!alltext && 'line-clamp-3'}`}>{product.description}</p>
            <button
              onClick={() => setAlltext(!alltext)}
              className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group"
            >
              {alltext ? "عرض أقل" : "عرض المزيد"}
              <ChevronRight className={`w-4 h-4 transition-transform ${alltext ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </div>

          {/* Add to Cart */}
         <div className="w-1/3">
           <AddToCartButton product={product} />
         </div>
        </div>
      </CardContent>

      {/* Technical Specifications */}
      {product.details?.length > 0 && (
        <CardContent className="px-6 md:px-10 pb-8" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-100 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">المواصفات الفنية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.details.map((item) => (
                <div key={item.product_detail_id} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
                  <div className="flex-1">
                    <span className="font-bold text-blue-700">{item.label}:</span>
                    <span className="text-gray-700 mr-2">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  </div>
</div>


);
}
