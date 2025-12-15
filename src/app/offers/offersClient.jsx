import Image from "next/image";
import {
  Tag,
  Clock,
  Percent,
  Zap,
  ShoppingCart,
  Heart,
  BadgePercent,
} from "lucide-react";
import ProductCard from "../_commponent/Card/ProductCard";

export default function OffersClient({ offers = [] }) {
  return (
    <section className="py-8 md:py-12" dir="rtl">
      <div className="mx-auto container  px-4 md:px-10">
        {/* العنوان الرئيسي */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              العروض و الخصومات
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              استمتع بأحدث العروض على الموبايلات، الأجهزة المنزلية، الإكسسوارات
              وأكثر – كل الأسعار بعد الخصم موضحة أمامك.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
            <Tag className="h-4 w-4" />
            عدد العروض المتاحة: {offers.length}
          </div>
        </div>

        <div className="space-y-8">
          {offers.map((item) => (
            <OfferCard
              key={item.offer.offer_id}
              offer={item.offer}
              products={item.products}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, products }) {
  const { label: statusLabel, className: statusClass } = getOfferStatusMeta(
    offer.status,
    offer.start_date,
    offer.end_date
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* هيدر العرض */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-l from-blue-50/80 via-indigo-50/70 to-sky-50/70 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            عرض خاص
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700">
            خصم حتى {offer.offer_value}%
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="text-left text-[11px] text-gray-700 md:text-xs">
          <div>من: {formatDateTime(offer.start_date)}</div>
          <div className="text-[10px] md:text-[11px]">
            حتى: {formatDateTime(offer.end_date)}
          </div>
        </div>
      </div>

      {/* المنتجات */}
      <div className="p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
          <span>عدد المنتجات في العرض: {products.length}</span>
          <span className="hidden md:inline">
            الأسعار الموضحة هي أسعار العرض بعد الخصم
          </span>
        </div>

        <div 
            className="grid grid-cols-2 gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
          {products.map((p) => {
            // ✅ نجهز المنتج علشان ProductCard يفهم إن فيه عرض
            const normalizedProduct = {
              ...p,
              product_title: p.title, // لو ProductCard بيستخدم product_title
              offer: {
                sell_value: p.offer_sell_value, // ده سعر العرض
                value: p.offer_value, // optional
              },
            };

            return (
              <ProductCard
                key={p.product_id}
                product={normalizedProduct}
                onWishlistChange={() => {}}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}

function OfferProductCard({ product, offer }) {
  const oldPrice = product.sell_price || product.price;
  const offerPrice = product.offer_sell_value || oldPrice;
  const discountPercent =
    oldPrice && offerPrice
      ? Math.round(((oldPrice - offerPrice) / oldPrice) * 100)
      : offer.offer_value;

  const installment = product.installments?.[0];

  const mainDetail = product.details?.[0];

  const isActive = product.is_active === 1;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      {/* صورة المنتج */}
      <div className="relative h-40 w-full overflow-hidden bg-white">
        {product.images?.[0]?.image_url ? (
          <Image
            src={product.images[0].image_url}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-contain p-3"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            لا توجد صورة
          </div>
        )}

        {/* بادج الخصم على الصورة */}
        <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow">
          -{discountPercent}%
        </div>

        {!isActive && (
          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-center text-[11px] font-semibold text-white">
            غير متاح حاليًا
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div className="flex flex-1 flex-col p-3">
        {/* العنوان */}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.title}
        </h3>

        {/* تفاصيل مختصرة */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
          {mainDetail?.label && mainDetail?.value && (
            <span className="rounded-full bg-white px-2 py-0.5 border border-gray-200">
              {mainDetail.label}: {mainDetail.value}
            </span>
          )}
          {product.sympol && (
            <span className="rounded-full bg-white px-2 py-0.5 border border-gray-200">
              كود: {product.sympol}
            </span>
          )}
        </div>

        {/* الأسعار */}
        <div className="mt-2 space-y-0.5 text-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-gray-500">سعر العرض</span>
            <span className="text-base font-bold text-emerald-700">
              {formatPrice(offerPrice)} جم
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-[11px] text-gray-500">السعر قبل العرض</span>
            <span className="text-gray-400 line-through">
              {formatPrice(oldPrice)} جم
            </span>
          </div>
        </div>

        {/* معلومات التقسيط إن وجدت */}
        {installment && installment.full_price > offerPrice && (
          <div className="mt-2 rounded-xl bg-purple-50 px-2 py-1.5 text-[11px] text-purple-800 border border-purple-100">
            <p className="font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3" />
              تقسيط: {installment.installment_title}
            </p>
            <p className="mt-0.5">
              إجمالي بالتقسيط:{" "}
              <span className="font-bold">
                {formatPrice(installment.full_price)} جم
              </span>
            </p>
          </div>
        )}

        {/* الأزرار */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={!isActive}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition ${
              isActive
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isActive ? "أضف للسلة" : "غير متاح"}
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------- Helpers ---------- */

function formatDateTime(dateStr) {
  if (!dateStr) return "غير محدد";
  // "2025-11-09 19:31:00" → valid ISO
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return dateStr;

  const date = d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = d.toLocaleTimeString("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${date} - ${time}`;
}

function formatPrice(val) {
  if (!val && val !== 0) return "—";
  return new Intl.NumberFormat("ar-EG").format(Math.round(val));
}

function getOfferStatusMeta(status, start, end) {
  const now = new Date();
  const startDate = start ? new Date(start.replace(" ", "T")) : null;
  const endDate = end ? new Date(end.replace(" ", "T")) : null;

  if (endDate && now > endDate) {
    return {
      label: "انتهى العرض",
      className: "bg-gray-100 text-gray-600 border border-gray-200",
    };
  }
  if (startDate && now < startDate) {
    return {
      label: "عرض قادم",
      className: "bg-sky-50 text-sky-700 border border-sky-100",
    };
  }

  switch (status) {
    case "started":
    default:
      return {
        label: "عرض ساري الآن",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      };
  }
}
