"use client";

import { useState } from "react";
import { AddAddressModal } from "../_commponent/address/AddAddressModal";

// ده مثال من الريسبونس اللي بيوصلك من الـ API
const initialApiResponse = {
  success: true,
  message: "تم جلب العنوان بنجاح",
  data: {
    addresses: [
      {
        id: 126,
        user_id: 631,
        alias: "أخري",
        details: "اسوان",
        longitude: "0.000000",
        latitude: "0.000000",
        is_primary: 1,
        created_at: "2025-11-15T09:13:09.000Z",
        updated_at: "2025-11-15T09:13:11.000Z",
        region_id: 19,
        region: {
          region_price: 120,
          region_title: "أسوان",
        },
      },
    ],
  },
};

export default function AddressesPage() {

    const [addEditModal , setAddEditModal] = useState(false)


  const [addresses, setAddresses] = useState(
    initialApiResponse.data.addresses || []
  );

  const primaryAddress = addresses.find((a) => a.is_primary === 1);

  const handleSetPrimary = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_primary: addr.id === id ? 1 : 0,
      }))
    );
  };

  const handleDelete = (id) => {
    // هنا بعدين توصلها بـ API حقيقي
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleEdit = (addr) => {
    console.log("Edit address", addr);
    // افتح مودال/صفحة تعديل هنا حسب شغلك
  };

  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">عناوين الشحن</h1>
          <p className="mt-1 text-sm text-gray-500">
            يمكنك إدارة عناوين الشحن الخاصة بك واختيار العنوان الافتراضي لإتمام
            الطلبات بسهولة.
          </p>
        </div>

        <button
          type="button"
          className="rounded-full cursor-pointer hover:scale-105 transition-all bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          onClick={() => {
            // هنا هتفتح فورم إضافة عنوان جديد
            console.log("Add new address");
            setAddEditModal(true)
          }}
        >
          + إضافة عنوان جديد
        </button>
      </header>

      {/* لو مفيش عناوين */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
          لا توجد عناوين مسجلة حاليًا.
          <br />
          <span className="mt-2 inline-block">
            قم بإضافة أول عنوان شحن لك بالضغط على زر{" "}
            <span className="font-semibold">إضافة عنوان جديد</span>.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => {
            const isPrimary = addr.is_primary === 1;
            const regionTitle = addr.region?.region_title;
            const regionPrice = addr.region?.region_price;

            return (
              <div
                key={addr.id}
                className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                  isPrimary ? "border-emerald-500" : "border-gray-200"
                }`}
              >
                {/* بيانات العنوان */}
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">
                      {addr.alias || "عنوان بدون اسم"}
                    </h2>
                    {isPrimary && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                        العنوان الافتراضي
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-800">
                    {addr.details}
                    {regionTitle ? `، ${regionTitle}` : ""}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-600">
                    {regionPrice != null && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">
                        رسوم الشحن:{" "}
                        <span className="font-semibold">
                          {regionPrice} جنيه
                        </span>
                      </span>
                    )}
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">
                      رقم العنوان: {addr.id}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">
                      المنطقة رقم: {addr.region_id}
                    </span>
                  </div>
                </div>

                {/* الأكشنز */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(addr.id)}
                      className="rounded-full border border-emerald-500 px-3 py-1.5 font-semibold text-emerald-600 hover:bg-emerald-50"
                    >
                      تعيين كعنوان افتراضي
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEdit(addr)}
                    className="rounded-full border border-gray-300 px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    تعديل
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="rounded-full border border-red-200 px-3 py-1.5 font-semibold text-red-600 hover:bg-red-50"
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* لو فيه عنوان افتراضي، نعرضه بشكل ملخص تحت */}
      {primaryAddress && (
        <section className="mt-8 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="mb-1 font-semibold">العنوان الافتراضي الحالي:</p>
          <p>
            {primaryAddress.details}
            {primaryAddress.region?.region_title
              ? `، ${primaryAddress.region.region_title}`
              : ""}
          </p>
          {primaryAddress.region?.region_price != null && (
            <p className="mt-1 text-[13px]">
              رسوم الشحن المتوقعة:{" "}
              <span className="font-semibold">
                {primaryAddress.region.region_price} جنيه
              </span>
            </p>
          )}
        </section>
      )}
      <AddAddressModal open={addEditModal} setOpen={setAddEditModal} />
    </main>
  );
}

