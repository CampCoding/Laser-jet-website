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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MyContext } from "@/providers/OtpContext";
import Image from "next/image";

// ✅ Schema for OTP validation
const formSchema = z.object({
  otp: z
    .string()
    .min(4, "كود التفعيل يجب أن يكون 4 أرقام على الأقل")
    .max(6, "كود التفعيل لا يزيد عن 6 أرقام")
    .regex(/^[0-9]+$/, "كود التفعيل يجب أن يحتوي على أرقام فقط"),
});

export default function OtpVerificationPage() {
  const { value } = useContext(MyContext);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ⛔ حماية الصفحة بالـ Context value
  useEffect(() => {
    if (value !== "تم جلب بياناتك بنجاح") {
      router.replace("/register");
    }
  }, [value, router]);

  // ⛔ حماية الصفحة بالـ session
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // لو مسجل دخول، يروح على الهوم
    }
  }, [status, router]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("OTP:", values.otp);
      // هنا تحط API للتحقق من OTP
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
      {/* الفورم على الشمال */}
      <div className="w-full md:w-2/3 max-w-2xl shadow-md border bg-white rounded-2xl z-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">تأكيد رقم الهاتف</CardTitle>
            <p className="text-sm text-gray-500">أدخل كود التفعيل المرسل إليك عبر الرسائل القصيرة</p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right">
                {/* OTP */}
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

                {/* إعادة ارسال */}
                <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                  <p>لم يصلك الكود بعد؟</p>
                  <button type="button" className="text-blue-600 hover:underline" onClick={() => console.log("Resend OTP")}>
                    إعادة إرسال الكود
                  </button>
                </div>

                <Button type="submit" disabled={loading} className="w-full cursor-pointer rounded-3xl mt-4 bg-blue-600 text-white hover:bg-blue-700">
                  {loading ? "جارٍ التحقق..." : "تأكيد الكود"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* الصورة على اليمين */}
    

    </div>
  );
}


