"use client";

import dynamic from "next/dynamic";
import { Modal, Input, Select } from "antd";
import { useMemo, useEffect, useState } from "react";
import useGetDeliveryAreas from "../../../hooks/useGerDeliveryAreas";

// dynamic import للخريطة (client-only)
const MapSelector = dynamic(() => import("./MapSelector"), { ssr: false });

// بيانات المحافظات + إحداثيات تقريبية
export const governoratesData = [
  { id: 1, name: "القاهرة", lat: 30.0444, lng: 31.2357 },
  { id: 2, name: "الجيزة", lat: 29.987, lng: 31.2118 },
  { id: 3, name: "الإسكندرية", lat: 31.2001, lng: 29.9187 },
  { id: 4, name: "الدقهلية", lat: 31.0409, lng: 31.3785 },
  { id: 5, name: "الشرقية", lat: 30.732, lng: 31.7147 },
  { id: 6, name: "الغربية", lat: 30.8754, lng: 31.0335 },
  { id: 7, name: "القليوبية", lat: 30.4206, lng: 31.192 },
  { id: 8, name: "المنوفية", lat: 30.5972, lng: 30.9876 },
  { id: 9, name: "البحيرة", lat: 30.848, lng: 30.3436 },
  { id: 10, name: "كفر الشيخ", lat: 31.1107, lng: 30.9401 },
  { id: 11, name: "الفيوم", lat: 29.3084, lng: 30.8428 },
  { id: 12, name: "بني سويف", lat: 29.0661, lng: 31.0994 },
  { id: 13, name: "المنيا", lat: 28.0934, lng: 30.7618 },
  { id: 14, name: "أسيوط", lat: 27.1828, lng: 31.182 },
  { id: 15, name: "سوهاج", lat: 26.554, lng: 31.6948 },
  { id: 16, name: "قنا", lat: 26.1551, lng: 32.716 },
  { id: 17, name: "الأقصر", lat: 25.6872, lng: 32.6396 },
  { id: 18, name: "أسوان", lat: 24.0889, lng: 32.8998 },
  { id: 19, name: "الوادي الجديد", lat: 25.592, lng: 28.8966 },
  { id: 20, name: "البحر الأحمر", lat: 27.2579, lng: 33.8116 },
  { id: 21, name: "مرسى مطروح", lat: 31.3543, lng: 27.2373 },
  { id: 22, name: "الإسماعيلية", lat: 30.5965, lng: 32.2715 },
  { id: 23, name: "السويس", lat: 29.9668, lng: 32.5498 },
  { id: 24, name: "بورسعيد", lat: 31.2565, lng: 32.2841 },
  { id: 25, name: "دمياط", lat: 31.4165, lng: 31.8133 },
  { id: 26, name: "شمال سيناء", lat: 31.132, lng: 33.7984 },
  { id: 27, name: "جنوب سيناء", lat: 28.2416, lng: 34.215 },
];

