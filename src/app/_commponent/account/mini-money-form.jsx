"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- Schema بعد حذف النوع ---------------- */
const UserFormSchema = z.object({
  full_name: z.string().min(3, "الاسم قصير جدًا"),
  national_id: z.string().length(14, "الرقم القومي يجب أن يكون 14 رقم"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  address_in_card: z.string().min(5, "العنوان قصير جدًا"),
  current_address: z.string().min(5, "العنوان الحالي قصير"),
  job: z.string().min(2, "الوظيفة قصيرة"),
  salary: z
    .string()
    .refine((val) => !isNaN(val), "يجب أن يكون رقم")
    .transform((val) => Number(val)),
  insurance_status: z.enum(["insured", "not_insured"], {
    required_error: "اختار حالة التأمين",
  }),
  birthday: z.string().min(1, "اختر تاريخ الميلاد"),
  images: z.any(),
  docs: z.any(),
});

export default function MiniMoneyForm() {
  const form = useForm({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      full_name: "",
      national_id: "",
      email: "",
      address_in_card: "",
      current_address: "",
      job: "",
      salary: "",
      insurance_status: undefined,
      birthday: "",
      images: [],
      docs: [],
    },
  });

  const onSubmit = (values) => {
    console.log("FORM DATA:", values);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">
        تسجيل بيانات العميل
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* full_name */}
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <Input className="h-11" placeholder="اكتب الاسم بالكامل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* national_id */}
          <FormField
            control={form.control}
            name="national_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الرقم القومي</FormLabel>
                <FormControl>
                  <Input className="h-11" maxLength={14} placeholder="14 رقم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input className="h-11" placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* address_in_card */}
          <FormField
            control={form.control}
            name="address_in_card"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان في البطاقة</FormLabel>
                <FormControl>
                  <Input className="h-11" placeholder="العنوان كما في البطاقة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* current_address */}
          <FormField
            control={form.control}
            name="current_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان الحالي</FormLabel>
                <FormControl>
                  <Input className="h-11" placeholder="العنوان الحالي" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* job */}
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوظيفة</FormLabel>
                <FormControl>
                  <Input className="h-11" placeholder="الوظيفة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* salary */}
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المرتب</FormLabel>
                <FormControl>
                  <Input type="number" className="h-11" placeholder="المرتب الشهري" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* insurance_status */}
          <FormField
            control={form.control}
            name="insurance_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حالة التأمين</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="insured">مؤمن عليه</SelectItem>
                    <SelectItem value="not_insured">غير مؤمن</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* birthday */}
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تاريخ الميلاد</FormLabel>
                <FormControl>
                  <Input type="date" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الصور</FormLabel>
                <FormControl>
                  <Input
                    className="h-11"
                    type="file"
                    multiple
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* docs */}
          <FormField
            control={form.control}
            name="docs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المستندات</FormLabel>
                <FormControl>
                  <Input
                    className="h-11"
                    type="file"
                    multiple
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 text-lg">
            إرسال البيانات
          </Button>
        </form>
      </Form>
    </div>
  );
}