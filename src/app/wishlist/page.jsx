
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ShowWishList from "@/CartAction/ShowWishList";

// 🔹 نفس الداتا اللي بعتها بالظبط
const initialWishlist = {
  success: true,
  message: "تم جلب قائمة أمنياتك بنجاح",
  data: [
    {
      product_id: 202,
      sell_price: 27720,
      details: [
        {
          product_detail_id: 330,
          label: "العلامة التجارية",
          value: "فريش",
        },
        {
          product_detail_id: 331,
          label: "عدد الأبواب",
          value: "2 باب",
        },
        {
          product_detail_id: 332,
          label: "السعة",
          value: "426 لتر",
        },
        {
          product_detail_id: 333,
          label: "اللون",
          value: "أحمر غامق",
        },
      ],
      images: [
        {
          product_image_id: 229,
          image:
            "https://camp-coding.site/laserjet/uploads/products/1763033903695.png",
        },
      ],
      offer: null,
      installments: [
        {
          installment_id: 20,
          category_installment_id: 39,
          installment_title: "6 شهور",
          order_no: 0,
          installment_gain: 30,
          full_price: 36036,
        },
        {
          installment_id: 21,
          category_installment_id: 40,
          installment_title: "12 شهر",
          order_no: 0,
          installment_gain: 60,
          full_price: 44352,
        },
        {
          installment_id: 22,
          category_installment_id: 41,
          installment_title: "24 شهر",
          order_no: 0,
          installment_gain: 120,
          full_price: 60984,
        },
        {
          installment_id: 23,
          category_installment_id: 42,
          installment_title: "36 شهر",
          order_no: 0,
          installment_gain: 180,
          full_price: 77616,
        },
      ],
      title:
        "ثلاجة فريش، 426 لتر، نوفروست، شاشة رقمية، فلتر بلازما أيوني، موزع مياه، FNT-DR540YGDR - أحمر غامق",
      description:
        "نوع التبريد: نوفروست\r\nإضاءة LED: نعم\r\nشاشة تحكم رقمية: نعم\r\nموزع مياه: نعم\r\nفلتر بلازما أيوني: نعم\r\nصينية ثلج دوارة: نعم\r\nأرفف زجاجية مقواة: نعم\r\nاستهلاك أقل للطاقة: نعم\r\nالجهد الكهربائي: 220 – 240 فولت\r\nالأبعاد (العرض × الارتفاع × العمق): 788 × 1755 × 778 ملم",
      category: {
        title: "الاجهزة المنزلية",
        is_active: false,
      },
    },
    {
      product_id: 201,
      sell_price: 20400,
      details: [
        {
          product_detail_id: 328,
          label: "لون",
          value: "ابيض",
        },
        {
          product_detail_id: 329,
          label: "ماركة",
          value: "فريش",
        },
      ],
      images: [
        {
          product_image_id: 227,
          image:
            "https://camp-coding.site/laserjet/uploads/products/1762958104438.png",
        },
      ],
      offer: {
        offer_id: 17,
        offer_value: 4,
        sell_value: 19584,
      },
      installments: [
        {
          installment_id: 20,
          category_installment_id: 39,
          installment_title: "6 شهور",
          order_no: 0,
          installment_gain: 30,
          full_price: 26520,
        },
        {
          installment_id: 21,
          category_installment_id: 40,
          installment_title: "12 شهر",
          order_no: 0,
          installment_gain: 60,
          full_price: 32640,
        },
        {
          installment_id: 22,
          category_installment_id: 41,
          installment_title: "24 شهر",
          order_no: 0,
          installment_gain: 120,
          full_price: 44880,
        },
        {
          installment_id: 23,
          category_installment_id: 42,
          installment_title: "36 شهر",
          order_no: 0,
          installment_gain: 180,
          full_price: 57120,
        },
      ],
      title:
        "تكييف فريش تيربو، 1.5 حصان، بارد فقط، FUFW12C IW-AG - أبيض",
      description:
        "العلامة التجارية: فريش\r\nالموديل: FUFW12C/IW-AG\r\nالقدرة الحصانية: 1.5 حصان\r\nنوع التكييف: سبليت\r\nالسعة التبريدية: من 12000 إلى 18000 وحدة حرارية\r\nنظام التبريد: تبريد فقط\r\nنوع الفلتر: فلتر مضاد للغبار\r\nالموتور إنفرتر: لا\r\nتحريك الهواء أوتوماتيكي: نعم\r\nريموت كنترول: نعم\r\nمؤقت زمني (تايمر): نعم\r\nخاصية التدفئة: لا\r\nمقاوم للصدأ: لا\r\nتقنية البلازما كلاستر: لا\r\nوضع التجفيف: لا\r\nوضع التيربو: لا\r\nضاغط استوائي: لا\r\nزعانف ذهبية (Golden Fin): لا\r\nوضع التوفير ECO: لا\r\nالأبعاد (مم):\r\nالارتفاع: 200 مم\r\nالعرض: 802 مم\r\nالعمق: 295 مم\r\nالوزن: 8.6 كجم",
      category: {
        title: "الاجهزة المنزلية",
        is_active: false,
      },
    },
    {
      product_id: 200,
      sell_price: 780,
      details: [
        {
          product_detail_id: 327,
          label: "لون",
          value: "اسود",
        },
      ],
      images: [
        {
          product_image_id: 226,
          image:
            "https://camp-coding.site/laserjet/uploads/products/1762957392374.png",
        },
      ],
      offer: {
        offer_id: 21,
        offer_value: 1,
        sell_value: 772.2,
      },
      installments: [
        {
          installment_id: 20,
          category_installment_id: 43,
          installment_title: "6 شهور",
          order_no: 0,
          installment_gain: 30,
          full_price: 1014,
        },
        {
          installment_id: 21,
          category_installment_id: 67,
          installment_title: "12 شهر",
          order_no: 0,
          installment_gain: 60,
          full_price: 1248,
        },
      ],
      title: "Xiaomi Redmi Buds 6 Play - Black (Global Version)",
      description:
        "Brand: Xiaomi\r\nLong Battery Life: Up to 36 hours with the charging case.\r\nAI Noise Reduction: Ensures crystal-clear calls.\r\n10mm Dynamic Driver: Provides powerful sound quality.\r\nFast Charging: 10 minutes of charge offers up to 3 hours of playback.\r\nCustomizable EQ: Five EQ modes for personalized audio.\r\nBluetooth v5.4: low latency and high connection stability.",
      category: {
        title: "ايربودز",
        is_active: false,
      },
    },
    {
      product_id: 199,
      sell_price: 2040,
      details: [
        {
          product_detail_id: 326,
          label: "لون",
          value: "اسود",
        },
      ],
      images: [
        {
          product_image_id: 225,
          image:
            "https://camp-coding.site/laserjet/uploads/products/1762955878562.jpg",
        },
      ],
      offer: {
        offer_id: 17,
        offer_value: 4,
        sell_value: 1958.4,
      },
      installments: [
        {
          installment_id: 20,
          category_installment_id: 46,
          installment_title: "6 شهور",
          order_no: 0,
          installment_gain: 30,
          full_price: 2652,
        },
        {
          installment_id: 21,
          category_installment_id: 68,
          installment_title: "12 شهر",
          order_no: 0,
          installment_gain: 60,
          full_price: 3264,
        },
      ],
      title:
        "موزع بمنفذ USB نوع سي، محول 7 في 1 USB نوع سي، مع 4 كيه نوع C إلى HDMI، قارئ بطاقة اس دي/ميكرو اس دي، منافذ B 3.0، مع توصيل طاقة 60 وات لأجهزة ماك بوك وكروم بوك وجالكسي وغيرها من انكر - رمادي",
      description:
        "جميع المنافذ التي تحتاج إليها احصل على 2 منفذ بيانات USB نوع ايه ومنفذ شحن USB نوع C ومنفذ بيانات USB نوع C ومنفذ HDMI وفتحة بطاقة ميكرو اس دي وفتحة بطاقة اس دي قياسية واحدة - كل ذلك في موزع واحد.\r\nمتوافق مع توصيل الطاقة يدعم ما يصل إلى 100 وات (أقل من 15 وات للتشغيل) لتمرير الشحن حتى تتمكن من تشغيل ماك بوك برو 38 سم بأقصى سرعة - كل ذلك أثناء الوصول إلى الوظائف الأخرى للموزع. (المنتج غير متضمن الشاحن)\r\nشاشة فائقة الوضوح، لا تضيع الوقت في التبديل ذهابًا وإيابًا بين البرامج أو المستندات. ما عليك سوى توصيله بشاشة خارجية عبر منفذ HDMI بدقة 4K لتجربة أسهل وأكثر إنتاجية. ملاحظة: العلامات التجارية المعتمدة HDMI وواجهة الوسائط المتعددة عالية الدقة HD وشعار HDMI هي علامات تجارية أو علامات تجارية مسجلة لشركة HDMI Licensing Administrator، Inc في الولايات المتحدة ودول أخرى.\r\nانقل الملفات في ثوانٍ، يمكنك نقل الأفلام والصور والموسيقى بسرعات تصل إلى 5 جيجابايت في الثانية عبر منفذ بيانات USB نوع سي ومنافذ USB نوع ايه المزدوجة.\r\nمحتويات العبوة: محور موزع USB بنوع سي ممتاز 7 في 1 من انكور، شنطة سفر، دليل ترحيبي.\r\nتوافق شامل مع بطاقة SD، تدعم منافذ بطاقة SD وبطاقة ذاكرة ميكرو اس دي كافة تنسيقات بطاقة SD فعليًا للاستمتاع بتجربة وصول سلسلة إلى الصور وملفات الوسائط الأخرى.",
      category: {
        title: "لاب توب واكسسوارات الكمبيوتر",
        is_active: false,
      },
    },
  ],
};

