"use client";

import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

export function FieldSlider({ value, onValueChange, min = 0, max = 100000, step = 100 }) {
  return (
    <div className="w-full" dir="rtl">
      <Field>
        <FieldTitle>نطاق السعر</FieldTitle>
        <FieldDescription className="text-xs">
          الميزانية الحالية: من{" "}
          <span className="font-medium tabular-nums">
            {value[0].toLocaleString("ar-EG")}
          </span>{" "}
          إلى{" "}
          <span className="font-medium tabular-nums">
            {value[1].toLocaleString("ar-EG")}
          </span>{" "}
          جنيه.
        </FieldDescription>
        <div className="mt-3">
          <Slider
            value={value}
            onValueChange={onValueChange}
            max={max}
            min={min}
            step={step}
            className="w-full"
            aria-label="Price Range"
          />
          <div className="flex justify-between mt-1 text-[11px] text-slate-500">
            <span>{max.toLocaleString("ar-EG")} ج</span>
            <span>{min.toLocaleString("ar-EG")} ج</span>
          </div>
        </div>
      </Field>
    </div>
  );
}
