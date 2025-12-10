"use client";

import { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import useOrders from "../../../hooks/useGetOrders";
export default function OrdersList() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 🧠 قراءة page & per_page من الـ URL
  const urlPage = Number(searchParams.get("page") || "1");
  const currentPageFromUrl =
    Number.isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  const urlPerPage = Number(searchParams.get("per_page") || "10");
  const perPage =
    Number.isNaN(urlPerPage) || urlPerPage <= 0 ? 10 : urlPerPage;

  // 🛒 جلب الطلبات من الهوك
  const { orders, pagination, loading, error } = useOrders(
    token,
    currentPageFromUrl,
    perPage
  );

  // 🔔 لو في خطأ من الهوك
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // 🧭 تحديث الـ URL عند تغيير page / per_page
  const updateQuery = (changes = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    if ("page" in changes) {
      const p = Number(changes.page) || 1;
      if (p > 1) params.set("page", String(p));
      else params.delete("page");
    }

    if ("per_page" in changes) {
      const pp = Number(changes.per_page) || 10;
      params.set("per_page", String(pp));
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url, { scroll: false });
  };

  const handlePageChange = (page) => {
    if (!pagination) return;
    if (page < 1 || page > pagination.totalPages) return;
    updateQuery({ page, per_page: perPage });
  };

  const handlePerPageChange = (e) => {
    const newPerPage = Number(e.target.value) || 10;
    // لما نغير عدد العناصر نرجّع لأول صفحة
    updateQuery({ page: 1, per_page: newPerPage });
  };

  // فلترة الطلبات الفارغة
  const filteredOrders = (orders || []).filter(
    (order) => order.total_price !== 0
  );

  const currentPage = pagination?.current_page || currentPageFromUrl;
  const totalPages = pagination?.totalPages || 1;
  const totalOrders = pagination?.total || filteredOrders.length;
  // حالة التحميل
  if (loading) {
    return (
      <section className="py-8 md:py-12" dir="rtl">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-6 h-8 w-40 animate-pulse rounded-full bg-gray-100" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
  // لو مش عامل لوجين
  if (!token) {
    return (
      <section className="py-10" dir="rtl">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            يرجى تسجيل الدخول
          </h2>
          <p className="text-sm text-gray-500">
            قم بتسجيل الدخول حتى تتمكن من عرض ومتابعة طلباتك السابقة.
          </p>
        </div>
      </section>
    );
  }



  // لو مفيش طلبات
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
        {/* العنوان + عدد الطلبات + per_page */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              طلباتي
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              يمكنك متابعة حالة طلباتك، طريقة الدفع، والقيمة الإجمالية لكل طلب.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              <Package className="h-4 w-4" />
              <span>إجمالي الطلبات: {totalOrders}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>عدد الطلبات في الصفحة:</span>
              <select
                value={perPage}
                onChange={handlePerPageChange}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* لو في خطأ بسيط نعرضه فوق الليست */}
        {error && (
          <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-xs text-orange-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* قائمة الطلبات */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>

        {/* الباجيناشن */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3 text-xs md:flex-row md:justify-between">
            <div className="text-gray-500">
              صفحة <span className="font-semibold">{currentPage}</span> من{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-full px-3 py-1.5 border ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - currentPage) <= 2) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showDots = prev && p - prev > 1;
                  return (
                    <span key={p} className="flex items-center">
                      {showDots && (
                        <span className="px-1 text-gray-400">…</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`mx-0.5 rounded-full px-3 py-1.5 border ${
                          p === currentPage
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded-full px-3 py-1.5 border ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ====== باقي الدوال كما هي ====== */

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

          {/* تفاصيل المنتجات */}
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

            <a
              href="https://wa.me/201555440950?text=مرحبًا%20اريد%20متابعة%20الطلب"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-black md:bg-slate-600 md:hover:bg-slate-500"
            >
              <CheckCircle2 className="h-4 w-4" />
              متابعة الطلب مع خدمة العملاء
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

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

function getInstallmentsSummary(installments = []) {
  let paidCount = 0;
  let pendingCount = 0;

  installments.forEach((part) => {
    if (part.part_status === "paid") paidCount += 1;
    else pendingCount += 1;
  });

  return { paidCount, pendingCount };
}
