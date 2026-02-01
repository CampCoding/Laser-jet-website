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
import { useDispatch } from "react-redux";
import { fetchProfile } from "../../../../store/profileSlice";
import { Send, Smartphone, Wallet } from "lucide-react";
import { getTransactionsThunk } from "../../../../store/transactionsSlice";

function AccountSendMoney() {
  const dispatch = useDispatch();

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

  const { sendMoney, isLoading } = useSendMoney({
    onSuccess: () => {
      toast.success("تم إرسال الأموال بنجاح");
      dispatch(fetchProfile());
      dispatch(getTransactionsThunk({}));
      reset();
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
    } catch (e) {
      console.error("Send money error:", e);
    }
  };

  const isBusy = isSubmitting || isLoading;

  return (
    <div className="w-full px-4">
      <div className="max-w-5xl mx-auto ">
        <div className="bg-white rounded-3xl  p-6 md:p-8">
          {/* خلفية خفيفة على الديسكتوب */}
          <div className="absolute -left-24 top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none hidden md:block" />
          <div className="absolute -right-24 -bottom-10 w-52 h-52 bg-cyan-50 rounded-full blur-3xl opacity-60 pointer-events-none hidden md:block" />

          <div className="">
            {/* الهيدر */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-right">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  إرسال الأموال
                </h2>
                <p className="mt-1 text-xs md:text-sm text-slate-500">
                  أدخل المبلغ ورقم الجوال لتحويل رصيد من محفظتك إلى مستخدم آخر.
                </p>
              </div>

              <div className="flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
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
                      <FormLabel className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-800">
                        <span>المبلغ المراد إرساله</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            step="0.01"
                            placeholder="أدخل المبلغ"
                            className={`text-right text-sm md:text-base ${
                              fieldState.error
                                ? "border-red-500 focus-visible:ring-red-500"
                                : "border-slate-200 focus-visible:ring-blue-500"
                            }`}
                            {...field}
                          />
                          <span className="px-3 py-2 text-xs md:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                            جنيه
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
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
                      <FormLabel className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-800">
                        <span>رقم الجوال المستفيد</span>
                        <Smartphone className="w-4 h-4 text-slate-400" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="أدخل رقم الجوال (مثال: 01XXXXXXXXX)"
                          className={`text-right text-sm md:text-base ${
                            fieldState.error
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "border-slate-200 focus-visible:ring-blue-500"
                          }`}
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      )}
                    </FormItem>
                  )}
                />

                {/* ملاحظة صغيرة */}
                <p className="text-[11px] md:text-xs text-slate-500 text-right bg-slate-50/80 border border-dashed border-slate-200 rounded-xl px-3 py-2">
                  تأكد من صحة رقم الجوال قبل الإرسال، لا يمكن التراجع عن عملية
                  التحويل بعد تأكيدها.
                </p>

                {/* زر الإرسال */}
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-2 cursor-pointer rounded-full text-sm md:text-base py-2.5 flex items-center justify-center gap-2"
                  disabled={isBusy}
                >
                  {isBusy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent" />
                      <span>جارٍ الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال الأموال</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSendMoney;
