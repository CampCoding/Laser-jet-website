"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // ⌨️ Toggle with Ctrl/⌘ + K
  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const trending = ["تليفزيون", "موبايل", "غسالة", "ثلاجة", "لاب توب"];

  async function handleSearch(keyword) {
    const searchKeyword = keyword ?? query;
    if (!searchKeyword.trim()) return;

    setLoading(true);
    setError("");
    try {
      const url = `https://lesarjet.camp-coding.site/api/pages/home/search?keyword=${encodeURIComponent(
        searchKeyword
      )}`;

      const res = await fetch(url);
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
    handleSearch();
  }

  function formatPrice(p) {
    if (!p) return "";
    const num = Number(p);
    if (Number.isNaN(num)) return p;
    return num.toLocaleString("ar-EG") + " ج.م";
  }

  return (
    <>
      {/* 🔵 Trigger button */}
      <button  onClick={() => setOpen(true)} className=" cursor-pointer rounded-full border border-gray-200 p-2 hover:border-blue-500 hover:text-blue-600">
        <SearchIcon size={20} />
      </button>

      {/* 🔵 Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm px-3 sm:px-6 pt-20 sm:pt-28">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setOpen(false)} />

          {/* White Card */}
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            {/* Top gradient line */}
            <div className="h-1 w-full bg-linear-to-r from-blue-500 via-sky-400 to-indigo-500" />

            {/* Header / input */}
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3"
                dir="rtl"
              >
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 border border-blue-100 px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
                  <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="ابحث عن تليفزيون، موبايل، غسالة، ثلاجة..."
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setProducts([]);
                        setCategories([]);
                        setError("");
                      }}
                      className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      مسح
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  بحث
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="hidden sm:inline-flex h-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Esc
                </button>
              </form>

              {/* Trending */}
              <div
                className="flex flex-wrap gap-2 text-xs sm:text-[13px]"
                dir="rtl"
              >
                <span className="text-slate-500">الاقتراحات الشائعة:</span>
                {trending.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      handleSearch(item);
                    }}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] sm:text-xs text-blue-700 hover:bg-blue-100 hover:border-blue-200 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Body / results */}
            <div
              className="border-t border-slate-100 bg-white px-4 py-3 sm:px-6 sm:py-4"
              dir="rtl"
            >
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <p className="text-sm text-slate-700">
                      جاري البحث عن النتائج...
                    </p>
                  </div>
                </div>
              )}

              {!loading && error && (
                <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && products.length === 0 && !query && (
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                    <SearchIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    ابدأ بالكتابة للبحث عن المنتجات
                  </p>
                </div>
              )}

              {!loading && !error && products.length === 0 && query && (
                <div className="py-6 text-center text-sm text-slate-600">
                  لا توجد نتائج مطابقة لـ{" "}
                  <span className="font-semibold text-blue-600">"{query}"</span>
                </div>
              )}

              {!loading && !error && products.length > 0 && (
                <div className="flex flex-col gap-4">
                  {/* Categories pills */}
                  {categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs sm:text-[13px]">
                      {categories.map((cat) => (
                        <span
                          key={cat.category_id}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-slate-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          {cat.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Products grid */}
                  <div className="max-h-80 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {products.map((product) => (
                        <button
                          key={product.product_id}
                          type="button"
                          className="group flex items-stretch gap-3 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-blue-200 shadow-sm hover:shadow-md transition text-right"
                        >
                          {/* Image */}
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-100">
                            {product.images?.[0]?.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0].image_url}
                                alt={product.title}
                                className="h-full w-full object-contain p-1.5"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                لا توجد صورة
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 flex-col justify-between py-2 pr-1">
                            <div className="flex flex-col gap-1">
                              <p className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                                {product.title}
                              </p>
                              {product.category?.title && (
                                <p className="text-[11px] text-slate-500">
                                  التصنيف:{" "}
                                  <span className="text-slate-700">
                                    {product.category.title}
                                  </span>
                                </p>
                              )}
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-blue-700">
                                {formatPrice(
                                  product.sell_price || product.price
                                )}
                              </p>
                              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 border border-blue-100">
                                عرض التفاصيل
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

