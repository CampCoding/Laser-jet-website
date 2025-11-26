"use client";
import GetTransactionsData from "@/CallAcountAPi/Gettransactions";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function InstallmentsTable() {
  const { data: session, status } = useSession();
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstallments() {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const data = await GetTransactionsData(session.user.id);
          // لو البيانات رجعت صح وخاصية installments موجودة
          if (data?.success && data?.data?.installments) {
            setInstallments(data.data.installments);
          } else {
            setInstallments([]);
          }
        } catch (error) {
          console.error("Error fetching installments:", error);
          setInstallments([]);
        } finally {
          setLoading(false);
        }
      } else {
        setInstallments([]);
        setLoading(false);
      }
    }

    fetchInstallments();
  }, [status, session]);

  if (loading) return <p>جاري تحميل الأقساط...</p>;
  if (!session) return <p>برجاء تسجيل الدخول لعرض الأقساط</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">الأقساط</h2>

      {installments.length === 0 ? (
        <p>لا توجد أقساط لعرضها</p>
      ) : (
        installments.map((inst) => (
          <div key={inst.installment_id} className="mb-6">
            <h3 className="font-semibold mb-2">
              {inst.product} - رقم الطلب: {inst.order_number}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full text-sm text-right">
                <thead className="bg-gray-100 text-gray-700 font-bold">
                  <tr>
                    <th className="p-3">القيمة</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">تاريخ الاستحقاق</th>
                    <th className="p-3">القسط</th>
                  </tr>
                </thead>
                <tbody>
                  {inst.details.map((part) => (
                    <tr key={part.part_id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-bold">{part.part_value} جنيه</td>
                      <td className={`p-3 font-semibold ${part.part_status === "paid" ? "text-green-600" : "text-red-600"}`}>
                        {part.part_status === "paid" ? "مدفوع" : "مستحق"}
                      </td>
                      <td className="p-3">{part.part_due_date}</td>
                      <td className="p-3">{part.part_title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
