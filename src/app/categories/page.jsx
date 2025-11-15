

"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";


const categoriesAndPagination = {
  "success": true,
  "message": "تم جلب الفئة بنجاح",
  "data": {
      "categories": [
          {
              "category_id": 36,
              "is_active": true,
              "created_at": "2025-03-13T15:28:05.000Z",
              "updated_at": "2025-11-03T07:48:16.000Z",
              "order_no": 3,
              "gain": 15,
              "title": "الهواتف الذكية - صنع في مصر",
              "description": "جميع فائة الموبايلات",
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 64,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 33.5
                  },
                  {
                      "installment_id": 21,
                      "category_installment_id": 36,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 63.5
                  },
                  {
                      "installment_id": 22,
                      "category_installment_id": 63,
                      "installment_title": "24 شهر",
                      "order_no": 0,
                      "installment_gain": 123.5
                  },
                  {
                      "installment_id": 23,
                      "category_installment_id": 38,
                      "installment_title": "36 شهر",
                      "order_no": 0,
                      "installment_gain": 183.5
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1741951277063.webp"
          },
          {
              "category_id": 38,
              "is_active": true,
              "created_at": "2025-03-14T11:28:21.000Z",
              "updated_at": "2025-05-25T09:46:58.000Z",
              "order_no": 3,
              "gain": 20,
              "title": "ايربودز",
              "description": "ايربودز",
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 43,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30
                  },
                  {
                      "installment_id": 21,
                      "category_installment_id": 67,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 60
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1741951708892.webp"
          },
          {
              "category_id": 43,
              "is_active": true,
              "created_at": "2025-03-14T11:37:27.000Z",
              "updated_at": "2025-11-03T09:32:03.000Z",
              "order_no": 3,
              "gain": 15,
              "title": "التابلت - صنع في مصر",
              "description": "التابلت - صنع في مصر",
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 47,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30
                  },
                  {
                      "installment_id": 21,
                      "category_installment_id": 69,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 60
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1741952246678.webp"
          },
          {
              "category_id": 39,
              "is_active": true,
              "created_at": "2025-03-14T11:29:08.000Z",
              "updated_at": "2025-11-03T08:32:59.000Z",
              "order_no": 4,
              "gain": 15,
              "title": "التليفزيونات",
              "description": "التليفزيونات",
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 44,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30
                  },
                  {
                      "installment_id": 21,
                      "category_installment_id": 59,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 60
                  },
                  {
                      "installment_id": 22,
                      "category_installment_id": 60,
                      "installment_title": "24 شهر",
                      "order_no": 0,
                      "installment_gain": 120
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1741951747921.webp"
          },
          {
              "category_id": 40,
              "is_active": true,
              "created_at": "2025-03-14T11:32:38.000Z",
              "updated_at": "2025-11-03T07:47:58.000Z",
              "order_no": 4,
              "gain": 20,
              "title": "ساعات ذكية",
              "description": "ساعات ذكية",
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 45,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 16
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1741951957827.webp"
          },
          {
              "category_id": 41,
              "is_active": true,
              "created_at": "2025-03-14T11:35:08.000Z",
              "updated_at": "2025-11-03T07:48:25.000Z",
              "order_no": 4,
              "gain": 20,
              "title": "إكسسوارات الموبايل",
              "description": "إكسسوارات الموبايل",
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 62,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30
                  },
                  {
                      "installment_id": 21,
                      "category_installment_id": 61,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 60
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1741952108569.webp"
          },
          {
              "category_id": 48,
              "is_active": true,
              "created_at": "2025-03-25T19:58:48.000Z",
              "updated_at": "2025-05-25T09:34:28.000Z",
              "order_no": 5,
              "gain": 0,
              "title": "مستلزمات برنتر",
              "description": "مستلزمات برنتر",
              "installments": [],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1742940629425.png"
          },
          {
              "category_id": 60,
              "is_active": true,
              "created_at": "2025-11-11T17:57:26.000Z",
              "updated_at": "2025-11-11T17:57:33.000Z",
              "order_no": 5,
              "gain": 0,
              "title": "عروض ليزرجيت الاسبوعيه",
              "description": "0",
              "installments": [],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1762883846098.png"
          },
          {
              "category_id": 61,
              "is_active": true,
              "created_at": "2025-11-12T13:44:22.000Z",
              "updated_at": "2025-11-12T13:48:01.000Z",
              "order_no": 5,
              "gain": 15,
              "title": "كاميرات تصوير",
              "description": "...",
              "installments": [
                  {
                      "installment_id": 21,
                      "category_installment_id": 78,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 60
                  },
                  {
                      "installment_id": 22,
                      "category_installment_id": 77,
                      "installment_title": "24 شهر",
                      "order_no": 0,
                      "installment_gain": 120
                  },
                  {
                      "installment_id": 23,
                      "category_installment_id": 79,
                      "installment_title": "36 شهر",
                      "order_no": 0,
                      "installment_gain": 150
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1762955062723.png"
          },
          {
              "category_id": 52,
              "is_active": true,
              "created_at": "2025-04-29T13:32:27.000Z",
              "updated_at": "2025-11-03T07:47:50.000Z",
              "order_no": 6,
              "gain": 20,
              "title": "الامن والسلامه",
              "description": "الامن والسلامه",
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 70,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30
                  },
                  {
                      "installment_id": 21,
                      "category_installment_id": 71,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 60
                  },
                  {
                      "installment_id": 22,
                      "category_installment_id": 72,
                      "installment_title": "24 شهر",
                      "order_no": 0,
                      "installment_gain": 120
                  }
              ],
              "image_url": "https://camp-coding.site/laserjet/uploads/products/1745933547967.webp"
          }
      ],
      "pagination": {
          "total": 14,
          "totalPages": 2,
          "current_page": 1,
          "per_page": 10
      }
  }
}


export default function CategoriesPage({  }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // لو مفيش page خليها 1
  const page = Number(searchParams.get("page") ?? "1");
  const per_page = 10;

  const { categories, pagination } = categoriesAndPagination.data;

  const isFirstPage = pagination.current_page <= 1;
  const isLastPage = pagination.current_page >= pagination.totalPages;

  // لو حابب تحافظ على باقي الـ query params
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

              {cat.installments && cat.installments.length > 0 && (
                <p className="text-[11px] font-medium text-emerald-600">
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

      {/* الـ Pagination */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {/* السابق */}
        <Link
          href={
            isFirstPage
              ? createPageUrl(pagination.current_page)
              : createPageUrl(pagination.current_page - 1)
          }
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

        {/* التالي */}
        <Link
          href={
            isLastPage
              ? createPageUrl(pagination.current_page)
              : createPageUrl(pagination.current_page + 1)
          }
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


