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
  const { value } = useContext(MyContext); // 📌 رقم التليفون المستخدم في الخطوات السابقة
  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // 🔵 STATE واحدة فيها كل قيم الفورم
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
    phone: value || "", // ← مهم جداً
  });

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
    AOS.init({ duration: 800, once: true });

    if (!value) router.replace("/forgot-password");
  }, [value, router]);

  // 🔵 إرسال البيانات للباك
  const handleSubmitForm = async () => {
   
    setLoading(true);

    try {
      const res = await axios.put(
        "https://lesarjet.camp-coding.site/api/user/update",
        formData
      );

      console.log(res.data);

     toast("تم تغيير كلمة المرور بنجاح");
      router.push("/login");
    } catch (err) {
      console.log(err.response?.data);
     toast(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-t md:bg-gradient-to-r from-blue-600 to-gray-50 px-4 md:px-16 gap-8">
      
      <div className="hidden md:flex relative w-1/3 h-[250px] items-center justify-center">
        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
      </div>

      <div className="w-full md:w-2/3 max-w-2xl shadow-md border bg-white rounded-2xl z-10">
        <Card>
          <CardHeader className="text-center my-3">
            <CardTitle className="text-2xl font-bold text-gray-800">
              إعادة تعيين كلمة المرور
            </CardTitle>
            <p className="text-sm text-gray-500">من فضلك قم بإدخال كلمة المرور الجديدة</p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form className="space-y-4 text-right">

                {/* كلمة المرور الجديدة */}
               <FormField
  control={form.control}
  name="new_password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>كلمة المرور الجديدة</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type={showNewPassword ? "text" : "password"}
            className="text-right pr-10"
            placeholder="********"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              setFormData({ ...formData, new_password: e.target.value });
            }}
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
  name="confirm_password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>تأكيد كلمة المرور</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            className="text-right pr-10"
            placeholder="********"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              setFormData({ ...formData, confirm_password: e.target.value });
            }}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


                {/* زر الحفظ */}
                <Button
                  type="button"
                  onClick={form.handleSubmit(handleSubmitForm)}
                  disabled={loading}
                  className="w-full cursor-pointer rounded-3xl mt-4 bg-blue-600 text-white hover:bg-blue-700 my-3"
                >
                  {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
