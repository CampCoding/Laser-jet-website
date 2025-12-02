"use client";
import GetTransactionsData from "@/CallAcountAPi/Gettransactions";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function TransactionsTable() {
  const { data: session, status } = useSession(); // ✅ Hook مباشرة
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const data = await GetTransactionsData(session.user.id);
          if (data?.success && data?.data?.transactions) {
            setTransactions(data.data.transactions);
          } else {
            setTransactions([]); // fallback لو مفيش بيانات
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setTransactions([]); // fallback لو حصل خطأ
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setTransactions([]); // user not authenticated
      }
    }

    fetchData();
  }, [status, session]);

  if (loading) return <p>جاري تحميل المعاملات...</p>;
  if (!session) return <p>برجاء تسجيل الدخول لعرض المعاملات</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">المعاملات</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100 text-gray-700 font-bold">
            <tr>
              <th className="p-3">النوع</th>
              <th className="p-3">المبلغ</th>
              <th className="p-3">الوصف</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">قبل العملية</th>
              <th className="p-3">بعد العملية</th>
              <th className="p-3">اسم المستخدم</th>
              <th className="p-3">رقم الهاتف</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {tx.transaction_type === "deposit" ? (
                      <span className="text-green-600 font-semibold">إيداع</span>
                    ) : (
                      <span className="text-red-600 font-semibold">سحب</span>
                    )}
                  </td>
                  <td className="p-3 font-bold">{tx.amount} جنيه</td>
                  <td className="p-3">{tx.description}</td>
                  <td className="p-3">{tx.transaction_date}</td>
                  <td className="p-3">{tx.balance_before}</td>
                  <td className="p-3">{tx.balance_after}</td>
                  <td className="p-3">{tx.user?.name}</td>
                  <td className="p-3">{tx.user?.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-3 text-center">
                  لا توجد معاملات لعرضها
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
