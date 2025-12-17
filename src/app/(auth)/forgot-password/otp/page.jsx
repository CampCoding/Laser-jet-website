"use client";

import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { MyContext } from "@/providers/OtpContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  otp: z
    .string()
    .min(4, "يجب إدخال 4 أرقام على الأقل")
    .max(6, "يجب ألا يزيد الكود عن 6 أرقام")
    .regex(/^[0-9]+$/, "الكود يجب أن يحتوي على أرقام فقط"),
});

export default function Page() {
  const { value } = useContext(MyContext); // رقم الهاتف من الكونتكست
  const router = useRouter();
  const [loading, setLoading] = useState(false);        // تحقق الكود
  const [resendLoading, setResendLoading] = useState(false); // إعادة الإرسال

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });

    // لو مفيش رقم في الكونتكست يرجع لصفحة forgot-password
    if (!value) {
      router.replace("/forgot-password");
    }
  }, [value, router]);

  const maskPhone = (phone) => {
    if (!phone || phone.length < 7) return phone;
    return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
  };

  // ✅ ارسال الكود للتحقق
  const onSubmit = async (values) => {
    if (!value) return;

    setLoading(true);

    try {
      const res = await axios.put(
        `https://lesarjet.camp-coding.site/api/user/verify_code`,
        {},
        {
          params: {
            phone: value,
            resetCode: values.otp,
            type: "reset",
          },
        }
      );

      if (res.data?.success === true) {
        toast.success("تم التحقق من الكود بنجاح");
        router.push("/reset-password");
      } else {
        toast.error(res.data?.message || "حدث خطأ في التحقق من الكود");
      }
    } catch (err) {
      const apiError =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "حدث خطأ غير متوقع";

      console.error("Verify Error:", apiError);
      toast.error(apiError);
    }

    setLoading(false);
  };

  // ✅ إعادة إرسال الكود فعليًا
  const handleResendOtp = async () => {
    if (!value) {
      toast.error("لا يوجد رقم هاتف مسجّل، حاول من جديد من صفحة استعادة كلمة المرور.");
      router.replace("/forgot-password");
      return;
    }

    setResendLoading(true);

    try {
      const response = await axios.get(
        `https://lesarjet.camp-coding.site/api/user/send_verify_code`,
        {
          params: {
            phone: value,
            type: "reset",
          },
        }
      );

      if (response.data?.success) {
        toast.success("تم إعادة إرسال كود التفعيل بنجاح");
      } else {
        toast.error(response.data?.message || "تعذر إعادة إرسال الكود");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "تعذر إعادة إرسال الكود، يرجى المحاولة لاحقًا";

      console.error("Resend OTP Error:", msg);
      toast.error(msg);
    }

    setResendLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-600/10 via-blue-50 to-white px-4 py-10">

<div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-10 md:grid md:grid-cols-2">
{/* 🔹 جزء اللوجو / البراند (يظهر على الشاشات المتوسطة فما فوق) */}
<div
          data-aos="fade-left"
          className="hidden h-full md:flex flex-col items-center justify-center"
        >
          <img
            src="/logo.png"
            className="w-40 sm:w-52 md:w-64 lg:w-72 max-w-full h-auto"
            alt="Logo"
          />
        </div>


        {/* 🔹 الفورم */}
        <div
          data-aos="fade-up"
          className="flex-1 w-full flex justify-center"
        >
          <Card className="w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-slate-100">
            <CardHeader className="text-center py-6 px-6 border-b border-slate-100">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                تأكيد كود التفعيل
              </CardTitle>
              <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed">
                تم إرسال كود التفعيل إلى رقم الهاتف المسجَّل لدينا.
                {value && (
                  <>
                    <br />
                    <span dir="ltr" className="font-semibold text-gray-700">
                      {maskPhone(value)}
                    </span>
                  </>
                )}
              </p>
            </CardHeader>

            <CardContent className="px-6 py-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5 text-right"
                >
                  {/* OTP */}
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          كود التفعيل (OTP)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="● ● ● ● ● ●"
                            className="text-center tracking-[0.4em] text-lg font-semibold h-11 rounded-2xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/\D/g, ""))
                            }
                          />
                        </FormControl>
                        <p className="text-[11px] text-gray-400 mt-1">
                          أدخل الكود المكوّن من 4 إلى 6 أرقام كما وصل إليك في رسالة SMS.
                        </p>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* إعادة الإرسال (شغّالة فعليًا) */}
                  <div className="flex flex-col items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <p>لم يصلك الكود بعد؟</p>
                    <button
                      type="button"
                      disabled={resendLoading}
                      className="text-blue-600 cursor-pointer hover:underline font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={handleResendOtp}
                    >
                      {resendLoading ? "جارٍ إعادة الإرسال..." : "إعادة إرسال الكود"}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-3xl mt-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base h-11"
                  >
                    {loading ? "جارٍ التحقق..." : "تأكيد الكود"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
