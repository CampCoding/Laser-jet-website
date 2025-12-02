"use client";
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Send } from 'lucide-react';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { toast } from 'sonner';
export default function Page() {
  const [formData, setFormData] = useState({
    compliment_text: "",
    user_name: "",
    user_phone: "",
    user_email: "",
    national_id: ""
  });

  const [submitted, setSubmitted] = useState(false);
 
   const { data: session } = useSession();
  // Handle Submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      'https://lesarjet.camp-coding.site/api/compliment/create',
      formData,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    toast.success("تم إرسال الشكوى بنجاح");
     setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        subject: '',
        description: '',
        priority: 'medium'
      });
    }, 5000);

  } catch (err) {
    toast.error("حدث خطأ أثناء الإرسال" || err.response.data.message);
    console.log(err);
  }
};


  // SUBMITTED PAGE
   if (submitted) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes checkmark {
            0% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.2) rotate(180deg);
              opacity: 1;
            }
            100% {
              transform: scale(1) rotate(360deg);
              opacity: 1;
            }
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .slide-up {
            animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .checkmark-animate {
            animation: checkmark 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
          }
          .pulse-animate {
            animation: pulse 2s infinite;
          }
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: confetti 3s ease-out forwards;
          }
        `}</style>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center slide-up relative overflow-hidden">
          {/* Confetti Elements */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.3}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0'
              }}
            />
          ))}
          
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-animate shadow-lg">
            <CheckCircle className="w-12 h-12 text-white checkmark-animate" />
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-3">
            تم إرسال الشكوى بنجاح!
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            شكراً لتواصلك معنا. تم استلام شكواك وسيتم الرد عليك خلال 24-48 ساعة.
          </p>
          
         
          
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  category: '',
                  subject: '',
                  description: '',
                  priority: 'medium'
                });
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105"
            >
              إرسال شكوى جديدة
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen py-3 px-4" dir="rtl">
      <div className="w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className=" bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 px-8 py-5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">إرسال شكوى</h1>
                <p className="text-blue-100 mt-1 text-lg">نقدّر ملاحظاتك وسنعمل على حل مشكلتك في أسرع وقت</p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">

              {/* USER NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={(e)=>{
                    setFormData({...formData, user_name: e.target.value});
                  }}
                  className={`w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-blue-500 transition`}
                  placeholder="أدخل اسمك الكامل"
                />
               
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                 onChange={(e)=>{
                  setFormData({
                    ...formData,
                    user_email: e.target.value
                  })
                 }}
                  className={`w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-blue-500 transition`}
                  placeholder="example@email.com"
                />
                
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={(e)=>{
                    setFormData({
                      ...formData,
                      user_phone: e.target.value
                    })
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="مثال: 01000000000"
                />
              </div>

              {/* NATIONAL ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الرقم القومي
                </label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={(e)=>{
                    setFormData({
                      ...formData,
                      national_id: e.target.value
                    })
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="14 رقم"
                />
              </div>

              {/* COMPLAINT TEXT */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نص الشكوى <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="compliment_text"
                  value={formData.compliment_text}
                  onChange={(e)=>{
                    setFormData({
                      ...formData,
                     compliment_text: e.target.value
                    })
                  }}
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg border  focus:ring-2 focus:ring-blue-500 transition resize-none`}
                  placeholder="أدخل تفاصيل الشكوى هنا..."
                />
               
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-5 h-5" />
                إرسال الشكوى
              </button>

            </div>
          </form>

          {/* FOOTER */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              سيتم مراجعة الشكوى خلال 24–48 ساعة. ستصلك التحديثات عبر البريد الإلكتروني.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
