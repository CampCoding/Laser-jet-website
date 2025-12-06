"use client";

import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { MyContext } from "@/providers/OtpContext";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  otp: z.string().min(4).max(6).regex(/^[0-9]+$/),
});

export default function Page() { // ← مهم: default export
  const { value } = useContext(MyContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { otp: "" } });

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
    if (!value) router.replace("/forgot-password");
  }, [value, router]);

  const onSubmit = async (values) => {

  if (!value) return;
 console.log("Phone from context:", value);
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

  console.log("Response:", res.data);

  if (res.data?.success === true) {
    router.push("/reset-password");
  } else {
    console.log("API Error:", res.data.message); 
    toast.error(res.data.message || "حدث خطأ في التحقق");
  }

} catch (err) {
  const apiError =
    err.response?.data?.message ||   
    err.response?.data ||           
    err.message ||                  
    "حدث خطأ غير متوقع";

  console.error("Verify Error:", apiError);

  toast.error(apiError); // 👈 يظهر للمستخدم
}

  setLoading(false);
};


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
          <CardHeader className="text-center my-3">
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

                <Button type="submit" disabled={loading} className="w-full cursor-pointer rounded-3xl mt-4 bg-blue-600 text-white hover:bg-blue-700 my-3">
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