// تنسيق السعر
const formatPrice = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(value);

// استخراج الماركة من details (العلامة التجارية / ماركة)
const getBrand = (item) => {
  const brandDetail =
    item.details?.find(
      (d) =>
        d.label === "العلامة التجارية" ||
        d.label === "ماركة" ||
        d.label.toLowerCase().includes("brand")
    ) || null;

  return brandDetail ? brandDetail.value : "غير محدد";
};

export default function WishlistPage() {
  const [items, setItems] = useState(initialWishlist.data || []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [hasOfferOnly, setHasOfferOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended"); // recommended | price-asc | price-desc | offer-first

  // الفئات المتاحة
  const categories = useMemo(() => {
    const setCat = new Set();
    items.forEach((item) => {
      if (item.category?.title) setCat.add(item.category.title);
    });
    return Array.from(setCat);
  }, [items]);

  // الماركات المتاحة
  const brands = useMemo(() => {
    const setBrand = new Set();
    items.forEach((item) => {
      const b = getBrand(item);
      if (b) setBrand.add(b);
    });
    return Array.from(setBrand);
  }, [items]);

  // تطبيق الفلترة + الترتيب
  const filteredItems = useMemo(() => {
    let result = [...items];

    // بحث بالنص
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((item) => {
        const inTitle = item.title?.toLowerCase().includes(q);
        const inCat = item.category?.title?.toLowerCase().includes(q);
        const inDetails = item.details?.some((d) =>
          `${d.label} ${d.value}`.toLowerCase().includes(q)
        );
        return inTitle || inCat || inDetails;
      });
    }

    // فلترة حسب الفئة
    if (categoryFilter !== "all") {
      result = result.filter(
        (item) => item.category?.title === categoryFilter
      );
    }

    // فلترة حسب الماركة
    if (brandFilter !== "all") {
      result = result.filter((item) => getBrand(item) === brandFilter);
    }

    // فلترة المنتجات اللي عليها عروض فقط
    if (hasOfferOnly) {
      result = result.filter((item) => !!item.offer);
    }

    // الترتيب
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const pa = a.offer?.sell_value ?? a.sell_price;
        const pb = b.offer?.sell_value ?? b.sell_price;
        return pa - pb;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const pa = a.offer?.sell_value ?? a.sell_price;
        const pb = b.offer?.sell_value ?? b.sell_price;
        return pb - pa;
      });
    } else if (sortBy === "offer-first") {
      result.sort((a, b) => {
        const aHas = a.offer ? 1 : 0;
        const bHas = b.offer ? 1 : 0;
        return bHas - aHas;
      });
    }

    return result;
  }, [items, search, categoryFilter, brandFilter, hasOfferOnly, sortBy]);

  // إجمالي قيمة قائمة الأمنيات (بعد الخصم لو فيه)
  const totalWishlist = useMemo(
    () =>
      filteredItems.reduce((sum, item) => {
        const price = item.offer?.sell_value ?? item.sell_price;
        return sum + price;
      }, 0),
    [filteredItems]
  );

  // Placeholder: إزالة من الأمنيات
  const handleRemove = (id) => {
    // هنا تربط بالـ API (DELETE /wishlist/:id مثلا)
    setItems((prev) => prev.filter((p) => p.product_id !== id));
  };

  // Placeholder: إضافة للسلة
  const handleAddToCart = (item) => {
    // هنا تندمج مع API السلة
    console.log("Add to cart:", item.product_id);
    alert("تم إضافة المنتج إلى السلة (تجريبيًا) 👍");
  };

