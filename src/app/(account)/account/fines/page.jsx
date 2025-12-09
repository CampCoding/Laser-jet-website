"use client";
import React from "react";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

export default function FinePage() {

  const { data, status, error } = useSelector((state) => state.transactions);

  const fines = data?.data?.fines
  console.log("transactionsdata", data);


  if (status === "loading") return <div>جاري تحميل المعاملات...</div>;
  if (status === "failed") return <div>خطأ: {error}</div>;
  if (!data || !data.data || !fines.length) return <div>لا توجد بيانات معاملات.</div>;






  return (
    <div className="p-6  mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800">الغرامات</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100 text-gray-700 font-bold">
            <tr>
              <th className="p-3">الوصف</th>
              <th className="p-3">المبلغ</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">قبل الغرامة</th>
              <th className="p-3">بعد الغرامة</th>
              <th className="p-3">اسم المستخدم</th>
              <th className="p-3">رقم الهاتف</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr
                key={fine.transaction_date + fine.amount}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{fine.description}</td>
                <td className="p-3 font-bold text-red-600">
                  {fine.amount} جنيه
                </td>
                <td className="p-3">{fine.transaction_date}</td>
                <td className="p-3">{fine.balance_before}</td>
                <td className="p-3">{fine.balance_after}</td>
                <td className="p-3">{fine.user?.name}</td>
                <td className="p-3">{fine.user?.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
