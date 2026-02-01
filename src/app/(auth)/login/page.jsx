"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import AOS from "aos";
import "aos/dist/aos.css";
import { Eye, EyeOff } from "lucide-react";
import { useAuthRedirect } from "../../../providers/AuthShell";

// =====================
// ✅ Validation Schema
// =====================
const formSchema = z.object({
  phone: z
    .string()
    .min(11, "رقم الهاتف يجب أن يحتوي على 11 رقمًا")
    .regex(/^01[0-9]{9}$/, "رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// =====================
// 🚀 Login Page
// =====================
export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const redirect = useAuthRedirect();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  // =====================
  // 🔥 Redirect if logged in
  // =====================
  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      router.push("/"); // لو عامل لوجين يروح للهوم
    }
  }, [session, status, router]);

  // =====================
  // 📌 Handle submit
  // =====================
  const onSubmit = async (values) => {
    setLoading(true);
    setErrorMsg("");

    const res = await signIn("credentials", {
      phone: values.phone,
      password: values.password,
      redirect: false,          // ✅ مهم جدًا (يمنع الـ reload/redirect)
      callbackUrl: redirect || "/",
    });

    setLoading(false);

    if (!res) {
      setErrorMsg("حدث خطأ غير متوقع");
      return;
    }
  
    if (res.error) {
      setErrorMsg("رقم الهاتف أو كلمة المرور غير صحيحة");
      return;                   // ✅ مفيش أي redirect هنا
    }
  
    // ✅ نجاح: روح للـ url اللي رجعه NextAuth أو للهوم
    router.push(res.url || "/");
  };

  // =====================
  // 🎬 Init AOS
  // =====================
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  // =====================
  // ⏳ Loading state (optional)
  // =====================
  if (status === "loading") {
    return (
      <p className="mt-20 text-center text-xl text-gray-700">جار التحميل...</p>
    );
  }

  // لو فيه سيشن مش هيعرض الفورم (هيعمل ريندر لحظة ويمشي للريكدايركت)
  if (session) return null;

  // =====================
  // 🎨 Responsive UI (JSX)
  // =====================
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-600/10 via-blue-50 to-white px-4 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-10 md:grid md:grid-cols-2">
        {/* اللوغو الجانبي - يظهر فقط من md وطالع */}
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

        {/* الفورم */}
        <div
          data-aos="fade-up"
          className="flex w-full items-center justify-center"
        >
          <Card className="w-full max-w-md rounded-2xl border border-blue-50 bg-white/95 shadow-lg">
            <CardHeader className="py-5 text-center">
              {/* لوجو صغير يظهر فقط على الموبايل */}
              <div className="mb-2 flex justify-center md:hidden">
                <img
                  src="/logo2.png"
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <CardTitle className="text-2xl font-bold text-gray-800">
                تسجيل الدخول
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-6 pt-0 sm:px-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 text-right"
                >
                  {/* phone */}
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

                  {/* password */}
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
                              className="text-right pr-3"
                              {...field}
                            />

                            {/* زرار إظهار / إخفاء الباسورد */}
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
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

                  {/* forgot password */}
                  <div className="mt-[-4px] text-left">
                    <Link
                      href={"/forgot-password"}
                      className="text-sm text-blue-600 transition-all duration-200 hover:text-blue-800 hover:underline"
                    >
                      هل نسيت كلمة المرور؟
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full cursor-pointer rounded-3xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                </form>
              </Form>

              {errorMsg && (
                <p className="mt-3 text-center text-sm text-red-600">
                  {errorMsg}
                </p>
              )}

              {/* register link */}
              <div className="mt-5 text-center text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
