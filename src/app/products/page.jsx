"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useProductsSearch from "../../../hooks/useSearch";
import useCategories from "../../../hooks/useGetCategories";
import ProductCard from "../_commponent/Card/ProductCard";
import { FieldSlider } from "../_commponent/PriceRange";
import { SlidersHorizontal, X } from "lucide-react";

// ✅ hook عام لإرجاع callback فيه debounce
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null);
  const latestCallbackRef = useRef(callback);
  useEffect(() => {
    latestCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        latestCallbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

const SORT_OPTIONS = [
  { value: "date_desc", label: "الأحدث أولاً" },
  { value: "date_asc", label: "الأقدم أولاً" },
  { value: "price_asc", label: "السعر من الأقل للأعلى" },
  { value: "price_desc", label: "السعر من الأعلى للأقل" },
  { value: "sold_quantity_desc", label: "الأكثر مبيعًا" },
];

// ✅ Component الفلاتر (مستقل عن ProductsPage عشان ما يفقدش الـ focus)
function FiltersContent({
  keyword,
  setKeyword,
  debouncedUpdateKeyword,
  categories,
  categoriesLoading,
  categoriesError,
  selectedCategory,
  handleCategoryChange,
  priceRange,
  handlePriceRangeChange,
  minSold,
  setMinSold,
  maxSold,
  setMaxSold,
  updateFiltersInUrl,
  sortValue,
  handleSortChange,
}) {
  return (
    <>
      {/* Keyword */}
      <div className="mb-3">
        <label className="block text-xs text-slate-500 mb-1">
          البحث بالكلمة
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            const v = e.target.value;
            setKeyword(v); // تحديث الـ UI فوراً
            debouncedUpdateKeyword(v); // تحديث الـ URL / البحث بعد التوقف
          }}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="مثال: تليفزيون 55 بوصة"
        />
      </div>

      {/* Categories as radio buttons */}
      <div className="mb-3">
        <p className="block text-xs text-slate-500 mb-1">الفئات</p>

        {categoriesLoading && (
          <div className="text-xs text-slate-400">جاري تحميل الفئات...</div>
        )}

        {categoriesError && (
          <div className="text-[11px] text-red-500">تعذر تحميل الفئات</div>
        )}

        {!categoriesLoading && categories?.length > 0 && (
          <div className="max-h-48 overflow-auto space-y-1">
            {/* خيار الكل */}
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={!selectedCategory}
                onChange={() => handleCategoryChange(null)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>الكل</span>
            </label>

            {categories.map((cat) => (
              <label
                key={cat.category_id}
                className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.category_id}
                  checked={selectedCategory === String(cat.category_id)}
                  onChange={() => handleCategoryChange(cat.category_id)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{cat.title}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Slider (with debounce) */}
      <div className="mb-4">
        <FieldSlider
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          min={0}
          max={100000}
          step={100}
        />
      </div>

      {/* Sold Range */}
      <div className="mb-3">
        <label className="block text-xs text-slate-500 mb-1">
          عدد القطع المباعة
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minSold}
            onChange={(e) => {
              const v = e.target.value;
              setMinSold(v);
              updateFiltersInUrl({ min_sold: v });
            }}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="من"
          />
          <span className="text-xs text-slate-400">-</span>
          <input
            type="number"
            value={maxSold}
            onChange={(e) => {
              const v = e.target.value;
              setMaxSold(v);
              updateFiltersInUrl({ max_sold: v });
            }}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="إلى"
          />
        </div>
      </div>

      {/* Sorting */}
      <div className="mb-1">
        <label className="block text-xs text-slate-500 mb-1">ترتيب حسب</label>
        <select
          value={sortValue}
          onChange={handleSortChange}
          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlPage = Number(searchParams.get("page") || "1");
  const initialPage = Number.isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  // 🧠 نقرأ من الـ URL كـ source of truth
  const [keyword, setKeyword] = useState(searchParams.get("keywords") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("date_from") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("date_to") || "");
  const [minSold, setMinSold] = useState(searchParams.get("min_sold") || "");
  const [maxSold, setMaxSold] = useState(searchParams.get("max_sold") || "");
  const topRef = useRef(null);

  // ✅ فئة واحدة فقط (category_id)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category_id") || ""
  );

  // ✅ قيمة السلايدر (نطاق السعر)
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("min_price")) || 0,
    Number(searchParams.get("max_price")) || 100000,
  ]);

  const [sortValue, setSortValue] = useState(() => {
    const sortBy = searchParams.get("sort_by") || "date";
    const sortOrder = searchParams.get("sort_order") || "desc";
    return `${sortBy}_${sortOrder}`;
  });

  // ✅ حالة فتح Drawer الفلاتر في الموبايل
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // 🎯 الفلاتر اللي هنبعتها للـ hook – مصدرها searchParams
  const filters = {
    keyword: searchParams.get("keywords") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    date_from: searchParams.get("date_from") || "",
    date_to: searchParams.get("date_to") || "",
    min_sold: searchParams.get("min_sold") || "",
    max_sold: searchParams.get("max_sold") || "",
    sort_by: searchParams.get("sort_by") || "date",
    sort_order: searchParams.get("sort_order") || "desc",
    category_id: searchParams.get("category_id") || "",
    page: initialPage,
    per_page: 20, // لو حابب تثبّت عدد العناصر
  };

  // 🛒 المنتجات
  const {
    products,
    pagination,
    loading: productsLoading,
    error: productsError,
  } = useProductsSearch(filters);

  const currentPage = pagination?.current_page || initialPage;
  const totalPages = pagination?.totalPages || 1;

  // 🧩 الفئات من الـ endpoint الخاص بها
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories(1, 50); // تقدر تغير per_page لو حابب

  // 🔧 helper لتحديث الـ URL على طول مع كل تغيير
  const updateFiltersInUrl = useCallback(
    (changes = {}) => {
      const params = new URLSearchParams(searchParams.toString());
  
      if ("keywords" in changes) {
        if (changes.keywords) params.set("keywords", changes.keywords);
        else params.delete("keywords");
      }
  
      if ("min_price" in changes) {
        if (changes.min_price || changes.min_price === 0)
          params.set("min_price", changes.min_price);
        else params.delete("min_price");
      }
  
      if ("max_price" in changes) {
        if (changes.max_price || changes.max_price === 0)
          params.set("max_price", changes.max_price);
        else params.delete("max_price");
      }
  
      if ("date_from" in changes) {
        if (changes.date_from) params.set("date_from", changes.date_from);
        else params.delete("date_from");
      }
  
      if ("date_to" in changes) {
        if (changes.date_to) params.set("date_to", changes.date_to);
        else params.delete("date_to");
      }
  
      if ("min_sold" in changes) {
        if (changes.min_sold) params.set("min_sold", changes.min_sold);
        else params.delete("min_sold");
      }
  
      if ("max_sold" in changes) {
        if (changes.max_sold) params.set("max_sold", changes.max_sold);
        else params.delete("max_sold");
      }
  
      if ("category_id" in changes) {
        if (changes.category_id) params.set("category_id", changes.category_id);
        else params.delete("category_id");
      }
  
      if ("sort_by" in changes) {
        params.set("sort_by", changes.sort_by || "date");
      }
  
      if ("sort_order" in changes) {
        params.set("sort_order", changes.sort_order || "desc");
      }
  
      const shouldScrollToTop = changes.__scrollToTop === true;
  
      if ("page" in changes) {
        const p = Number(changes.page) || 1;
        if (p > 1) params.set("page", String(p));
        else params.delete("page");
      } else {
        params.delete("page");
      }
  
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
  
      if (shouldScrollToTop) {
        requestAnimationFrame(() => {
          topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    },
    [searchParams, router, pathname]
  );
  

  // ✅ debounce لفلترة السعر فقط
  const debouncedUpdatePrice = useDebouncedCallback(
    (min, max) => {
      setMinPrice(String(min));
      setMaxPrice(String(max));
      updateFiltersInUrl({
        min_price: min,
        max_price: max,
      });
    },
    400 // ms
  );

  // ✅ debounce للبحث بالكلمة
  const debouncedUpdateKeyword = useDebouncedCallback(
    (value) => {
      updateFiltersInUrl({ keywords: value });
    },
    400 // ms
  );

  // ⏫ sync بين الـ URL وبين الفورم لما الـ URL يتغيّر (back/forward مثلاً)
  useEffect(() => {
    setKeyword(searchParams.get("keywords") || "");
    setMinPrice(searchParams.get("min_price") || "");
    setMaxPrice(searchParams.get("max_price") || "");
    setDateFrom(searchParams.get("date_from") || "");
    setDateTo(searchParams.get("date_to") || "");
    setMinSold(searchParams.get("min_sold") || "");
    setMaxSold(searchParams.get("max_sold") || "");

    const sortBy = searchParams.get("sort_by") || "date";
    const sortOrder = searchParams.get("sort_order") || "desc";
    setSortValue(`${sortBy}_${sortOrder}`);

    setSelectedCategory(searchParams.get("category_id") || "");

    // sync السلايدر مع الـ URL
    setPriceRange([
      Number(searchParams.get("min_price")) || 0,
      Number(searchParams.get("max_price")) || 100000,
    ]);
  }, [searchParams]);

  // ✅ تغيير الفئة (radio)
  const handleCategoryChange = (id) => {
    const newId = id ? String(id) : "";
    setSelectedCategory(newId);
    updateFiltersInUrl({ category_id: newId });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortValue(value);
    const [sort_by, sort_order] = value.split("_");
    updateFiltersInUrl({ sort_by, sort_order });
  };

  // ✅ تغيير السلايدر مع debounce
  const handlePriceRangeChange = (newValue) => {
    setPriceRange(newValue); // تحديث الـ UI فورًا
    const [min, max] = newValue;
    debouncedUpdatePrice(min, max); // API بعد ما المستخدم يثبت إيده شوية
  };

  // ✅ التنقل بين الصفحات
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    updateFiltersInUrl({ page, __scrollToTop: true });
  };
  const loading = productsLoading;
  const error = productsError || categoriesError;

  return (
    <div ref={topRef} className="container mx-auto px-4 md:px-10 py-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-slate-800">
        المنتجات
      </h1>

      {/* زر فتح الفلاتر في الموبايل */}
      <div className="md:hidden mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white shadow-sm active:scale-[0.98]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>تصفية و فرز</span>
        </button>

        {pagination?.total && (
          <span className="text-[11px] text-slate-500">
            إجمالي المنتجات: {pagination.total}
          </span>
        )}
      </div>

      {/* Drawer الفلاتر للموبايل */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-999999 flex md:hidden">
          {/* الخلفية الداكنة */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* لوحة الفلاتر */}
          <div className="relative ml-auto h-full w-full max-w-xs bg-white shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                الفلترة و الفرز
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 w-8 h-8 text-slate-500 hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <FiltersContent
                keyword={keyword}
                setKeyword={setKeyword}
                debouncedUpdateKeyword={debouncedUpdateKeyword}
                categories={categories}
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                handlePriceRangeChange={handlePriceRangeChange}
                minSold={minSold}
                setMinSold={setMinSold}
                maxSold={maxSold}
                setMaxSold={setMaxSold}
                updateFiltersInUrl={updateFiltersInUrl}
                sortValue={sortValue}
                handleSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row-reverse gap-6">
        {/* 🛒 Products List */}
        <main className="flex-1">
          {loading && (
            <div className="py-10 text-center text-slate-500">
              جاري تحميل المنتجات...
            </div>
          )}

          {error && (
            <div className="py-4 text-center text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && products?.length === 0 && (
            <div className="py-10 text-center text-slate-500 text-sm">
              لا توجد منتجات مطابقة للفلاتر الحالية.
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {products?.map((product) => (
              <ProductCard
                product={product}
                key={product.product_id || product.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-full border text-xs md:text-sm ${
                  currentPage === 1
                    ? "border-slate-200 text-slate-300 cursor-not-allowed"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                السابق
              </button>

              {/* أرقام بسيطة حول الصفحة الحالية */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // نظهر: أول صفحة، آخر صفحة، و 2 قبل/بعد الحالية
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
                        <span className="px-1 text-slate-400">…</span>
                      )}
                      <button
                        onClick={() => goToPage(p)}
                        className={`mx-0.5 px-3 py-1 rounded-full border text-xs md:text-sm ${
                          p === currentPage
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-full border text-xs md:text-sm ${
                  currentPage === totalPages
                    ? "border-slate-200 text-slate-300 cursor-not-allowed"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                التالي
              </button>
            </div>
          )}
        </main>

        {/* 🧱 Sidebar الفلاتر لسطح المكتب / التابلت */}
        <aside className="hidden max-h-[calc(100vh-100px)] overflow-auto md:block w-full md:w-72 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:sticky md:top-20 h-fit">
          <h2 className="text-base font-semibold mb-3 text-slate-800">
            الفلترة و الفرز
          </h2>
          <FiltersContent
            keyword={keyword}
            setKeyword={setKeyword}
            debouncedUpdateKeyword={debouncedUpdateKeyword}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            handlePriceRangeChange={handlePriceRangeChange}
            minSold={minSold}
            setMinSold={setMinSold}
            maxSold={maxSold}
            setMaxSold={setMaxSold}
            updateFiltersInUrl={updateFiltersInUrl}
            sortValue={sortValue}
            handleSortChange={handleSortChange}
          />
        </aside>
      </div>
    </div>
  );
}
