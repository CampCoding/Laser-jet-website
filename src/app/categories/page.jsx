"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import useCategories from "../../../hooks/useGetCategories";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 🔢 قراءة رقم الصفحة من الـ URL
  const urlPage = Number(searchParams.get("page") ?? "1");
  const safePage = Number.isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  // 🧩 جلب الفئات من الـ hook
  const { categories, pagination, loading, error, page, setPage } =
    useCategories(safePage, 12);

  // 🔄 مزامنة حالة الـ hook مع الـ URL (page)
  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [safePage, page, setPage]);

  // حماية لو الـ API رجّعش pagination
  const currentPage = pagination?.current_page ?? safePage;
  const totalPages = pagination?.totalPages ?? 1;

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  // دالة إنشاء رابط أي صفحة (memo لتحسين الأداء)
  const createPageUrl = useMemo(() => {
    return (pageNumber) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(pageNumber));
      return `${pathname}?${params.toString()}`;
    };
  }, [searchParams, pathname]);

  // ✅ Loading skeleton
  if (loading && !categories.length) {
    return (
      <main className="mx-auto container px-4 sm:px-6 md:px-10 py-6 sm:py-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">الفئات</h1>
          <span className="text-xs text-gray-500">جاري التحميل...</span>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="h-32 sm:h-36 lg:h-40 w-full bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto container px-4 sm:px-6 md:px-10 py-10">
        <p className="text-center text-red-600 text-sm">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto container px-4 sm:px-6 md:px-10 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">الفئات</h1>

        {/* small helper text */}
        <p className="text-xs sm:text-sm text-gray-500">
          صفحة {currentPage} من {totalPages}
        </p>
      </div>

      {/* Empty state */}
      {!categories?.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">لا توجد فئات للعرض حالياً.</p>
        </div>
      ) : (
        <>
          {/* Grid الفئات */}
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <div
                key={cat.category_id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <Link
                  href={{
                    pathname: `/products`,
                    query: { category_id: cat?.category_id },
                  }}
                  className="block"
                >
                  <div className="relative h-32 sm:h-36 lg:h-40 w-full bg-gray-50">
                    <Image
                      src={cat?.image_url || "/placeholder-product.png"}
                      alt={cat?.title || "Category"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <h2 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-1">
                      {cat.title}
                    </h2>

                    <p className="mb-3 text-xs text-gray-500 line-clamp-2">
                      {cat.description || " "}
                    </p>

                    {cat.installments?.length > 0 && (
                      <p className="text-[11px] font-medium text-emerald-600 line-clamp-1">
                        متوفر تقسيط حتى{" "}
                        {
                          cat.installments[cat.installments.length - 1]
                            .installment_title
                        }
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={
                  isFirstPage
                    ? createPageUrl(currentPage)
                    : createPageUrl(currentPage - 1)
                }
                className={`w-full sm:w-auto text-center rounded-full border px-4 py-2 text-sm font-medium ${
                  isFirstPage
                    ? "pointer-events-none border-gray-200 text-gray-400"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                aria-disabled={isFirstPage}
              >
                السابق
              </Link>

              <span className="text-sm text-gray-600">
                صفحة {currentPage} من {totalPages}
              </span>

              <Link
                href={
                  isLastPage
                    ? createPageUrl(+currentPage)
                    : createPageUrl(+currentPage + 1)
                }
                className={`w-full sm:w-auto text-center rounded-full border px-4 py-2 text-sm font-medium ${
                  isLastPage
                    ? "pointer-events-none border-gray-200 text-gray-400"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                aria-disabled={isLastPage}
              >
                التالي
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
}
