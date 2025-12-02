"use client";

import AllCatg from "@/CallApi/AllCatg";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // STATE علشان نخزن فيها الداتا اللي راجعة من API
  const [categoriesAndPagination, setCategoriesAndPagination] = useState(null);

  // FUNCTION جلب الداتا من API
  async function GetcategoriesAndPagination() {
    const data = await AllCatg();
    console.log("API DATA:", data);
    setCategoriesAndPagination(data?.data); // ← خزن الداتا فقط
  }

  useEffect(() => {
    GetcategoriesAndPagination();
  }, []);

  // لو الداتا لسه محمّلتش
  if (!categoriesAndPagination) {
    return <p className="text-center py-10">جاري التحميل...</p>;
  }

  // استخراج الداتا بعد التحميل
  const { categories, pagination } = categoriesAndPagination;

  // current page من الـ URL أو 1 افتراضياً
  const page = Number(searchParams.get("page") ?? "1");

  // تحديد لو دي أول أو آخر صفحة
  const isFirstPage = pagination.current_page <= 1;
  const isLastPage = pagination.current_page >= pagination.totalPages;

  // دالة إنشاء رابط أي صفحة
  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">التصنيفات</h1>

      {/* Grid التصنيفات */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <div
            key={cat.category_id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Link
              href={{
                pathname: `/spasicfic-Catg/${cat?.category_id}`,
                query: { name: cat?.title },
              }}
            >
              <div className="relative h-40 w-full">
                <Image
                  src={cat.image_url}
                  alt={cat.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="mb-1 text-sm font-semibold text-gray-900">
                  {cat.title}
                </h2>

                <p className="mb-3 text-xs text-gray-500 line-clamp-2">
                  {cat.description}
                </p>

                {cat.installments?.length > 0 && (
                  <p className="text-[11px] font-medium text-emerald-600">
                    متوفر تقسيط حتى{" "}
                    {cat.installments[cat.installments.length - 1].installment_title}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href={isFirstPage ? createPageUrl(pagination.current_page) : createPageUrl(pagination.current_page - 1)}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            isFirstPage
              ? "cursor-not-allowed border-gray-200 text-gray-400"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          aria-disabled={isFirstPage}
        >
          السابق
        </Link>

        <span className="text-sm text-gray-600">
          صفحة {pagination.current_page} من {pagination.totalPages}
        </span>

        <Link
          href={isLastPage ? createPageUrl(pagination.current_page) : createPageUrl(pagination.current_page + 1)}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            isLastPage
              ? "cursor-not-allowed border-gray-200 text-gray-400"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          aria-disabled={isLastPage}
        >
          التالي
        </Link>
      </div>
    </main>
  );
}

