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

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setErrorMsg("رقم الهاتف أو كلمة المرور غير صحيحة");
      return;
    }

    if (res?.ok) {
      router.push("/");
    }
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
    return <p className="text-center mt-20 text-xl">جار التحميل...</p>;
  }

  // لو فيه سيشن مش هيعرض الفورم (هيعمل ريندر لحظة ويمشي للريكدايركت)
  if (session) return null;

  // =====================
  // 🎨 UI
  // =====================
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-t md:bg-gradient-to-r from-blue-600 to-gray-50 px-4">
      {/* اللوغو الجانبي */}
      <div
        data-aos="fade-left"
        className="hidden md:flex flex-col justify-center items-center w-[400px] h-[400px]"
      >
        <h1 className="text-6xl font-extrabold text-blue-700 drop-shadow-md tracking-wide">
          Laserjet
        </h1>
        <p className="text-gray-600 mt-2 text-4xl font-bold">Store</p>
      </div>

      {/* الفورم */}
      <div
        data-aos="fade-up"
        className="w-full max-w-xl shadow-md border bg-white rounded-2xl mt-6 md:mt-0 md:ml-10 z-10"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              تسجيل الدخول
            </CardTitle>
          </CardHeader>

          <CardContent>
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
                        <Input type="tel" className="text-right" {...field} />
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
                        <Input type="password" className="text-right" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* forgot password */}
                <div className="text-left mt-[-8px]">
                  <Link
                    href={"/forgot-password"}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                  >
                    هل نسيت كلمة المرور؟
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-3xl mt-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </Form>

            {errorMsg && (
              <p className="text-red-600 text-sm text-center mt-2">{errorMsg}</p>
            )}

            {/* register link */}
            <div className="text-center text-sm text-gray-600 mt-4">
              ليس لديك حساب؟{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                إنشاء حساب جديد
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
