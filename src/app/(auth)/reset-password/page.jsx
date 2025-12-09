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
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// 🔵 ZOD VALIDATION
const formSchema = z
  .object({
    new_password: z.string().min(6, "يجب أن تكون كلمة المرور 6 أحرف على الأقل"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirm_password"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const { value } = useContext(MyContext); // 📌 رقم التليفون من الخطوات السابقة
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔵 REACT HOOK FORM
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });

    // لو مفيش رقم تليفون في الـ Context يرجّعه لأول خطوة
    if (!value) router.replace("/forgot-password");
  }, [value, router]);

  // 🔵 إرسال البيانات للباك
  const handleSubmitForm = async (values) => {
    if (!value) {
      toast.error(
        "لا يوجد رقم هاتف مسجّل، أعد المحاولة من صفحة استعادة كلمة المرور."
      );
      router.replace("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        phone: value,
        password: values.new_password,
      };

      const res = await axios.put(
        "https://lesarjet.camp-coding.site/api/user/update",
        payload
      );

      console.log(res.data);
      toast.success("تم تغيير كلمة المرور بنجاح");
      router.push("/login");
    } catch (err) {
      console.log(err?.response?.data);
      toast.error(err?.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    }

    setLoading(false);
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

        {/* 🔹 كارد الفورم */}
        <div data-aos="fade-up" className="flex-1 w-full flex justify-center">
          <Card className="w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-slate-100">
            <CardHeader className="text-center py-6 px-6 border-b border-slate-100">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                إعادة تعيين كلمة المرور
              </CardTitle>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                من فضلك قم بإدخال كلمة المرور الجديدة ثم تأكيدها.
              </p>
            </CardHeader>

            <CardContent className="px-6 py-6">
              <Form {...form}>
                <form
                  className="space-y-5 text-right"
                  onSubmit={form.handleSubmit(handleSubmitForm)}
                >
                  {/* كلمة المرور الجديدة */}
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          كلمة المرور الجديدة
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              className="text-right pr-10 h-11 rounded-2xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                              placeholder="********"
                              {...field}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword((prev) => !prev)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showNewPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <p className="text-[11px] text-gray-400 mt-1">
                          يفضّل استخدام مزيج من الحروف والأرقام والرموز لزيادة
                          الأمان.
                        </p>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* تأكيد كلمة المرور */}
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          تأكيد كلمة المرور
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="text-right pr-10 h-11 rounded-2xl border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                              placeholder="********"
                              {...field}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* زر الحفظ */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-3xl mt-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base h-11 my-1"
                  >
                    {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
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
