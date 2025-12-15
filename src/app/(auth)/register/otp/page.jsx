"use client";

import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MyContext } from "@/providers/OtpContext";
import Image from "next/image";
import axios from "axios"; // ✅ add

const formSchema = z.object({
  otp: z
    .string()
    .min(4, "كود التفعيل يجب أن يكون 4 أرقام على الأقل")
    .max(6, "كود التفعيل لا يزيد عن 6 أرقام")
    .regex(/^[0-9]+$/, "كود التفعيل يجب أن يحتوي على أرقام فقط"),
});

export default function OtpVerificationPage() {
  // ✅ افترض إن الـ context فيه phone كمان
  // مثال: { value, phone } أو { value, userPhone }
  const { value, phone } = useContext(MyContext);

  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value !== "تم جلب بياناتك بنجاح") {
      router.replace("/register");
    }
  }, [value, router]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const otpNumber = Number(values.otp);

      if (!phone) {
        // لو مش موجود في الكونتكست
        form.setError("otp", { type: "manual", message: "رقم الهاتف غير متوفر. ارجع لصفحة التسجيل." });
        return;
      }

      const url = `https://lesarjet.camp-coding.site/api/user/verify_code?phone=${encodeURIComponent(
        phone
      )}`;

      const res = await axios.put(
        url,
        { code: otpNumber },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // ✅ عدّل الشرط حسب شكل الـ response الحقيقي عندك
      // مثال شائع: res.data.status === true أو res.data.success === 1
      const ok =
        res?.data?.status === true ||
        res?.data?.success === true ||
        res?.data?.success === 1;

      if (ok) {
        // لو عندك خطوة بعدها (مثلاً login أو redirect)
        router.replace("/login"); // أو "/"
      } else {
        const msg =
          res?.data?.message ||
          "كود التفعيل غير صحيح. حاول مرة أخرى.";
        form.setError("otp", { type: "manual", message: msg });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "حدث خطأ أثناء التحقق من الكود.";
      form.setError("otp", { type: "manual", message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);

  if (status === "loading") {
    return <p className="text-center text-white text-xl mt-10">...جاري التحميل</p>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-t md:bg-gradient-to-r from-blue-600 to-gray-50 px-4 md:px-16 gap-8">
      <div className="hidden md:flex relative w-1/3 h-[250px] items-center justify-center">
        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
      </div>

      <div className="w-full md:w-2/3 max-w-2xl shadow-md border bg-white rounded-2xl z-10">
        <Card>
          <CardHeader className="text-center my-3">
            <CardTitle className="text-2xl font-bold text-gray-800">تأكيد رقم الهاتف</CardTitle>
            <p className="text-sm text-gray-500">أدخل كود التفعيل المرسل إليك عبر الرسائل القصيرة</p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كود التفعيل (OTP)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="XXXXXX"
                          className="text-center tracking-[0.4em] text-lg font-semibold"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                  <p>لم يصلك الكود بعد؟</p>
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => console.log("Resend OTP")}
                  >
                    إعادة إرسال الكود
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-3xl mt-4 bg-blue-600 text-white hover:bg-blue-700 my-3"
                >
                  {loading ? "جارٍ التحقق..." : "تأكيد الكود"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
