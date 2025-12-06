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
  FormDescription,
} from "@/components/ui/form";
import DepsitEndpoint from "../../../../CallAcountAPi/DepositApi";

// لو عندك دالة API جاهزة استوردها هنا
// import DepsitEndpoint from "@/lib/DepsitEndpoint";

function DepositInput() {
  const form = useForm({
    defaultValues: {
      depositAmount: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async(data) => {
    const num = Number(data.depositAmount);

    // استدعاء الـ API
    await DepsitEndpoint({
      price: num,
    });
    console.log("Deposit value:", num);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2 p-10"
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
              <FormLabel htmlFor="depositAmount" className="block">
                مبلغ الإيداع
              </FormLabel>

              <FormControl>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder="أدخل مبلغ الإيداع"
                  min={1}
                  step="0.01"
                  className={`text-right ${
                    fieldState.error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-input focus-visible:ring-primary"
                  }`}
                  aria-invalid={!!fieldState.error}
                  aria-describedby="depositAmount-help"
                  {...field}
                />
              </FormControl>

              {fieldState.error ? (
                <FormMessage className="text-xs text-red-500">
                  {fieldState.error.message}
                </FormMessage>
              ) : (
                <FormDescription
                  id="depositAmount-help"
                  className="text-xs text-muted-foreground"
                >
                  الرجاء إدخال المبلغ المراد إيداعه.
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <Button
          className="bg-blue-600 text-white w-full mt-2"
          type="submit"
          disabled={isSubmitting}
        >
          تأكيد الإيداع
        </Button>
      </form>
    </Form>
  );
}

export default DepositInput;
