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
import Image from "next/image";

// ✅ تعريف التحقق (Validation Schema)
const formSchema = z
  .object({
    fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    phone: z
      .string()
      .min(11, "رقم الهاتف يجب أن يحتوي على 11 رقمًا")
      .regex(/^01[0-9]{9}$/, "رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "يرجى تأكيد كلمة المرور"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);
  };

  // تهيئة AOS عند تحميل الكومبوننت
  useEffect(() => {
    AOS.init({
      duration: 800, // مدة الأنيميشن
      once: true,    // يظهر مرة واحدة فقط
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col  items-center justify-center bg-gradient-to-t md:bg-gradient-to-r from-blue-600 to-gray-50 px-4">
      
      {/* العنوان يظهر من اليمين للشمال */}
      <div
        data-aos="fade-left"
        className="flex flex-col justify-center items-center"
      >
      <div className=" relative w-[400px] h-[270px]">
<Image src="/logo.png" alt="Logo" fill />
      </div>
      </div>

      {/* الفورم يظهر من الأسفل للأعلى */}
      <div
        data-aos="fade-up"
        className="w-full max-w-2xl shadow-md border bg-white rounded-2xl mt-6 md:mt-0 md:ml-10 z-10"
      >
      
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              إنشاء حساب
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 text-right"
              >
                {/* الاسم الكامل */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="" className="text-right" {...field} />
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

                {/* كلمة المرور */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          type="password"
                          className="text-right"
                          {...field}
                        />
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
                        <Input
                          placeholder=""
                          type="password"
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
                  {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