async function GetDataInwishList() {
  const data= await ShowWishList()
  console.log(data);
}



useEffect(() => {
  GetDataInwishList()
})


  return (
    <main
      dir="rtl"
      className="mx-auto max-w-6xl px-4 py-8 space-y-6 lg:space-y-8"
    >
      {/* الهيدر + ملخص بسيط */}
      <header className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            قائمة الأمنيات
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {items.length === 0
              ? "قائمة الأمنيات فارغة حاليًا."
              : `لديك ${items.length} منتج في قائمة الأمنيات، يتم عرض ${filteredItems.length} منها حسب الفلاتر.`}
          </p>
        </div>

        {filteredItems.length > 0 && (
          <div className="rounded-2xl bg-gray-50 px-4 py-2 text-xs text-gray-700">
            إجمالي قيمة العناصر المعروضة:{" "}
            <span className="font-semibold">
              {formatPrice(totalWishlist)}
            </span>
          </div>
        )}
      </header>

      {/* منطقة الفلترة */}
      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* البحث */}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              البحث
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم المنتج، الفئة، المواصفات..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* الترتيب */}
          <div className="w-full md:w-56">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              ترتيب حسب
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="recommended">الافتراضي (الأفضل لك)</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="offer-first">الأولوية للمنتجات المخفّضة</option>
            </select>
          </div>
        </div>

        {/* باقي الفلاتر */}
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-3 text-xs">
          {/* فئة */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">الفئة:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* الماركة */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600">الماركة:</span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* عروض فقط */}
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-50 px-3 py-1">
            <input
              type="checkbox"
              checked={hasOfferOnly}
              onChange={(e) => setHasOfferOnly(e.target.checked)}
              className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">منتجات عليها عروض فقط</span>
          </label>
        </div>
      </section>

      {/* شبكة المنتجات */}
      <section>
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            لا توجد نتائج مطابقة للفلاتر الحالية.
            <br />
            <button
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
                setBrandFilter("all");
                setHasOfferOnly(false);
                setSortBy("recommended");
              }}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const mainImage = item.images?.[0]?.image;
              const brand = getBrand(item);
              const price = item.sell_price;
              const offerPrice = item.offer?.sell_value ?? null;
              const discountPercent = item.offer?.offer_value ?? null;

              // أسهل خطة تقسيط (أطول مدة = أقل قسط تقريبًا)
              const bestInstallment =
                item.installments &&
                [...item.installments].reverse()[0]; // آخر واحدة غالبًا أطول فترة

              let monthly = null;
              if (bestInstallment) {
                const match = bestInstallment.installment_title.match(/\d+/);
                const months = match ? parseInt(match[0], 10) : null;
                if (months && months > 0) {
                  monthly = bestInstallment.full_price / months;
                }
              }

              return (
                <div
                  key={item.product_id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* صورة */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                    {mainImage && (
                      <Image
                        src={mainImage}
                        alt={item.title}
                        fill
                        className="object-contain p-4 transition group-hover:scale-[1.03]"
                      />
                    )}
                    {discountPercent && (
                      <div className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                        خصم %{discountPercent}
                      </div>
                    )}
                  </div>

                  {/* محتوى الكارت */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h2 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
                        {item.title}
                      </h2>
                      <p className="mb-1 text-[11px] text-gray-500">
                        {item.category?.title}
                        {brand && ` • ${brand}`}
                      </p>

                      {/* تفاصيل سريعة */}
                      {item.details && item.details.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-gray-600">
                          {item.details.slice(0, 3).map((d) => (
                            <span
                              key={d.product_detail_id}
                              className="rounded-full bg-gray-50 px-2 py-0.5"
                            >
                              {d.label}: {d.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* أسعار + تقسيط + أكشن */}
                    <div className="mt-3 space-y-3">
                      {/* الأسعار */}
                      <div className="flex flex-wrap items-baseline gap-2">
                        {offerPrice && (
                          <span className="text-base font-bold text-emerald-600">
                            {formatPrice(offerPrice)}
                          </span>
                        )}
                        <span
                          className={
                            offerPrice
                              ? "text-xs text-gray-400 line-through"
                              : "text-base font-semibold text-gray-900"
                          }
                        >
                          {formatPrice(price)}
                        </span>
                      </div>

                      {/* التقسيط */}
                      {bestInstallment && monthly && (
                        <p className="text-[11px] text-blue-700">
                          متوفر تقسيط حتى{" "}
                          <span className="font-semibold">
                            {bestInstallment.installment_title}
                          </span>{" "}
                          — تقريبًا{" "}
                          <span className="font-semibold">
                            {formatPrice(monthly)}
                          </span>{" "}
                          / شهر
                        </p>
                      )}

                      {/* الأزرار */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                          إضافة إلى السلة
                        </button>
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          className="rounded-full border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          إزالة
                        </button>
                      </div>

                      {/* رابط تفاصيل (لو عندك صفحة منتج) */}
                      <Link
                        href={`/products/${item.product_id}`}
                        className="mt-1 block text-[11px] text-blue-600 hover:underline"
                      >
                        عرض تفاصيل المنتج
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}



