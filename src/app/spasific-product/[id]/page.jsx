"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  ChevronRight,
  Heart,
  Package,
  Truck,
  Shield,
  Check,
  Star,
  BadgeCheck,
  Layers,
  CreditCard,
  ChevronLeft,
  ShareIcon,
  Share,
  Share2,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import AddToWishList from "../../../CartAction/AddToWishList";
import ShowWishList from "../../../CartAction/ShowWishList";
import { toast } from "sonner";
import useProductData from "../../../../hooks/useGetProductData";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import AddToCartButton from "./../../_commponent/CartButton";
import RecommendedProductsSwiper from "../../_commponent/RecommendedProductsSwiper";

export default function ProductDetailsPage() {
  const [isFav, setIsFav] = useState(false);
  const [allText, setAllText] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null); // ✅ Swiper الرئيسي
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 }); // ✅ لتحديد نقطة الزوم حسب حركة الماوس

  const { id } = useParams();

  const { prodData, loading, error, fetchProdData } = useProductData(id);
  const product = prodData?.products?.[0] || null;
  console.log(product, "product");
  async function HandleTowishlist(product_id) {
    try {
      const data = await AddToWishList(product_id);
      if (data.success) {
        const wishData = await ShowWishList();
        const wishItems = wishData?.data || [];
        setIsFav(wishItems.some((w) => w.product_id === product_id));
        toast.success(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ، حاول مرة أخرى");
    }
  }

  useEffect(() => {
    fetchProdData();
  }, [id]);

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  // ✅ لو لسه بيحمل أو مفيش product
  if (!product || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4" />
          <p className="text-gray-600 text-lg font-semibold">
            جاري تحميل المنتج...
          </p>
        </div>
      </div>
    );
  }

  // ✅ تجهيز بيانات مساعدة
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          {
            product_image_id: 0,
            image_url: "/placeholder-product.png",
          },
        ];

  const hasOffer = product.offer && product.offer.sell_value;
  const basePrice = Number(product.sell_price || product.price || 0);
  const offerPrice = hasOffer ? Number(product.offer.sell_value) : basePrice;
  const savedAmount = hasOffer ? basePrice - offerPrice : 0;
  const inStock = product.quantity > 0;
  const mainInstallment = product.installments?.[0];

  const formatPrice = (value) => {
    const num = Number(value || 0);
    if (Number.isNaN(num)) return value;
    return num.toLocaleString("ar-EG") + " جنيه";
  };

  const isFavourite = isFav || !!product.isInWishlist;

  const shortDescription =
    product.description && product.description.length > 120
      ? product.description.slice(0, 120) + "..."
      : product.description;

  // ✅ هندل الزوم: نحسب موضع الماوس داخل الصورة كنسبة مئوية
  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleZoomLeave = () => {
    setZoomPos({ x: 50, y: 50 });
  };

  return (
    <div className="bg-slate-50 py-8">
      <div className="lg:container mx-auto    px-4 xl:px-10  space-y-7">
        {/* ✅ Breadcrumb */}
        <div
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
          data-aos="fade-up"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link
            href={`/category/${product.category_id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {product.category?.title || "التصنيف"}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-slate-700 font-medium truncate">
            {product.title}
          </span>
        </div>

        {/* ✅ Main Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 container">
          {/* 🎯 الصور (Swiper + Thumbs) */}
          <Card
            className="shadow-sm border-slate-100 bg-white"
            data-aos="fade-left"
          >
            <CardContent className="p-4">
              {/* Main Swiper */}
              <div className="grid grid-cols-1 gap-2 w-full">
                <Swiper
                  modules={[Navigation, Pagination, Thumbs, FreeMode]}
                  navigation
                  pagination={{ clickable: true }}
                  onSwiper={setMainSwiper} // ✅ نمسك الـ instance
                  thumbs={
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? { swiper: thumbsSwiper }
                      : undefined
                  }
                  spaceBetween={10}
                  className="rounded-2xl overflow-hidden mb-4 w-full"
                >
                  {images.map((img) => (
                    <SwiperSlide key={img.product_image_id}>
                      {/* ✅ Zoom Wrapper */}
                      <div
                        className="group relative w-full aspect-square bg-slate-100 flex items-center justify-center overflow-hidden"
                        onMouseMove={handleZoomMove}
                        onMouseLeave={handleZoomLeave}
                      >
                        <img
                          src={img.image_url}
                          alt={product.title}
                          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-150"
                          style={{
                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbs Swiper */}
              <div className="grid grid-cols-1 gap-2 w-full">
                {images.length > 1 && (
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[FreeMode, Thumbs]}
                    spaceBetween={8}
                    slidesPerView={4}
                    freeMode
                    watchSlidesProgress
                    className="thumbs-swiper w-full"
                  >
                    {images.map((img, index) => (
                      <SwiperSlide key={`thumb-${img.product_image_id}`}>
                        <div
                          className="relative w-full aspect-square border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
                          onClick={() => mainSwiper?.slideTo(index)} // ✅ التحريك للصورة المطلوبة
                        >
                          <img
                            src={img.image_url}
                            alt={product.title}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 🧾 معلومات المنتج */}
          <div
            className="space-y-4  col-span-1 lg:col-span-2"
            data-aos="fade-right"
          >
            <Card className="shadow-sm border-slate-100 bg-white py-5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {product.category?.title && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium">
                        <Layers className="w-3 h-3 ms-1" />
                        {product.category.title}
                      </span>
                    )}
                    {product.sympol && (
                      <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-700 px-3 py-1 text-xs font-medium">
                        كود المنتج: {product.sympol}
                      </span>
                    )}
                    {inStock ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium">
                        <BadgeCheck className="w-3 h-3 ms-1" />
                        متوفر في المخزون
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-3 py-1 text-xs font-medium">
                        غير متوفر حالياً
                      </span>
                    )}
                  </div>

                  {/* Wishlist Icon */}
                  <button
                    type="button"
                    onClick={() => HandleTowishlist(product.product_id)}
                    className="p-2 rounded-full border border-slate-200 hover:border-rose-400 hover:bg-rose-50 transition-colors"
                    aria-label="إضافة للمفضلة"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavourite ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>
                </div>

                <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {product.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* ⭐ تقييم بسيط */}
                {/* <div className="flex items-center gap-2 text-sm text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-slate-400">(مراجعات العملاء)</span>
                </div> */}

                {/* 💰 السعر */}
                <div className="space-y-1">
                  {hasOffer ? (
                    <>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-2xl font-extrabold text-rose-600">
                          {formatPrice(offerPrice)}
                        </span>
                        <span className="text-sm line-through text-slate-400">
                          {formatPrice(basePrice)}
                        </span>
                        {savedAmount > 0 && (
                          <span className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-3 py-1">
                            وفر {formatPrice(savedAmount)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-rose-500">
                        عرض خاص لفترة محدودة
                      </p>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatPrice(basePrice)}
                    </span>
                  )}
                </div>

                {/* 📝 الوصف */}
                {product.description && (
                  <div className="space-y-1 text-sm text-slate-700 leading-relaxed">
                    <h3 className="font-semibold text-slate-900">وصف المنتج</h3>
                    <p>
                      {allText ? product.description : shortDescription}
                      {product.description.length > 120 && (
                        <button
                          type="button"
                          onClick={() => setAllText((p) => !p)}
                          className="ms-1 cursor-pointer text-blue-600 font-semibold hover:underline text-xs"
                        >
                          {allText ? "إخفاء" : "عرض المزيد"}
                        </button>
                      )}
                    </p>
                  </div>
                )}

                {/* 🔍 تفاصيل سريعة */}
                {product.details && product.details.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      المواصفات
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.details.map((d) => (
                        <span
                          key={d.product_detail_id}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs text-slate-700"
                        >
                          <Check className="w-3 h-3 text-emerald-500" />
                          {d.label}: {d.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 💳 التقسيط */}
                {mainInstallment && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-3 py-3 flex items-start gap-3 text-xs sm:text-sm">
                    <div className="mt-0.5">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-blue-900">
                        متاح بالتقسيط مع Laserjet
                      </p>
                      <p className="text-blue-900/80">
                        إجمالي السعر بعد التقسيط:{" "}
                        <span className="font-bold">
                          {formatPrice(mainInstallment.full_price)}
                        </span>
                      </p>
                      {mainInstallment.installment_gain > 0 && (
                        <p className="text-blue-900/70">
                          مصاريف إضافية:{" "}
                          {formatPrice(mainInstallment.installment_gain)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 🛒 الأزرار */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div>
                    <AddToCartButton
                      product={product}
                      inCart={prodData.inCart}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => HandleTowishlist(product.product_id)}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-rose-400 hover:bg-rose-50 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavourite ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                    {isFavourite ? "في المفضلة" : "أضف للمفضلة"}
                  </button>
                  <button
                    type="button"
                    onClick={() => HandleTowishlist(product.product_id)}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-blue-700 hover:border-blue-400 hover:bg-rose-50 transition-colors"
                  >
                    <Share2 className={`w-4 h-4`} />
                    مشاركة
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 🔐 مزايا الشراء */}
            <Card
              className="shadow-sm border-slate-100 bg-gradient-to-l from-slate-50 to-white"
              data-aos="fade-up"
            >
              <CardContent className="p-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-emerald-50">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-slate-900">
                      ضمان على المنتج
                    </p>
                    <p className="text-slate-500">
                      منتجات أصلية لضمان أفضل أداء لطابعتك.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-slate-900">
                      شحن سريع لكافة المحافظات
                    </p>
                    <p className="text-slate-500">
                      شحن آمن ومتابعة لحالة الطلب حتى الاستلام.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-amber-50">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-slate-900">
                      تغليف محمي بعناية
                    </p>
                    <p className="text-slate-500">
                      نحافظ على المنتج من أي كسر أو تلف أثناء النقل.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-violet-50">
                    <CreditCard className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-slate-900">طرق دفع مرنة</p>
                    <p className="text-slate-500">
                      كاش، تحويل بنكي، وطرق دفع إلكترونية متعددة.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RecommendedProductsSwiper categoryId={product.category_id} />
    </div>
  );
}
