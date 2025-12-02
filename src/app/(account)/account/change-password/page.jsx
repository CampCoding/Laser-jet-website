"use client";

import { ChevronLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Spin } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Page initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600); // optional delay for smooth effect

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitForm = async () => {
    setLoading(true);

    const formData1 = new FormData();

    formData1.append("old_password", formData.old_password);
    formData1.append("password", formData.new_password);
    formData1.append("confirm_password", formData.confirm_password);
    let phone = session?.user?.phone || "";
    formData1.append("phone", phone);

    // formData1.append("phone", formData.phone);
    console.log(formData1);

    try {
      const res = await axios.put(
        "https://lesarjet.camp-coding.site/api/user/update",
        formData1,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      console.log(res);
      message.success("تم تغيير كلمة المرور بنجاح");
      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      form.resetFields();
    } catch (err) {
      console.log(err);
      message.error(err.response.data.message);
    }
    setLoading(false);
  };
  //Loading screen for page
  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4" dir="rtl">
      {/* HEADER */}
      <header className="flex flex-col gap-3 border-b border-gray-100 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-3 px-6">
          <button
            onClick={() => window.history.back()}
            className="p-2 cursor-pointer hover:bg-blue-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-8 h-8 transform rotate-180 text-blue-700" />
          </button>
          <h1 className="text-xl font-bold">تغيير كلمة المرور</h1>
        </div>
      </header>

      {/* CENTER FORM */}
      <div className="flex justify-center items-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className=" w-full flex justify-center items-center"
        >
          <Card className="w-full">
            <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
              {/* كلمة المرور القديمة */}
              <Form.Item
                label="كلمة المرور القديمة"
                name="old_password"
                rules={[
                  {
                    required: true,
                    message: "من فضلك أدخل كلمة المرور القديمة",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  onChange={(e) =>
                    setFormData({ ...formData, old_password: e.target.value })
                  }
                />
              </Form.Item>

              {/* كلمة المرور الجديدة */}
              <Form.Item
                label="كلمة المرور الجديدة"
                name="new_password"
                rules={[
                  {
                    required: true,
                    message: "من فضلك أدخل كلمة المرور الجديدة",
                  },
                  {
                    min: 6,
                    message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  onChange={(e) =>
                    setFormData({ ...formData, new_password: e.target.value })
                  }
                />
              </Form.Item>

              {/* تأكيد كلمة المرور الجديدة */}
              <Form.Item
                label="تأكيد كلمة المرور الجديدة"
                name="confirm_password"
                dependencies={["new_password"]}
                rules={[
                  {
                    required: true,
                    message: "من فضلك أكد كلمة المرور الجديدة",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("كلمة المرور غير متطابقة");
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                />
              </Form.Item>

              {/* زر التحديث */}
              <Button
                className="!bg-blue-700 !text-white hover:!bg-blue-600 mt-2"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                تغيير كلمة المرور
              </Button>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
