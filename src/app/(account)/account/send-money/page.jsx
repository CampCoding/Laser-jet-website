"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useSendMoney } from "../../../../../hooks/useSendMoney";

function AccountSendMoney() {
  const form = useForm({
    defaultValues: {
      balance: "",
      phone: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  // نجهّز الهوك مع callbacks للنجاح والخطأ
  const { sendMoney, isLoading } = useSendMoney({
    onSuccess: () => {
      toast.success("تم إرسال الأموال بنجاح");
      reset(); // تصفير الفورم بعد النجاح
    },
    onError: (err) => {
      toast.error(err?.message || "حدث خطأ أثناء إرسال الأموال");
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      balance: Number(data.balance),
      phone: data.phone.trim(),
    };

    console.log("Sending payload:", payload);

    try {
      await sendMoney(payload);
      // باقي اللوجيك في onSuccess داخل الهوك
    } catch (e) {
      // الخطأ تم التعامل معه في onError، ممكن تضيف أي شيء إضافي هنا لو حابب
      console.error("Send money error:", e);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 p-6"
        noValidate
      >
        {/* المبلغ */}
        <FormField
          control={control}
          name="balance"
          rules={{
            required: "قيمة المبلغ مطلوبة.",
            validate: (value) => {
              const num = Number(value);
              if (Number.isNaN(num)) return "الرجاء إدخال رقم صالح.";
              if (num < 1) return "الرجاء إدخال مبلغ أكبر من صفر.";
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <FormItem className="text-right">
              <FormLabel>المبلغ المراد إرساله</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step="0.01"
                  placeholder="أدخل المبلغ"
                  className={`text-right ${
                    fieldState.error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-input focus-visible:ring-primary"
                  }`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        {/* رقم الجوال */}
        <FormField
          control={control}
          name="phone"
          rules={{
            required: "رقم الجوال مطلوب.",
            minLength: {
              value: 10,
              message: "رقم الجوال يبدو قصيرًا.",
            },
          }}
          render={({ field, fieldState }) => (
            <FormItem className="text-right">
              <FormLabel>رقم الجوال</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="أدخل رقم الجوال"
                  className={`text-right ${
                    fieldState.error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-input focus-visible:ring-primary"
                  }`}
                  {...field}
                />
              </FormControl>
              {fieldState.error ? (
                <FormMessage className="text-xs text-red-500" />
              ) : null}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-blue-600 text-white w-full mt-2"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "جارٍ الإرسال..." : "إرسال الأموال"}
        </Button>
      </form>
    </Form>
  );
}

export default AccountSendMoney;
