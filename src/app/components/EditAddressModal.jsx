"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Modal, Input, Select } from "antd";
import { governoratesData } from "./AddAddressModal"; // ⚠️ عدّل المسار حسب مشروعك

// خريطة (client-only)
const MapSelector = dynamic(() => import("./MapSelector"), { ssr: false });

export default function EditAddressModal({
  loading,
  isModalOpen,
  setIsModalOpen,
  selectedAddress, // العنوان المراد تعديله
  onSave, // function(updatedAddress)
}) {
  const [addressType, setAddressType] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [details, setDetails] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locating, setLocating] = useState(false);

  // تجهيز البيانات من العنوان الحالي عند فتح المودال
  useEffect(() => {
    if (!isModalOpen || !selectedAddress) return;

    setAddressType(selectedAddress.alias || "");
    setGovernorate(selectedAddress.region_id || "");
    setDetails(selectedAddress.details || "");

    const lat =
      selectedAddress.latitude !== null &&
      selectedAddress.latitude !== undefined &&
      selectedAddress.latitude !== ""
        ? Number(selectedAddress.latitude)
        : null;

    const lng =
      selectedAddress.longitude !== null &&
      selectedAddress.longitude !== undefined &&
      selectedAddress.longitude !== ""
        ? Number(selectedAddress.longitude)
        : null;

    setLatitude(isNaN(lat) ? null : lat);
    setLongitude(isNaN(lng) ? null : lng);
  }, [isModalOpen, selectedAddress]);

  const govOptions = useMemo(
    () => governoratesData.map((g) => ({ value: g.id, label: g.name })),
    []
  );

  const selectedGov = useMemo(
    () => governoratesData.find((g) => g.id === Number(governorate)),
    [governorate]
  );

  const onGovernorateChange = (value) => {
    const id = Number(value);
    setGovernorate(id);
    const gov = governoratesData.find((g) => g.id === id);
    if (gov) {
      // لو مفيش إحداثيات، خليك على مركز المحافظة
      if (latitude == null && longitude == null) {
        setLatitude(gov.lat);
        setLongitude(gov.lng);
      }
    }
  };

  // 🔍 أقرب محافظة لإحداثيات معينة
  const getNearestGovernorateId = (lat, lng) => {
    if (lat == null || lng == null) return null;

    let nearestId = null;
    let minDist = Infinity;

    governoratesData.forEach((g) => {
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

  // طلب الموقع الحالي (استخدامه من الزر أو كديفولت لو مفيش إحداثيات)
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

        // لو مفيش محافظة مختارة نحاول نختار الأقرب
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

  // ديفولت: لو العنوان ماعندوش إحداثيات، حاول نجيب موقع المستخدم عند فتح المودال
  useEffect(() => {
    if (!isModalOpen) return;
    if (latitude != null && longitude != null) return; // لو الإحداثيات موجودة من العنوان ما نغيّرهاش
    requestCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const isFormValid = addressType && governorate && details?.trim();

  const handleOk = () => {
    if (!selectedAddress || !isFormValid) return;

    const updatedAddress = {
      ...selectedAddress,
      alias: addressType,
      details,
      region_id: governorate,
      latitude,
      longitude,
    };

    onSave(updatedAddress);
  };

  return (
    <Modal
      loading={loading}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleOk}
      okText="حفظ التغييرات"
      cancelText="إلغاء"
      width={780}
      okButtonProps={{ disabled: !isFormValid }}
      title={
        <div className="text-right w-full">
          <div className="text-lg font-bold">تعديل العنوان</div>
          <div className="text-xs text-gray-500 mt-1">
            عدّل نوع العنوان، المحافظة، وموقعه على الخريطة ثم احفظ التغييرات.
          </div>
        </div>
      }
    >
      {!selectedAddress ? (
        <p className="text-sm text-gray-500">لا يوجد عنوان محدد للتعديل.</p>
      ) : (
        <div className="space-y-4" dir="rtl">
          {/* نوع العنوان + المحافظة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* نوع العنوان */}
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
            </div>

            {/* المحافظة */}
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
              {selectedGov && (
                <p className="text-[11px] text-gray-400 mt-1">
                  المحافظة الحالية:{" "}
                  <span className="font-semibold">{selectedGov.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* الخريطة + زر موقعي الحالي */}
          <div className="mt-1">
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-sm">
                حدّث موقع العنوان على الخريطة
              </label>

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
            </div>

            <div className="mt-1 mb-3 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              <div style={{ height: "300px", width: "100%" }}>
                <MapSelector
                  latitude={latitude}
                  longitude={longitude}
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-xs md:text-sm flex flex-wrap gap-3 justify-between">
              <div>
                <p className="text-gray-600">
                  <b>خط العرض (Latitude):</b>{" "}
                  <span className="font-mono">
                    {latitude ?? "لم يتم التحديد بعد"}
                  </span>
                </p>
                <p className="text-gray-600">
                  <b>خط الطول (Longitude):</b>{" "}
                  <span className="font-mono">
                    {longitude ?? "لم يتم التحديد بعد"}
                  </span>
                </p>
              </div>
              <p className="text-gray-400 max-w-xs">
                يمكنك الضغط على الخريطة لتغيير موقع العنوان بدقة، أو استخدام
                زر موقعي الحالي لضبطه تلقائيًا.
              </p>
            </div>
          </div>

          {/* العنوان التفصيلي */}
          <div>
            <label className="font-medium text-sm block mb-1">
              العنوان بالتفصيل <span className="text-red-500">*</span>
            </label>
            <Input.TextArea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اكتب العنوان بشكل واضح ومفصل (الشارع، رقم العقار، الدور، العلامات المميزة...)"
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-[11px] text-gray-400">
                مثال: عمارة ١٥، الدور الثالث، شقة ٧، أمام مسجد كذا…
              </p>
              <span className="text-[11px] text-gray-400">
                {details?.length || 0} / 250
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
