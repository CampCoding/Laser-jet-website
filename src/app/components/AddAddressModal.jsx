"use client";

import dynamic from "next/dynamic";
import { Modal, Input, Select } from "antd";
import { useMemo } from "react";

// dynamic import للخريطة (client-only)
const MapSelector = dynamic(() => import("./MapSelector"), { ssr: false });

// بيانات المحافظات + إحداثيات تقريبية
export const governoratesData = [
  { id: 1, name: "القاهرة", lat: 30.0444, lng: 31.2357 },
  { id: 2, name: "الجيزة", lat: 29.9870, lng: 31.2118 },
  { id: 3, name: "الإسكندرية", lat: 31.2001, lng: 29.9187 },
  { id: 4, name: "الدقهلية", lat: 31.0409, lng: 31.3785 },
  { id: 5, name: "الشرقية", lat: 30.7320, lng: 31.7147 },
  { id: 6, name: "الغربية", lat: 30.8754, lng: 31.0335 },
  { id: 7, name: "القليوبية", lat: 30.4206, lng: 31.1920 },
  { id: 8, name: "المنوفية", lat: 30.5972, lng: 30.9876 },
  { id: 9, name: "البحيرة", lat: 30.8480, lng: 30.3436 },
  { id: 10, name: "كفر الشيخ", lat: 31.1107, lng: 30.9401 },
  { id: 11, name: "الفيوم", lat: 29.3084, lng: 30.8428 },
  { id: 12, name: "بني سويف", lat: 29.0661, lng: 31.0994 },
  { id: 13, name: "المنيا", lat: 28.0934, lng: 30.7618 },
  { id: 14, name: "أسيوط", lat: 27.1828, lng: 31.1820 },
  { id: 15, name: "سوهاج", lat: 26.5540, lng: 31.6948 },
  { id: 16, name: "قنا", lat: 26.1551, lng: 32.7160 },
  { id: 17, name: "الأقصر", lat: 25.6872, lng: 32.6396 },
  { id: 18, name: "أسوان", lat: 24.0889, lng: 32.8998 },
  { id: 19, name: "الوادي الجديد", lat: 25.5920, lng: 28.8966 },
  { id: 20, name: "البحر الأحمر", lat: 27.2579, lng: 33.8116 },
  { id: 21, name: "مرسى مطروح", lat: 31.3543, lng: 27.2373 },
  { id: 22, name: "الإسماعيلية", lat: 30.5965, lng: 32.2715 },
  { id: 23, name: "السويس", lat: 29.9668, lng: 32.5498 },
  { id: 24, name: "بورسعيد", lat: 31.2565, lng: 32.2841 },
  { id: 25, name: "دمياط", lat: 31.4165, lng: 31.8133 },
  { id: 26, name: "شمال سيناء", lat: 31.1320, lng: 33.7984 },
  { id: 27, name: "جنوب سيناء", lat: 28.2416, lng: 34.2150 },
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
  setLongitude
}) {
  // نجهّز خيارات Select من البيانات
  const govOptions = useMemo(
    () => governoratesData.map(g => ({ value: g.id, label: g.name })),
    []
  );

  const onGovernorateChange = (value) => {
    const id = Number(value);
    setGovernorate(id);
    const gov = governoratesData.find(g => g.id === id);
    if (gov) {
      setLatitude(gov.lat);
      setLongitude(gov.lng);
    }
  };

  return (
    <Modal
      title="إضافة عنوان جديد"
      open={isModalOpen}
      onOk={handleAddAddress}
      onCancel={() => setIsModalOpen(false)}
      okText="حفظ"
      cancelText="إلغاء"
      width={720}
    >
      <label className="font-medium text-sm">نوع العنوان</label>
      <Select
        className="w-full mb-3 mt-1"
        placeholder="اختر نوع العنوان"
        value={addressType || undefined}
        onChange={setAddressType}
        options={[
          { label: "المنزل", value: "المنزل" },
          { label: "العمل", value: "العمل" },
          { label: "آخر", value: "آخر" }
        ]}
      />

      <label className="font-medium text-sm">المحافظة</label>
      <Select
        placeholder="اختر المحافظة"
        className="w-full mb-3"
        value={governorate || undefined}
        onChange={onGovernorateChange}
        options={govOptions}
        showSearch
      />

      <label className="font-medium text-sm">اختر موقعك على الخريطة</label>
      <div className="mt-2 mb-4" style={{ height: "320px", width: "100%" }}>
        <MapSelector
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
      </div>

      <div className="bg-gray-50 p-3 rounded-lg text-sm mb-3">
        <p><b>خط العرض (Latitude):</b> {latitude ?? "لم يتم التحديد"}</p>
        <p><b>خط الطول (Longitude):</b> {longitude ?? "لم يتم التحديد"}</p>
      </div>

      <label className="font-medium text-sm mt-3">العنوان بالتفصيل</label>
      <Input.TextArea
        rows={3}
        placeholder="اكتب العنوان بالتفصيل"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />
    </Modal>
  );
}
