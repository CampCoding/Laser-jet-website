"use client";

import { useState, useEffect } from "react";
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

// ✅ التحقق (Validation Schema)
const formSchema = z.object({
  phone: z
    .string()
    .min(11, "رقم الهاتف يجب أن يحتوي على 11 رقمًا")
    .regex(/^01[0-9]{9}$/, "رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا"),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    console.log("Reset password request:", values);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-t md:bg-gradient-to-r from-blue-600 to-gray-50 px-4">
      
      {/* العنوان يظهر من اليمين للشمال */}
      <div
        data-aos="fade-left"
        className="hidden md:flex flex-col justify-center items-center w-[400px] h-[400px]"
      >
        <h1 className="text-6xl font-extrabold text-blue-700 drop-shadow-md tracking-wide">
          Laserjet
        </h1>
        <p className="text-gray-600 mt-2 text-4xl font-bold">Store</p>
      </div>

      {/* الفورم يظهر من الأسفل للأعلى */}
      <div
        data-aos="fade-up"
        className="w-full max-w-xl shadow-md border bg-white rounded-2xl mt-6 md:mt-0 md:ml-10 z-10"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              استعادة كلمة المرور
            </CardTitle>
            <p className="text-gray-500 text-sm mt-2">
              أدخل رقم الهاتف المسجل وسنرسل لك تعليمات لإعادة تعيين كلمة المرور
            </p>
          </CardHeader>

          <CardContent>
            {!sent ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 text-right"
                >
                  {/* رقم الهاتف */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            type="tel"
                            className="text-right"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-3xl mt-4 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
                  </Button>

                  <div className="text-center text-sm text-gray-600 mt-4">
                    تذكّرت كلمة المرور؟{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      تسجيل الدخول
                    </a>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-green-600 mb-2">
                  ✅ تم الإرسال بنجاح!
                </h2>
                <p className="text-gray-600 text-sm">
                  تحقق من الرسائل على رقم هاتفك لاستكمال عملية إعادة التعيين.
                </p>
                <a
                  href="/login"
                  className="inline-block mt-6 text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                >
                  العودة لتسجيل الدخول
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
