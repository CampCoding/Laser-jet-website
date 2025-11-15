"use client";

import { useState } from "react";
import {
  Package,
  CreditCard,
  Truck,
  Smartphone,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const orders = [
  {
      "order_id": 502,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-08-03T11:12:16.000Z",
      "updated_at": "2025-08-03T11:12:17.000Z",
      "payment_type": "cash",
      "payment_method": "credit",
      "user_id": 225,
      "payment_status": "try to buy",
      "address": 116,
      "invoice_key": "jopk9r5eKhbjYwA",
      "invoice_id": 5224678,
      "invoice_url": "https://app.fawaterk.com/lk/3290558",
      "delivery_price": 95,
      "details": "تتتن",
      "alias": "أخري",
      "longitude": "0.000000",
      "latitude": "0.000000",
      "products": [
          {
              "product_title": "مزود طاقة او باور صبلاى 12 فولت 10 أمبير يصلح لكاميرات المراقبه وأجهزة الإنذار و المشاريع هندسيه - 1 قطعة",
              "product_price": 420,
              "product_id": 171,
              "product_quantity": 1,
              "installments": null
          }
      ],
      "total_price": 420
  },
  {
      "order_id": 501,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "confirmed",
      "created_at": "2025-08-03T09:21:44.000Z",
      "updated_at": "2025-08-03T11:10:20.000Z",
      "payment_type": "cash",
      "payment_method": "cash on delivery",
      "user_id": 225,
      "payment_status": "success",
      "address": 114,
      "invoice_key": "",
      "invoice_id": 0,
      "invoice_url": "",
      "delivery_price": 120,
      "details": "طنطا ",
      "alias": "أخري",
      "longitude": "0.000000",
      "latitude": "0.000000",
      "products": [
          {
              "product_title": "هرد 500 جيجا استيراد",
              "product_price": 480,
              "product_id": 165,
              "product_quantity": 1,
              "installments": null
          }
      ],
      "total_price": 480
  },
  {
      "order_id": 485,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-07-23T12:57:02.000Z",
      "updated_at": "2025-07-23T12:57:02.000Z",
      "payment_type": "installment",
      "payment_method": "mini money",
      "user_id": 225,
      "payment_status": "success",
      "address": 109,
      "invoice_key": "0",
      "invoice_id": 0,
      "invoice_url": "0",
      "delivery_price": 100,
      "details": "Hhhhh",
      "alias": "المنزل",
      "longitude": "0.000000",
      "latitude": "0.000000",
      "products": [
          {
              "product_title": "كيبورد اصلية من ديل USB KB216 بتصميم اسود ورفيع، نمط مفاتيح روسي، ديل ",
              "product_price": 540,
              "product_id": 169,
              "product_quantity": 1,
              "installments": [
                  {
                      "installment_part_id": 8069,
                      "part_title": "6 شهور",
                      "part_value": 133.667,
                      "part_pay_date": "2025-07-23 08:57:02",
                      "part_status": "paid"
                  },
                  {
                      "installment_part_id": 8070,
                      "part_title": "6 شهور",
                      "part_value": 133.667,
                      "part_pay_date": "2025-08-23 08:57:02",
                      "part_status": "paid"
                  },
                  {
                      "installment_part_id": 8071,
                      "part_title": "6 شهور",
                      "part_value": 133.667,
                      "part_pay_date": "2025-10-23 08:57:02",
                      "part_status": "paid"
                  },
                  {
                      "installment_part_id": 8072,
                      "part_title": "6 شهور",
                      "part_value": 133.667,
                      "part_pay_date": "2025-11-23 08:57:02",
                      "part_status": "pending"
                  },
                  {
                      "installment_part_id": 8073,
                      "part_title": "6 شهور",
                      "part_value": 133.667,
                      "part_pay_date": "2025-09-23 08:57:02",
                      "part_status": "paid"
                  },
                  {
                      "installment_part_id": 8074,
                      "part_title": "6 شهور",
                      "part_value": 133.667,
                      "part_pay_date": "2025-12-23 08:57:02",
                      "part_status": "pending"
                  }
              ]
          }
      ],
      "total_price": 540
  },
  {
      "order_id": 484,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-07-23T12:43:54.000Z",
      "updated_at": "2025-07-23T12:43:54.000Z",
      "payment_type": "wallet",
      "payment_method": "wallet",
      "user_id": 225,
      "payment_status": "success",
      "address": 109,
      "invoice_key": "",
      "invoice_id": 0,
      "invoice_url": "",
      "delivery_price": 100,
      "details": "Hhhhh",
      "alias": "المنزل",
      "longitude": "0.000000",
      "latitude": "0.000000",
      "products": [
          {
              "product_title": "مسجل فيديو رقمي هيكفيجن 1080 بكسل، H.265، بـ 4 قنوات، ابيض - DS-7104HGHI-K1",
              "product_price": 2160,
              "product_id": 164,
              "product_quantity": 1,
              "installments": null
          }
      ],
      "total_price": 2160
  },
  {
      "order_id": 483,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-07-23T12:39:08.000Z",
      "updated_at": "2025-07-23T12:39:08.000Z",
      "payment_type": "cash",
      "payment_method": "cash on delivery",
      "user_id": 225,
      "payment_status": "success",
      "address": 109,
      "invoice_key": "",
      "invoice_id": 0,
      "invoice_url": "",
      "delivery_price": 100,
      "details": "Hhhhh",
      "alias": "المنزل",
      "longitude": "0.000000",
      "latitude": "0.000000",
      "products": [
          {
              "product_title": "ايربودز أنكر ساوندكورK20i، A3994H11 - أسود",
              "product_price": 840,
              "product_id": 167,
              "product_quantity": 1,
              "installments": null
          }
      ],
      "total_price": 840
  },
  {
      "order_id": 454,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-05-13T15:38:37.000Z",
      "updated_at": "2025-05-13T15:38:37.000Z",
      "payment_type": "cash",
      "payment_method": "cash on delivery",
      "user_id": 225,
      "payment_status": "try to buy",
      "address": 0,
      "invoice_key": "",
      "invoice_id": 0,
      "invoice_url": "",
      "delivery_price": 0,
      "details": null,
      "alias": null,
      "longitude": null,
      "latitude": null,
      "products": [
          {
              "product_title": null,
              "product_price": null,
              "product_id": null,
              "product_quantity": null,
              "installments": null
          }
      ],
      "total_price": 0
  },
  {
      "order_id": 453,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-05-13T15:36:51.000Z",
      "updated_at": "2025-05-13T15:36:51.000Z",
      "payment_type": "cash",
      "payment_method": "cash on delivery",
      "user_id": 225,
      "payment_status": "try to buy",
      "address": 0,
      "invoice_key": "",
      "invoice_id": 0,
      "invoice_url": "",
      "delivery_price": 0,
      "details": null,
      "alias": null,
      "longitude": null,
      "latitude": null,
      "products": [
          {
              "product_title": null,
              "product_price": null,
              "product_id": null,
              "product_quantity": null,
              "installments": null
          }
      ],
      "total_price": 0
  },
  {
      "order_id": 452,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-05-13T15:35:36.000Z",
      "updated_at": "2025-05-13T15:35:36.000Z",
      "payment_type": "cash",
      "payment_method": "cash on delivery",
      "user_id": 225,
      "payment_status": "try to buy",
      "address": 0,
      "invoice_key": "",
      "invoice_id": 0,
      "invoice_url": "",
      "delivery_price": 0,
      "details": null,
      "alias": null,
      "longitude": null,
      "latitude": null,
      "products": [
          {
              "product_title": null,
              "product_price": null,
              "product_id": null,
              "product_quantity": null,
              "installments": null
          }
      ],
      "total_price": 0
  },
  {
      "order_id": 451,
      "name": "Amena basha",
      "email": "",
      "phone": "01284920597",
      "order_status": "pending",
      "created_at": "2025-05-13T15:35:32.000Z",
      "updated_at": "2025-05-13T15:35:32.000Z",
      "payment_type": "cash",
      "payment_method": "",
      "user_id": 225,
      "payment_status": "try to buy",
      "address": 0,
      "invoice_key": "",
      "invoice_id": 0,
      "invoice_url": "",
      "delivery_price": 0,
      "details": null,
      "alias": null,
      "longitude": null,
      "latitude": null,
      "products": [
          {
              "product_title": null,
              "product_price": null,
              "product_id": null,
              "product_quantity": null,
              "installments": null
          }
      ],
      "total_price": 0
  }
]

export default function OrdersList({ }) {
  
  // فلترة الطلبات الفارغة
  const filteredOrders = orders.filter((order) => order.total_price !== 0);

  if (!filteredOrders.length) {
    return (
      <section className="py-10" dir="rtl">
        <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-gray-300 bg-blue-50 p-8 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            لا يوجد طلبات حتى الآن
          </h2>
          <p className="text-sm text-gray-500">
            عند إتمام أي طلب من المتجر، سيظهر لك هنا تفاصيله وحالته خطوة بخطوة.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12" dir="rtl">
      <div className="mx-auto max-w-5xl px-4">
        {/* العنوان */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              طلباتي
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              يمكنك متابعة حالة طلباتك، طريقة الدفع، والقيمة الإجمالية لكل طلب.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 md:inline-flex">
            <Package className="h-4 w-4" />
            إجمالي الطلبات: {filteredOrders.length}
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderCard({ order }) {
  const [showProducts, setShowProducts] = useState(false);

  const createdAt = order.created_at ? new Date(order.created_at) : null;

  const formattedDate = createdAt
    ? createdAt.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "تاريخ غير متوفر";

  const formattedTime = createdAt
    ? createdAt.toLocaleTimeString("ar-EG", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const statusMeta = getStatusMeta(order.order_status);
  const paymentMeta = getPaymentMeta(order.payment_status);
  const paymentTypeLabel = getPaymentTypeLabel(order.payment_type);
  const paymentMethodLabel = getPaymentMethodLabel(order.payment_method);

  const deliveryPrice = order.delivery_price || 0;
  const total = order.total_price || 0;
  const grandTotal = total + deliveryPrice;

  const products = order.products || [];
  const productsCount = products.length;

  const firstProduct = products[0];
  const installments = firstProduct?.installments || [];
  const { paidCount, pendingCount } = getInstallmentsSummary(installments);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* شريط علوي بحالة الطلب */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-l from-blue-50/60 to-indigo-50/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-900/90 px-3 py-1 text-xs font-semibold text-white">
            رقم الطلب #{order.order_id}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.className}`}
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-current" />
            {statusMeta.label}
          </span>
          <span
            className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold md:inline-flex ${paymentMeta.className}`}
          >
            {paymentMeta.icon}
            {paymentMeta.label}
          </span>
        </div>

        <div className="text-left text-[11px] text-gray-600 md:text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
            {formattedTime && <span>، {formattedTime}</span>}
          </div>
          <p className="mt-0.5 text-[10px] text-gray-400">
            الاسم: {order.name || "غير محدد"} - {order.phone}
          </p>
        </div>
      </div>

      {/* محتوى الكارت */}
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-stretch">
        {/* ملخص الطلب الأساسي */}
        <div className="flex-1 space-y-4">
          {/* معلومات عامة عن الطلب */}
          <div className="grid gap-3 text-xs md:grid-cols-3">
            {/* محتوى الطلب */}
            <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-blue-50 px-3 py-2">
              <Package className="mt-0.5 h-4 w-4 text-blue-600" />
              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  محتوى الطلب
                </p>
                <p className="text-gray-900">
                  {productsCount > 0
                    ? `${productsCount} منتج${
                        productsCount > 1 ? " (التفاصيل مخفية)" : ""
                      }`
                    : "لم يتم تحديد المنتجات"}
                </p>
                {order.details && (
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    ملاحظات: {order.details}
                  </p>
                )}
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2">
              <CreditCard className="mt-0.5 h-4 w-4 text-indigo-600" />
              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  طريقة الدفع
                </p>
                <p className="text-gray-900">{paymentTypeLabel}</p>
                {paymentMethodLabel && (
                  <p className="text-[11px] text-gray-500">
                    ({paymentMethodLabel})
                  </p>
                )}
                {installments.length > 0 && (
                  <p className="mt-0.5 text-[11px] text-purple-700">
                    خطة تقسيط: مدفوع{" "}
                    <span className="font-bold">
                      {paidCount}/{installments.length}
                    </span>{" "}
                    - متبقي{" "}
                    <span className="font-bold">{pendingCount}</span>
                  </p>
                )}
              </div>
            </div>

            {/* الشحن */}
            <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2">
              <Truck className="mt-0.5 h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  الشحن
                </p>
                <p className="text-gray-900">
                  مصاريف الشحن: {deliveryPrice} جم
                </p>
                <p className="text-[11px] text-gray-500">
                  العنوان: {order.alias || "غير محدد"}
                </p>
              </div>
            </div>
          </div>

          {/* بيانات التواصل */}
          <div className="grid gap-3 text-xs md:grid-cols-2">
            <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2">
              <Smartphone className="mt-0.5 h-4 w-4 text-blue-600" />
              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  بيانات التواصل
                </p>
                <p className="text-gray-900">{order.phone}</p>
                {order.email && (
                  <p className="text-[11px] text-gray-500">{order.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2">
              <FileText className="mt-0.5 h-4 w-4 text-gray-600" />
              <div>
                <p className="text-[11px] font-semibold text-gray-700">
                  ملحوظات إضافية
                </p>
                <p className="text-[11px] text-gray-900">
                  حالة الدفع: {paymentMeta.label}
                </p>
                <p className="text-[11px] text-gray-500">
                  نوع الدفع: {order.payment_type || "غير محدد"}
                </p>
              </div>
            </div>
          </div>

          {/* زر إظهار / إخفاء تفاصيل المنتجات */}
          {productsCount > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowProducts((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-blue-100"
              >
                {showProducts ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    إخفاء تفاصيل المنتجات
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    عرض تفاصيل المنتجات
                  </>
                )}
              </button>
            </div>
          )}

          {/* تفاصيل المنتجات - تظهر فقط عند الضغط على الزر */}
          {showProducts && productsCount > 0 && (
            <div className="mt-3 space-y-2 rounded-xl border border-dashed border-gray-200 bg-blue-50 p-3 text-xs">
              <p className="mb-1 text-[11px] font-semibold text-gray-700">
                تفاصيل المنتجات في هذا الطلب:
              </p>
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 rounded-lg bg-white px-3 py-2 shadow-sm"
                >
                  <p className="text-[11px] font-semibold text-gray-900">
                    {product.product_title || "منتج بدون اسم"}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                    {product.product_quantity && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 border border-gray-200">
                        الكمية: {product.product_quantity}
                      </span>
                    )}
                    {product.product_price && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 border border-gray-200">
                        سعر الوحدة: {product.product_price} جم
                      </span>
                    )}
                    {product.product_price && product.product_quantity && (
                      <span className="rounded-full bg-blue-900 px-2 py-0.5 text-white text-[10px]">
                        إجمالي المنتج:{" "}
                        {product.product_price * product.product_quantity} جم
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ملخص الأرقام + الفاتورة */}
        <div className="w-full max-w-xs rounded-2xl border border-gray-100 bg-blue-50 p-4 text-sm md:w-64 md:self-stretch md:bg-gradient-to-b md:from-slate-900 md:to-slate-800 md:text-gray-100">
          <h3 className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-600 md:text-gray-300">
            ملخص مالي
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-700 md:text-gray-200 border border-white/10">
              جم
            </span>
          </h3>

          <div className="space-y-1.5 text-xs">
            <Row label="إجمالي المنتجات" value={`${total} جم`} />
            <Row label="مصاريف الشحن" value={`${deliveryPrice} جم`} />
            <div className="border-t border-gray-200 pt-2 md:border-gray-600">
              <Row
                label="الإجمالي النهائي"
                value={`${grandTotal} جم`}
                strong
              />
            </div>
          </div>

          {/* حالة الدفع في الجانب الأيمن على الموبايل */}
          <div className="mt-3 flex items-center gap-2 text-[11px] md:hidden">
            {paymentMeta.icon}
            <span className={paymentMeta.className.replace("bg-", "text-")}>
              {paymentMeta.label}
            </span>
          </div>

          {/* الفاتورة / رابط الدفع */}
          <div className="mt-4 space-y-2">
            {order.invoice_url && order.invoice_url !== "0" ? (
              <a
                href={order.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-blue-100 md:bg-slate-700 md:text-gray-50 md:hover:bg-slate-600"
              >
                <FileText className="h-4 w-4" />
                عرض الفاتورة / بوابة الدفع
              </a>
            ) : (
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-[11px] text-gray-500 hover:border-gray-400"
              >
                <AlertCircle className="h-4 w-4" />
                لا يوجد رابط فاتورة لهذا الطلب
              </button>
            )}

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-black md:bg-slate-600 md:hover:bg-slate-500"
            >
              <CheckCircle2 className="h-4 w-4" />
              متابعة الطلب مع خدمة العملاء
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/** صف صغير داخل الملخص المالي */
function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-gray-500 md:text-gray-300">
        {label}
      </span>
      <span
        className={`text-xs ${
          strong
            ? "font-bold text-gray-900 md:text-white"
            : "text-gray-800 md:text-gray-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/** ميتا حالة الطلب */
function getStatusMeta(status) {
  switch (status) {
    case "confirmed":
      return {
        label: "تم تأكيد الطلب",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      };
    case "pending":
    default:
      return {
        label: "قيد المراجعة",
        className: "bg-amber-50 text-amber-700 border border-amber-100",
      };
  }
}

/** ميتا حالة الدفع */
function getPaymentMeta(paymentStatus) {
  switch (paymentStatus) {
    case "success":
      return {
        label: "دفع ناجح",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        icon: <CheckCircle2 className="h-3 w-3 text-emerald-600" />,
      };
    case "try to buy":
    default:
      return {
        label: "محاولة شراء / لم يكتمل",
        className: "bg-orange-50 text-orange-700 border border-orange-100",
        icon: <AlertCircle className="h-3 w-3 text-orange-600" />,
      };
  }
}

function getPaymentTypeLabel(type) {
  switch (type) {
    case "cash":
      return "دفع نقدي";
    case "installment":
      return "دفع بالتقسيط";
    case "wallet":
      return "محفظة إلكترونية";
    default:
      return "طريقة دفع غير محددة";
  }
}

function getPaymentMethodLabel(method) {
  if (!method) return "";
  switch (method) {
    case "cash on delivery":
      return "الدفع عند الاستلام";
    case "credit":
      return "بطاقة ائتمان";
    case "mini money":
      return "ميني موني (تقسيط)";
    case "wallet":
      return "محفظة إلكترونية";
    default:
      return method;
  }
}

/** ملخص الأقساط */
function getInstallmentsSummary(installments = []) {
  let paidCount = 0;
  let pendingCount = 0;

  installments.forEach((part) => {
    if (part.part_status === "paid") paidCount += 1;
    else pendingCount += 1;
  });

  return { paidCount, pendingCount };
}
