
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * props:
 *  - triggerLabel: نص الزر اللي يفتح المودال
 *  - onSave: callback(payload) => يرجع داتا العنوان
 *  - initialValues: لو بتمررها يبقى المودال في وضع تعديل
 *  - regions: [{ id, title, price }]
 */
export function AddAddressModal({
    open , setOpen,
  triggerLabel = "+ إضافة عنوان جديد",
  onSave,
  initialValues,
  regions = [],
}) {
//   const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    alias: "",
    details: "",
    longitude: "",
    latitude: "",
    region_id: "",
  });
  const [errors, setErrors] = useState({});

  // لما نفتح المودال مع initialValues (تعديل) نملي الفورم
  useEffect(() => {
    if (initialValues) {
      setForm({
        alias: initialValues.alias ?? "",
        details: initialValues.details ?? "",
        longitude:
          initialValues.longitude !== undefined &&
          initialValues.longitude !== null &&
          initialValues.longitude !== 0
            ? String(initialValues.longitude)
            : "",
        latitude:
          initialValues.latitude !== undefined &&
          initialValues.latitude !== null &&
          initialValues.latitude !== 0
            ? String(initialValues.latitude)
            : "",
        region_id:
          initialValues.region_id !== undefined &&
          initialValues.region_id !== null
            ? String(initialValues.region_id)
            : "",
      });
    } else {
      setForm({
        alias: "",
        details: "",
        longitude: "",
        latitude: "",
        region_id: "",
      });
    }
    setErrors({});
  }, [initialValues, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.alias.trim()) newErrors.alias = "اسم العنوان مطلوب";
    if (!form.details.trim()) newErrors.details = "تفاصيل العنوان مطلوبة";
    if (!form.region_id) newErrors.region_id = "اختر المنطقة";

    if (form.longitude && Number.isNaN(Number(form.longitude))) {
      newErrors.longitude = "خط الطول يجب أن يكون رقمًا";
    }
    if (form.latitude && Number.isNaN(Number(form.latitude))) {
      newErrors.latitude = "خط العرض يجب أن يكون رقمًا";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      alias: form.alias.trim(),
      details: form.details.trim(),
      longitude: form.longitude ? Number(form.longitude) : 0,
      latitude: form.latitude ? Number(form.latitude) : 0,
      region_id: Number(form.region_id),
    };

    if (onSave) {
      onSave(payload);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* الزر اللي بيفتح المودال */}

      <DialogContent dir="rtl" className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-right">
              {initialValues ? "تعديل العنوان" : "إضافة عنوان جديد"}
            </DialogTitle>
            <DialogDescription className="text-right">
              أدخل بيانات عنوان الشحن، ثم اضغط حفظ لحفظ العنوان في حسابك.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* alias */}
            <div className="grid gap-2 text-right">
              <Label htmlFor="alias">اسم العنوان</Label>
              <Input
                id="alias"
                name="alias"
                value={form.alias}
                onChange={handleChange}
                placeholder="مثال: المنزل، العمل"
              />
              {errors.alias && (
                <p className="text-xs text-red-500">{errors.alias}</p>
              )}
            </div>

            {/* details */}
            <div className="grid gap-2 text-right">
              <Label htmlFor="details">تفاصيل العنوان</Label>
              <textarea
                id="details"
                name="details"
                value={form.details}
                onChange={handleChange}
                rows={3}
                placeholder="مثال: طنطا، شارع سعيد، برج كذا، شقة كذا"
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              />
              {errors.details && (
                <p className="text-xs text-red-500">{errors.details}</p>
              )}
            </div>

            {/* region */}
            <div className="grid gap-2 text-right">
              <Label htmlFor="region_id">المنطقة / المدينة</Label>
              <select
                id="region_id"
                name="region_id"
                value={form.region_id}
                onChange={handleChange}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="">اختر المنطقة</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                    {r.price != null ? ` - شحن ${r.price} جنيه` : ""}
                  </option>
                ))}
              </select>
              {errors.region_id && (
                <p className="text-xs text-red-500">{errors.region_id}</p>
              )}
            </div>

            {/* longitude & latitude */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2 text-right">
                <Label htmlFor="longitude">
                  خط الطول{" "}
                  <span className="text-[11px] text-gray-400">(اختياري)</span>
                </Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.0000001"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="30.8105076"
                />
                {errors.longitude && (
                  <p className="text-xs text-red-500">
                    {errors.longitude}
                  </p>
                )}
              </div>

              <div className="grid gap-2 text-right">
                <Label htmlFor="latitude">
                  خط العرض{" "}
                  <span className="text-[11px] text-gray-400">(اختياري)</span>
                </Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.0000001"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="30.9999279"
                />
                {errors.latitude && (
                  <p className="text-xs text-red-500">
                    {errors.latitude}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                إلغاء
              </Button>
            </DialogClose>
            <Button type="submit">
              {initialValues ? "حفظ التعديل" : "حفظ العنوان"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}




