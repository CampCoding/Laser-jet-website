"use client";

import React, { useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { useDeposit } from "../../../../../hooks/useDepsoite";

function DepositInput() {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const form = useForm({
    defaultValues: {
      depositAmount: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  // استخدام الهوك مع callbacks
  const { deposit, isLoading } = useDeposit({
    onSuccess: () => {
      setSubmitSuccess("تم تنفيذ عملية الإيداع بنجاح ✅");
      setSubmitError(null);
      reset({ depositAmount: "" });
    },
    onError: () => {
      setSubmitError(
        "حدث خطأ أثناء تنفيذ عملية الإيداع، برجاء المحاولة مرة أخرى."
      );
      setSubmitSuccess(null);
    },
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const num = Number(data.depositAmount);

    try {
      await deposit({
        price: num, // نفس الـ key اللي كنت تبعته لـ DepsitEndpoint
      });

      // الباقي (النجاح) بيتنّفذ داخل onSuccess في الهوك
      console.log("Deposit value:", num);
    } catch (err) {
      console.error("Deposit error:", err);
      // onError بتظبط رسالة الواجهة، هنا بس log إضافي
    }
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-5xl mx-auto ">
      <div className="bg-white rounded-3xl  p-6 md:p-8">
          <div className="mb-5 text-right">
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              إيداع رصيد في المحفظة
            </h2>
            <p className="mt-1 text-xs md:text-sm text-slate-500">
              أدخل مبلغ الإيداع المطلوب، وسيتم إضافته إلى رصيد محفظتك بعد تأكيد
              العملية.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={control}
                name="depositAmount"
                rules={{
                  required: "قيمة الإيداع مطلوبة.",
                  validate: (value) => {
                    if (value === "" || value == null) {
                      return "قيمة الإيداع مطلوبة.";
                    }

                    const num = Number(value);

                    if (Number.isNaN(num)) {
                      return "الرجاء إدخال رقم صالح.";
                    }

                    if (num < 1) {
                      return "الرجاء إدخال مبلغ إيداع أكبر من صفر.";
                    }

                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="text-right">
                    <FormLabel
                      htmlFor="depositAmount"
                      className="block text-sm font-semibold text-slate-800 mb-1"
                    >
                      مبلغ الإيداع
                    </FormLabel>

                    <FormControl>
                      <Input
                        id="depositAmount"
                        type="number"
                        placeholder="أدخل مبلغ الإيداع"
                        min={1}
                        step="0.01"
                        className={`text-right text-sm md:text-base ${
                          fieldState.error
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-slate-200 focus-visible:ring-blue-500"
                        }`}
                        aria-invalid={!!fieldState.error}
                        aria-describedby="depositAmount-help"
                        {...field}
                      />
                    </FormControl>

                    {fieldState.error ? (
                      <FormMessage className="text-xs text-red-500 mt-1">
                        {fieldState.error.message}
                      </FormMessage>
                    ) : (
                      <FormDescription
                        id="depositAmount-help"
                        className="text-[11px] md:text-xs text-slate-500 mt-1"
                      >
                        الرجاء إدخال المبلغ المراد إيداعه بالجنيه المصري.
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-2 rounded-full text-sm md:text-base py-2.5"
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading
                  ? "جارٍ تنفيذ الإيداع..."
                  : "تأكيد الإيداع"}
              </Button>
            </form>
          </Form>

          {/* رسائل النجاح / الخطأ */}
          {submitSuccess && (
            <div className="mt-4 text-xs md:text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2 text-right">
              {submitSuccess}
            </div>
          )}

          {submitError && (
            <div className="mt-4 text-xs md:text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2 text-right">
              {submitError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepositInput;
