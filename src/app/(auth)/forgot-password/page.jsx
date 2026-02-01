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
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast } from "sonner";
import { MyContext } from "../../../providers/OtpContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ✅ التحقق (Validation Schema)
const formSchema = z.object({
  phone: z
    .string()
    .min(11, "رقم الهاتف يجب أن يحتوي على 11 رقمًا")
    .regex(/^01[0-9]{9}$/, "رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا"),
});

export default function ForgotPasswordPage() {
  const { setValue } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://lesarjet.camp-coding.site/api/user/send_verify_code`,
        {
          params: {
            phone: values.phone,
            type: "reset",
          },
        }
      );

      if (response.data.success) {
        toast.success("تم إرسال رمز التحقق بنجاح");

        setValue(values.phone); // تخزين رقم الهاتف لاستخدامه في صفحة OTP
        setSent(true);

        router.push("/forgot-password/otp"); // الانتقال لصفحة إدخال الكود
      } else {
        toast.error(response.data.message || "حدث خطأ غير متوقع");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "تعذر إرسال رمز التحقق، يرجى المحاولة لاحقًا";

      toast.error(msg);
    }

    setLoading(false);
  };

  // تهيئة AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-600/10 via-blue-50 to-white px-4 py-10">

    <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-10 md:grid md:grid-cols-2">
    {/* 🔹 جزء اللوجو / البراند (يظهر على الشاشات المتوسطة فما فوق) */}
    <div
              data-aos="fade-left"
              className="hidden h-full md:flex flex-col items-center justify-center"
            >
              <img
                src="/logo2.png"
                className="w-40 sm:w-52 md:w-64 lg:w-72 max-w-full h-auto"
                alt="Logo"
              />
            </div>

        {/* 🔹 الفورم (مستجيب بالكامل لكل المقاسات) */}
        <div
          data-aos="fade-up"
          className="flex-1 w-full flex justify-center"
        >
          <Card className="w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-slate-100">
            <CardHeader className="text-center py-6 px-6 border-b border-slate-100">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                استعادة كلمة المرور
              </CardTitle>
              <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed">
                أدخل رقم الهاتف المسجَّل لدينا وسنرسل إليك رمز تحقق لإعادة
                تعيين كلمة المرور الخاصة بحسابك.
              </p>
            </CardHeader>

            <CardContent className="px-6 py-6">
              {!sent ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 text-right"
                  >
                    {/* رقم الهاتف */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            رقم الهاتف المسجَّل
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              inputMode="numeric"
                              placeholder="مثال: 01012345678"
                              className="text-right h-11 rounded-2xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-[11px] text-gray-400 mt-1">
                            تأكد أن الرقم يبدأ بـ 01 ويتكوّن من 11 رقمًا.
                          </p>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full cursor-pointer rounded-3xl mt-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base h-11"
                    >
                      {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
                    </Button>

                    <div className="text-center text-xs sm:text-sm text-gray-500 pt-2">
                      قد يستغرق وصول الرسالة القصيرة بضع لحظات. إذا لم تصلك،
                      تأكد من صحة رقم الهاتف وحاول مرة أخرى.
                    </div>

                    <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-700 pt-4 border-t border-slate-100 mt-4 pt-4">
                      <span>تذكّرت كلمة المرور؟</span>
                      <Link
                        href="/login"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                      >
                        تسجيل الدخول
                      </Link>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="text-center py-10 px-4">
                  <h2 className="text-xl font-semibold text-green-600 mb-2">
                    ✅ تم إرسال الرمز بنجاح!
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    تحقق من الرسائل على رقم هاتفك وأدخل رمز التحقق في الصفحة
                    التالية لاستكمال عملية إعادة تعيين كلمة المرور.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 hover:underline font-semibold text-sm"
                  >
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
