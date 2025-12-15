"use client";

import {
  ChevronLeft,
  LocateFixed,
  SquarePen,
  Trash2,
  MapPin,
  Plus,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Modal } from "antd";
import AddAddressModal from "../../../components/AddAddressModal";
import useAddresses from "../../../../../hooks/useGetAddresses";
import EditAddressModal from "../../../components/EditAddressModal";

function AddressSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm p-5 animate-pulse border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-2.5 w-14 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>

      <div className="h-3 w-full bg-gray-200 rounded mb-2" />
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-4" />

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function AddressListApp() {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  const {
    addresses,
    loading,
    error,
    fetchAddresses,
    deleteAddress,
    updateAddress,
    addAddress,
  } = useAddresses(accessToken);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [selectedAddressEdit, setSelectedAddressEdit] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newAddress, setNewAddress] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [addressType, setAddressType] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // 🔄 loading خاص بزر العنوان الأساسي
  const [primaryUpdatingId, setPrimaryUpdatingId] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchAddresses();
    }
  }, [accessToken, fetchAddresses]);

  const handleUpdateAddress = async () => {
    if (!selectedAddressEdit) return;
    await updateAddress(selectedAddressEdit);
    setEditModalOpen(false);
  };

  const handleAddAddress = async () => {
    await addAddress({
      alias: addressType,
      details: newAddress,
      longitude,
      latitude,
      region_id: governorate,
    });

    setAddModalOpen(false);
    setAddressType("");
    setGovernorate("");
    setNewAddress("");
    setLatitude(null);
    setLongitude(null);
  };

  // 🔘 تعيين / إلغاء العنوان الأساسي – يرسل فقط is_primary للـ API
  const handleTogglePrimary = async (address) => {
    const currentlyPrimary = Number(address.is_primary) === 1;
    const newPrimaryValue = !currentlyPrimary; // true لو كان 0 والعكس

    setPrimaryUpdatingId(address.id);
    try {
      await updateAddress({
        id: address.id,
        is_primary: newPrimaryValue, // ✅ فقط true/false كما طلبت
      });
    } finally {
      setPrimaryUpdatingId(null);
    }
  };

  const totalAddresses = addresses?.length || 0;
  const primaryCount = useMemo(
    () => addresses?.filter((a) => Number(a.is_primary) === 1).length || 0,
    [addresses]
  );

  const getAliasBadge = (alias) => {
    if (alias === "المنزل") {
      return {
        label: "المنزل",
        className: "bg-blue-50 text-blue-700 border-blue-100",
      };
    }
    if (alias === "العمل") {
      return {
        label: "العمل",
        className: "bg-amber-50 text-amber-700 border-amber-100",
      };
    }
    return {
      label: alias || "عنوان",
      className: "bg-gray-50 text-gray-700 border-gray-100",
    };
  };

  return (
    <main
      className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-100"
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10 space-y-6 lg:space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 cursor-pointer hover:bg-blue-50 rounded-full transition-colors border border-transparent hover:border-blue-100"
              >
                <ChevronLeft className="w-6 h-6 transform rotate-180 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  عناويني
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  إدارة عناوين التوصيل الخاصة بك، إضافة عناوين جديدة وتعديل
                  العناوين الحالية بسهولة.
                </p>
              </div>
            </div>

            {/* Small stats chip */}
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-full bg-white border border-gray-100 text-gray-600 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>الإجمالي: {totalAddresses}</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white border border-gray-100 text-gray-600 shadow-sm">
                العناوين الأساسية: {primaryCount}
              </div>
            </div>
          </div>

          {/* Top actions */}
          <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
            {error && !loading && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-2 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div className="flex-1" />

            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 px-4 rounded-full shadow-md shadow-blue-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عنوان جديد</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 pb-10">
          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {[...Array(3)].map((_, i) => (
                <AddressSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && addresses.length === 0 && (
            <div className="mt-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                <MapPin className="w-9 h-9 text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                لا يوجد عناوين حتى الآن
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                أضف أول عنوان لك لتسهيل عملية الشحن والتوصيل.
              </p>
              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 px-5 rounded-full shadow-md shadow-blue-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة عنوان جديد</span>
              </button>
            </div>
          )}

          {/* Address cards */}
          {!loading && addresses.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {addresses.map((address, index) => {
                const aliasBadge = getAliasBadge(address.alias);
                const isPrimary = Number(address.is_primary) === 1;
                const isPrimaryLoading = primaryUpdatingId === address.id;

                return (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                    className="relative bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
                  >
                    {/* Subtle top gradient bar */}
                    <div className="h-1 w-full bg-gradient-to-l from-blue-500 via-sky-400 to-cyan-400" />

                    <div className="p-5 space-y-3">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            <LocateFixed className="w-5 h-5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <h2 className="text-base font-bold text-gray-900">
                                {address.details?.slice(0, 40) ||
                                  address.alias ||
                                  "عنوان"}
                              </h2>
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border ${aliasBadge.className}`}
                              >
                                {aliasBadge.label}
                              </span>
                            </div>

                            {address.region?.region_title && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                <span>
                                  المنطقة: {address.region.region_title}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        {isPrimary && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            العنوان الأساسي
                          </span>
                        )}
                      </div>

                      {/* Full details */}
                      <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3">
                        {address.details ||
                          "لا توجد تفاصيل متاحة لهذا العنوان."}
                      </p>

                      {/* Coords row */}
                      {(address.latitude || address.longitude) && (
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 pt-2 border-t border-dashed border-gray-100">
                          <span className="font-medium text-gray-600">
                            الإحداثيات:
                          </span>
                          {address.latitude && (
                            <span className="font-mono">
                              Lat: {address.latitude}
                            </span>
                          )}
                          {address.longitude && (
                            <span className="font-mono">
                              Lng: {address.longitude}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions bar */}
                    <div className="px-5 pb-4 pt-3 border-t border-gray-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setAddressToDelete(address.id);
                        }}
                        className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50/70 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف العنوان</span>
                      </button>

                      {/* زر العنوان الأساسي */}
                      <button
                        disabled={isPrimaryLoading}
                        onClick={() => handleTogglePrimary(address)}
                        className={`flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 rounded-full transition-colors border ${
                          isPrimary
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        } ${
                          isPrimaryLoading
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>
                          {isPrimaryLoading
                            ? "جارٍ التحديث..."
                            : isPrimary
                            ? "إلغاء كعنوان أساسي"
                            : "تعيين كعنوان أساسي"}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setEditModalOpen(true);
                          setSelectedAddressEdit(address);
                        }}
                        className="flex items-center gap-2 text-xs sm:text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-50/70 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <SquarePen className="w-4 h-4" />
                        <span>تعديل</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Add Address Modal */}
        <AddAddressModal
          loading={loading}
          isModalOpen={addModalOpen}
          setIsModalOpen={setAddModalOpen}
          addressType={addressType}
          setAddressType={setAddressType}
          governorate={governorate}
          setGovernorate={setGovernorate}
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          handleAddAddress={handleAddAddress}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
        />

        {/* Delete Modal */}
        <Modal
          open={deleteModalOpen}
          title="تأكيد الحذف"
          onCancel={() => setDeleteModalOpen(false)}
          okText="حذف"
          cancelText="إلغاء"
          okButtonProps={{ danger: true, loading: loading }}
          onOk={() => {
            deleteAddress(addressToDelete);
            setDeleteModalOpen(false);
          }}
        >
          <p className="text-sm text-gray-700">
            هل أنت متأكد أنك تريد حذف هذا العنوان؟
          </p>
        </Modal>

        {/* Edit Address Modal */}
        <EditAddressModal
          loading={loading}
          isModalOpen={editModalOpen}
          setIsModalOpen={setEditModalOpen}
          selectedAddress={selectedAddressEdit}
          onSave={async (updatedAddress) => {
            await updateAddress(updatedAddress);
            setEditModalOpen(false);
          }}
        />
      </div>
    </main>
  );
}
