"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

const API_URL = "https://lesarjet.camp-coding.site/api/pages/home/search";

export default function DesktopSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const wrapperRef = useRef(null);

  // 🔹 إغلاق الـ dropdown عند الضغط خارج الكومبوننت
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Debounce للـ query (عشان منعملش طلب لكل حرف فورًا)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400); // 400ms مناسب للـ live search

    return () => clearTimeout(handler);
  }, [query]);

  // 🔹 تشغيل البحث كل ما debouncedQuery تتغير
  useEffect(() => {
    if (!debouncedQuery) {
      setProducts([]);
      setCategories([]);
      setError("");
      setOpenDropdown(false);
      return;
    }

    handleSearch(debouncedQuery);
  }, [debouncedQuery]);

  function formatPrice(p) {
    if (!p) return "";
    const num = Number(p);
    if (Number.isNaN(num)) return p;
    return num.toLocaleString("ar-EG") + " ج.م";
  }

  async function handleSearch(keyword) {
    setLoading(true);
    setError("");
    setOpenDropdown(true);

    try {
      const res = await fetch(
        `${API_URL}?keyword=${encodeURIComponent(keyword)}`
      );
      const json = await res.json();

      if (json?.success && json?.data) {
        setProducts(json.data.products || []);
        setCategories(json.data.categories || []);
      } else {
        setProducts([]);
        setCategories([]);
        setError(json?.message || "حدث خطأ أثناء جلب البيانات");
      }
    } catch (err) {
      console.error(err);
      setError("تعذر الاتصال بالسيرفر. حاول مرة أخرى.");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      // بحث فوري بدون انتظار الـ debounce
      setDebouncedQuery(query.trim());
    }
  }

  function handleProductClick(product) {
    // 🔹 هنا تحط الـ navigation الحقيقي
    // مثال:
    // router.push(`/products/${product.product_id}`)
    console.log("Selected product: ", product);
    setOpenDropdown(false);
  }

  return (
    <div className="hidden flex-1 items-center justify-center md:flex" dir="rtl">
      <div ref={wrapperRef} className="relative w-full max-w-md">
        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="ابحث في LASER..."
            className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                setProducts([]);
                setCategories([]);
                setError("");
                setOpenDropdown(false);
              } else {
                setOpenDropdown(true); // يظهر الدروب داون أثناء الكتابة
              }
            }}
            onFocus={() => {
              if ((products.length > 0 || error || loading) && query.trim()) {
                setOpenDropdown(true);
              }
            }}
          />

          <button
            type="submit"
            className="cursor-pointer flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Search size={16} />
            ابحث
          </button>
        </form>

        {/* Dropdown results */}
        {openDropdown && (
          <div className="absolute right-0 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg z-50">
            {/* Loading */}
            {loading && (
              <div className="px-4 py-3 text-sm text-slate-700 flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                جاري البحث...
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="px-4 py-3 text-sm text-red-700 bg-red-50 rounded-2xl">
                {error}
              </div>
            )}

            {/* لا يوجد نتائج */}
            {!loading &&
              !error &&
              products.length === 0 &&
              debouncedQuery &&
              debouncedQuery.length > 0 && (
                <div className="px-4 py-3 text-sm text-slate-600">
                  لا توجد نتائج مطابقة لـ{" "}
                  <span className="font-semibold text-blue-600">
                    "{debouncedQuery}"
                  </span>
                </div>
              )}

            {/* Placeholder لو مفيش حاجة */}
            {!loading && !error && !debouncedQuery && (
              <div className="px-4 py-3 text-xs text-slate-500">
                اكتب اسم المنتج للبحث في LASER...
              </div>
            )}

            {/* Results */}
            {!loading && !error && products.length > 0 && (
              <div className="max-h-80 overflow-y-auto p-2">
                {/* Categories bar */}
                {categories?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-1 pb-2 text-[11px]">
                    {categories.map((cat) => (
                      <span
                        key={cat.category_id}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {cat.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Products list */}
                <ul className="space-y-1">
                  {products.map((product) => (
                    <li key={product.product_id}>
                      <Link href={`/spasific-product/${product.product_id}`}
                        type="button"
                        onClick={() => handleProductClick(product)}
                        className="w-full cursor-pointer text-right flex items-stretch gap-2 rounded-xl px-2.5 py-2 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition"
                      >
                        {/* Image */}
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-slate-100">
                          {product.images?.[0]?.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0].image_url}
                              alt={product.title}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                              لا توجد صورة
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col justify-between">
                          <p className="text-[13px] font-semibold text-slate-900 line-clamp-2">
                            {product.title}
                          </p>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-[11px] text-slate-500">
                              {product.category?.title}
                            </span>
                            <span className="text-[13px] font-bold text-blue-700">
                              {formatPrice(product.sell_price || product.price)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
