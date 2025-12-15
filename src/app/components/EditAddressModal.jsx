"use client";

import dynamic from "next/dynamic";
import { Modal, Input, Select, Switch } from "antd";
import { useMemo, useEffect, useState } from "react";
import useGetDeliveryAreas from "../../../hooks/useGerDeliveryAreas";

const MapSelector = dynamic(() => import("./MapSelector"), { ssr: false });

export default function EditAddressModal({
  loading,
  isModalOpen,
  setIsModalOpen,
  selectedAddress,
  onSave,
}) {
  const [addressType, setAddressType] = useState("");
  const [governorate, setGovernorate] = useState(null);
  const [details, setDetails] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [locating, setLocating] = useState(false);
  console.log("selectedAddress" , selectedAddress );
  const { areas, fetchDliveryAreas } = useGetDeliveryAreas();

  // ✅ تحميل المحافظات مرة واحدة
  useEffect(() => {
    fetchDliveryAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ خيارات المحافظات من API (نفس Add)
  const govOptions = useMemo(
    () =>
      areas?.deliveryAreas?.map((g) => ({
        value: g.region_id,
        label: g.region_title,
      })) || [],
    [areas]
  );

  const selectedGov = useMemo(() => {
    return areas?.deliveryAreas?.find(
      (g) => g.region_id === Number(governorate)
    );
  }, [areas, governorate]);

  // ✅ عند فتح مودال التعديل: عبّي القيم من العنوان المختار
  useEffect(() => {
    if (!isModalOpen || !selectedAddress) return;

    setAddressType(selectedAddress.alias || "");
    setGovernorate(
      selectedAddress.region_id ? Number(selectedAddress.region_id) : null
    );
    setDetails(selectedAddress.details || "");
    setIsPrimary(Number(selectedAddress.is_primary) === 1);

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

  // ✅ نفس منطق Add: اختيار المحافظة يحدّث الإحداثيات إلى مركز المحافظة
  const onGovernorateChange = (value) => {
    const id = Number(value);
    setGovernorate(id);

    const gov = areas?.deliveryAreas?.find((g) => g.region_id === id);
    if (gov) {
      setLatitude(Number(gov.region_lat));
      setLongitude(Number(gov.region_lang));
    }
  };

  // 🔹 أقرب محافظة لإحداثيات معيّنة (approx)
  const getNearestGovernorateId = (lat, lng) => {
    if (lat == null || lng == null) return null;

    let nearestId = null;
    let minDist = Infinity;

    areas?.deliveryAreas?.forEach((g) => {
      const gLat = Number(g.region_lat);
      const gLng = Number(g.region_lang);

      if (Number.isNaN(gLat) || Number.isNaN(gLng)) return;

      const dLat = lat - gLat;
      const dLng = lng - gLng;
      const dist = dLat * dLat + dLng * dLng;

      if (dist < minDist) {
        minDist = dist;
        nearestId = g.region_id;
      }
    });

    return nearestId;
  };

  // ✅ نفس زر Add: موقعي الحالي
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

        const nearestId = getNearestGovernorateId(lat, lng);
        if (nearestId) setGovernorate(nearestId);

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

  // ✅ لو العنوان مفيهوش إحداثيات، جرّب يجيب الموقع تلقائيًا عند الفتح (مثل Add)
  useEffect(() => {
    if (!isModalOpen) return;
    if (latitude != null && longitude != null) return; // ما نبوّظش تعديل المستخدم

    requestCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const isFormValid =
    addressType && governorate && details?.trim() && latitude != null && longitude != null;

  const handleOk = () => {
    if (!selectedAddress || !isFormValid) return;

    const updatedAddress = {
      ...selectedAddress,
      alias: addressType,
      details: details.trim(),
      region_id: governorate,
      latitude,
      longitude,
      is_primary: isPrimary ? 1 : 0,
    };

    onSave(updatedAddress);
  };

  return (
    <Modal
      title={
        <div className="text-right w-full">
          <div className="text-lg font-bold">تعديل العنوان</div>
          <div className="text-xs text-gray-500 mt-1">
            تم ضبط الخريطة تلقائيًا على الموقع (إن أمكن)، ويمكنك تعديل العلامة أو البيانات بحرية.
          </div>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => setIsModalOpen(false)}
      okText="حفظ التغييرات"
      cancelText="إلغاء"
      width={780}
      okButtonProps={{
        disabled: !isFormValid,
        loading: loading,
      }}
      centered
    >
      {!selectedAddress ? (
        <p className="text-base text-gray-500 text-center py-6">
          لا يوجد عنوان محدد للتعديل.
        </p>
      ) : (
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
                عند تغيير المحافظة سيتم نقل الخريطة لمركز المحافظة تلقائيًا.
              </p>
            </div>
          </div>

          {/* عنوان أساسي (اختياري) - بنفس هدوء ستايل Add */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="text-sm">
              <div className="font-medium">تعيين كعنوان أساسي</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                سيتم اختياره تلقائيًا عند الطلب
              </div>
            </div>
            <Switch checked={isPrimary} onChange={setIsPrimary} />
          </div>

          {/* خريطة اختيار الموقع */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-sm">
                اختر موقع العنوان على الخريطة <span className="text-red-500">*</span>
              </label>
              {selectedGov && (
                <span className="text-xs text-gray-500">
                  المحافظة الحالية:{" "}
                  <span className="font-semibold">{selectedGov.region_title}</span>
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
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={250}
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

          {/* تنبيه بسيط لو ناقص */}
          {!isFormValid && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs md:text-sm text-amber-800">
                ⚠️ يرجى ملء كل الحقول المطلوبة وتحديد الموقع على الخريطة.
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
