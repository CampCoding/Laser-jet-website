
// app/cart/page.jsx
import Image from "next/image";
import Link from "next/link";

// helper لتنسيق السعر
const formatPrice = (value) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(value);

// 👇 عدّل الفنكشن دي حسب الـ API الحقيقي عندك
async function getCart() {
  // مثال استدعاء حقيقي:
  // const res = await fetch("https://camp-coding.site/laserjet/api/cart", {
  //   cache: "no-store",
  // });
  // if (!res.ok) throw new Error("فشل في جلب السلة");
  // return res.json();

  // مؤقتًا: نفس الداتا اللي بعتها (لو حابب تجربها مباشرة)
  return {
    success: true,
    message: "تم جلب سلة تسوقك بنجاح",
    data: [
      {
        product_id: 175,
        quantity: 1,
        sell_price: 1980,
        details: [
          {
            product_detail_id: 281,
            label: "لون",
            value: "اسود",
          },
        ],
        images:
          "https://camp-coding.site/laserjet/uploads/products/1762883330028.jpg",
        offer: {
          offer_id: 17,
          offer_value: 4,
          sell_value: 1900.8,
        },
        installments: [
          // .. نفس بيانات الأقساط اللي عندك
        ],
        title: "خلاط مع 2 مطحنة",
        description:
          "• دورق + 2 مطحنة شفرة من الأستانلس ستيل\r\n•220 - 240 فولت 50 / 60 هرتز .\r\n• تقطيع خضار و فواكه .\r\n• محطنة سكر\r\n• مطحنة توابل\r\n• جسم بلاستك قوى أنسيابي",
        category: {
          title: "الاجهزة المنزلية",
          is_active: false,
        },
        total_price: 1980,
      },
      {
        product_id: 187,
        quantity: 1,
        sell_price: 22277.8,
        details: [
          { product_detail_id: 307, label: "مساحه", value: "256" },
          { product_detail_id: 308, label: "رامات", value: "12" },
          { product_detail_id: 309, label: "لون", value: "ابيض" },
        ],
        images:
          "https://camp-coding.site/laserjet/uploads/products/1762880050417.png",
        offer: {
          offer_id: 16,
          offer_value: 16.5,
          sell_value: 18601.963,
        },
        installments: [
          // .. نفس بيانات الأقساط اللي عندك هنا برضه
        ],
        title:
          "Oppo Reno14 F 5G - 256GB/12GB - Opal Blue (صنع في مصر)",
        description:
          "Brand: Oppo\r\nFrequency Band:\r\n2G GSM: 850/900/1800/1900MHz\r\n...",
        category: {
          title: "الهواتف الذكية - صنع في مصر",
          is_active: false,
        },
        total_price: 22277.8,
      },
    ],
  };
}

export default async function CartPage() {
  const cart = await getCart();
  const items = cart.data || [];

  // إجمالي قبل الخصم (من sell_price)
  const subtotal = items.reduce((sum, item) => {
    const unit = item.sell_price;
    return sum + unit * item.quantity;
  }, 0);

  // إجمالي بعد الخصم (لو فيه offer.sell_value)
  const totalWithOffers = items.reduce((sum, item) => {
    const unit = item.offer?.sell_value ?? item.sell_price;
    return sum + unit * item.quantity;
  }, 0);

  const totalDiscount = subtotal - totalWithOffers;

  return (
    <main
      dir="rtl"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row"
    >
      {/* ✅ عمود المنتجات */}
      <section className="flex-1">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">سلة التسوق</h1>
        <p className="mb-6 text-sm text-gray-500">
          {items.length === 0
            ? "سلة التسوق الخاصة بك فارغة."
            : `لديك ${items.length} منتج في السلة.`}
        </p>

        <div className="space-y-4">
          {items.map((item) => {
            const unitPrice = item.sell_price;
            const offerPrice = item.offer?.sell_value ?? null;
            const lineTotal = (offerPrice ?? unitPrice) * item.quantity;

            // خطة التقسيط الافتراضية (أول واحدة مثلا)
            const defaultInstallment =
              item.installments && item.installments[0];

            return (
              <div
                key={item.product_id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
              >
                {/* صورة المنتج */}
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
                  <Image
                    src={item.images}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* معلومات المنتج */}
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div>
                    <h2 className="mb-1 text-sm font-semibold text-gray-900">
                      {item.title}
                    </h2>
                    <p className="mb-1 text-xs text-gray-500">
                      {item.category?.title}
                    </p>

                    {/* تفاصيل مثل اللون، المساحة، الرامات... */}
                    {item.details && item.details.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2 text-[11px] text-gray-600">
                        {item.details.map((d) => (
                          <span
                            key={d.product_detail_id}
                            className="rounded-full bg-gray-100 px-2 py-0.5"
                          >
                            {d.label}: {d.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* الأسعار + الكمية + التقسيط */}
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-baseline gap-2">
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
                          {formatPrice(unitPrice)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        الكمية:{" "}
                        <span className="font-semibold">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="text-xs font-medium text-gray-900">
                        إجمالي المنتج: {formatPrice(lineTotal)}
                      </p>

                      {item.offer && (
                        <p className="text-[11px] text-emerald-600">
                          عرض خاص: خصم بنسبة{" "}
                          <span className="font-semibold">
                            %{item.offer.offer_value}
                          </span>
                        </p>
                      )}

                      {/* ملخص التقسيط (أبسط شكل) */}
                      {defaultInstallment && (
                        <p className="mt-1 text-[11px] text-blue-700">
                          متوفر تقسيط حتى{" "}
                          <span className="font-semibold">
                            {defaultInstallment.installment_title}
                          </span>{" "}
                          — تقريبا{" "}
                          {formatPrice(
                            defaultInstallment.full_price /
                              defaultInstallment.installment_number
                          )}{" "}
                          / شهر
                        </p>
                      )}
                    </div>

                    {/* أزرار بسيطة (يمكن ربطها لاحقًا بالـ API) */}
                    <div className="flex flex-col items-end gap-2 text-xs">
                      <button className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50">
                        إزالة من السلة
                      </button>
                      <button className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50">
                        حفظ لوقت لاحق
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
              لا توجد منتجات في سلتك حاليًا.
              <br />
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                تصفح المنتجات
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ✅ ملخص الطلب */}
      <aside className="w-full max-w-sm self-start rounded-2xl bg-white p-5 shadow-md">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          ملخص الطلب
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span>الإجمالي قبل الخصم</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-emerald-600">
              <span>إجمالي الخصم</span>
              <span>- {formatPrice(totalDiscount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-base font-bold text-gray-900">
            <span>الإجمالي المستحق</span>
            <span>{formatPrice(totalWithOffers)}</span>
          </div>
        </div>

        <button className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
          إتمام الشراء
        </button>

        <p className="mt-3 text-[11px] text-gray-500">
          يمكنك اختيار خطة التقسيط المناسبة لك في الخطوة التالية من
          عملية الدفع، إذا كانت متاحة للمنتجات.
        </p>
      </aside>
    </main>
  );
}