export default function AddAddressModal({
  isModalOpen,
  setIsModalOpen,
  addressType,
  setAddressType,
  governorate,
  setGovernorate,
  newAddress,
  setNewAddress,
  handleAddAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  loading,
}) {
  const [locating, setLocating] = useState(false);
  const {
    areas,
    loading: areasLoading,
    error,
    fetchDliveryAreas,
    setAreas,
  } = useGetDeliveryAreas();
  // خيارات المحافظات
  const govOptions = useMemo(
    () =>
      areas?.deliveryAreas?.map((g) => ({
        value: g.region_id,
        label: g.region_title,
      })),
    [areas]
  );

  const selectedGov = useMemo(
    () => areas?.deliveryAreas?.find((g) => g.region_id === Number(governorate)),
    [governorate]
  );


  const onGovernorateChange = (value) => {
    const id = Number(value);
    setGovernorate(id);
  
    // استخدم find بدل filter[0]
    const gov = areas?.deliveryAreas?.find((g) => g.region_id === id);
    console.log("gov:", gov);
  
    if (gov) {
      // تأكد إنك بتحول لنوع Number لو هتستخدمهم في خريطة
      setLatitude(Number(gov.region_lat));
      setLongitude(Number(gov.region_lang)); // ✅ مش region_id
    }
  };
  

  // 🔹 حساب أقرب محافظة لإحداثيات معيّنة (approx)
  const getNearestGovernorateId = (lat, lng) => {
    if (lat == null || lng == null) return null;

    let nearestId = null;
    let minDist = Infinity;

    areas?.deliveryAreas?.forEach((g) => {
      const dLat = lat - g.lat;
      const dLng = lng - g.lng;
      const dist = dLat * dLat + dLng * dLng;
      if (dist < minDist) {
        minDist = dist;
        nearestId = g.id;
      }
    });

    return nearestId;
  };

  // 🔁 دالة عامة نستخدمها في الـ useEffect والزر
  const requestCurrentLocation = () => {
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        if (!governorate) {
          const nearestId = getNearestGovernorateId(lat, lng);
          if (nearestId) {
            setGovernorate(nearestId);
          }
        }

        setLocating(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // ✅ خلي الموقع الحالي هو الديفولت عند فتح المودال لأول مرة
  useEffect(() => {
    if (!isModalOpen) return;

    // لو الإحداثيات متظبطة قبل كده (user عدلها)، ما نغيرهاش
    if (latitude != null && longitude != null) return;

    requestCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const isFormValid = addressType && governorate && newAddress?.trim();

  useEffect(() => {
    fetchDliveryAreas();
  }, []);

  return (
    <Modal
      title={
        <div className="text-right w-full">
          <div className="text-lg font-bold">إضافة عنوان جديد</div>
          <div className="text-xs text-gray-500 mt-1">
            تم ضبط الخريطة تلقائيًا على موقعك الحالي إن أمكن، ويمكنك تعديل
            العلامة أو العنوان بحرية.
          </div>
        </div>
      }
      open={isModalOpen}
      onOk={handleAddAddress}
      onCancel={() => setIsModalOpen(false)}
      okText="حفظ العنوان"
      cancelText="إلغاء"
      width={780}
      okButtonProps={{
        disabled: !isFormValid,
        loading: loading,
      }}
      centered
    >
      <div className="space-y-4" dir="rtl">
        {/* نوع العنوان + المحافظة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-sm block mb-1">
              نوع العنوان <span className="text-red-500">*</span>
            </label>
            <Select
              className="w-full"
              placeholder="اختر نوع العنوان"
              value={addressType || undefined}
              onChange={setAddressType}
              options={[
                { label: "المنزل", value: "المنزل" },
                { label: "العمل", value: "العمل" },
                { label: "آخر", value: "آخر" },
              ]}
            />
            <p className="text-[11px] text-gray-400 mt-1">
              مثال: المنزل، شقة الأهل، مقر العمل…
            </p>
          </div>

          <div>
            <label className="font-medium text-sm block mb-1">
              المحافظة <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="اختر المحافظة"
              className="w-full"
              value={governorate || undefined}
              onChange={onGovernorateChange}
              options={govOptions}
              showSearch
              optionFilterProp="label"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              إذا تم التعرف على موقعك الحالي، نحاول اختيار أقرب محافظة تلقائيًا،
              ويمكنك تعديلها يدويًا.
            </p>
          </div>
        </div>

        {/* خريطة اختيار الموقع */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <label className="font-medium text-sm">
              اختر موقعك على الخريطة
            </label>
            {selectedGov && (
              <span className="text-xs text-gray-500">
                المحافظة الحالية:{" "}
                <span className="font-semibold">{selectedGov.name}</span>
              </span>
            )}
          </div>

          <div className="mt-1 mb-2 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            <div style={{ height: "320px", width: "100%" }}>
              <MapSelector
                latitude={latitude}
                longitude={longitude}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
              />
            </div>
          </div>

          {/* زر الانتقال إلى موقعي الحالي */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={locating}
              className={`text-xs md:text-sm px-3 py-1.5 rounded-full border ${
                locating
                  ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
                  : "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
              } transition-colors`}
            >
              {locating ? "جارِ تحديد موقعك..." : "الانتقال إلى موقعي الحالي"}
            </button>

            <div className="bg-gray-50 p-2 rounded-lg text-xs md:text-sm flex flex-col md:flex-row md:items-center gap-2">
              <p className="text-gray-600">
                <b>خط العرض:</b>{" "}
                <span className="font-mono">{latitude ?? "غير محدد"}</span>
              </p>
              <p className="text-gray-600">
                <b>خط الطول:</b>{" "}
                <span className="font-mono">{longitude ?? "غير محدد"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* العنوان التفصيلي */}
        <div>
          <label className="font-medium text-sm block mb-1">
            العنوان بالتفصيل <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            rows={3}
            placeholder="اكتب العنوان بالتفصيل (رقم العقار، الشارع، العلامات المميزة...)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-[11px] text-gray-400">
              مثال: عمارة ١٥، الدور الثالث، شقة ٧، أمام مسجد كذا…
            </p>
            <span className="text-[11px] text-gray-400">
              {newAddress?.length || 0} / 250
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
