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
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MyContext } from "@/providers/OtpContext";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// ✅ Validation Schema
const formSchema = z
  .object({
    username: z.string().min(3, "الاسم يجب أن يكون ٣ أحرف على الأقل"),
    phone: z
      .string()
      .min(11, "رقم الهاتف يجب أن يحتوي على 11 رقمًا")
      .regex(/^01[0-9]{9}$/, "رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون ٦ أحرف على الأقل"),
    confirmPassword: z.string().min(6, "يرجى تأكيد كلمة المرور"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const { setValue  , setPhone} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ⛔ Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);

    const newValues = { ...values };
    delete newValues.confirmPassword;

    try {
      const { data } = await axios.post(
        "https://lesarjet.camp-coding.site/api/user/create",
        newValues
      );

      setLoading(false);

      if (data?.success) {
        setValue("تم جلب بياناتك بنجاح");
        setPhone(values.phone);
        router.push("/register/otp");
      } else {
        toast.error(data?.message || "حدث خطأ غير متوقع");
      }
    } catch (error) {
      setLoading(false);

      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.message ||
        "حدث خطأ أثناء الاتصال بالسيرفر";

      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-600/10 via-blue-50 to-white px-4 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-8 md:grid md:grid-cols-2">
        {/* اللوجو الجانبي - يظهر فقط من md وطالع */}
        <div
          data-aos="fade-left"
          className="hidden h-full md:flex flex-col items-center justify-center"
        >
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
        </div>

        {/* الفورم */}
        <div
          data-aos="fade-up"
          className="flex w-full items-center justify-center"
        >
          <Card className="w-full max-w-xl rounded-2xl border border-blue-50 bg-white/95 shadow-lg">
            <CardHeader className="py-5 text-center">
              {/* لوجو صغير يظهر فقط على الموبايل */}
              <div className="mb-2 flex justify-center md:hidden">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <CardTitle className="text-2xl font-bold text-gray-800">
                إنشاء حساب
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-6 pt-0 sm:px-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 text-right"
                >
                  {/* الاسم */}
                  <FormField
                    
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input
                            className="text-right"
                            placeholder="اكتب اسمك الكامل"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* رقم الهاتف */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            inputMode="numeric"
                            className="text-right"
                            placeholder="01xxxxxxxxx"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* كلمة المرور */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="text-right pr-2"
                              {...field}
                            />

                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* تأكيد كلمة المرور */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تأكيد كلمة المرور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="text-right pr-2"
                              {...field}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="my-3 mt-4 w-full cursor-pointer rounded-3xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
                  </Button>
                </form>
              </Form>

              {/* ✅ لديك حساب بالفعل ؟ */}
              <div className="mt-2 text-center text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
