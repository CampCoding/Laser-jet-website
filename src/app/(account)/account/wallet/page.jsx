"use client";
import GetTransactionsData from "@/CallAcountAPi/Gettransactions";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Wallet, AlertCircle } from "lucide-react";

export default function WalletCard() {
  const { data: session, status } = useSession();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      if (status === "authenticated") {
        try {
          setLoading(true);
          const data = await GetTransactionsData(session.user.id);
          if (data?.success && data?.data?.wallet) {
            setWallet(data.data.wallet);
          } else {
            setWallet(null);
          }
        } catch (error) {
          console.error("Error fetching wallet:", error);
          setWallet(null);
        } finally {
          setLoading(false);
        }
      } else {
        setWallet(null);
        setLoading(false);
      }
    }

    fetchWallet();
  }, [status, session]);

  if (loading)
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md animate-pulse">
        <p className="text-gray-400">جاري تحميل بيانات المحفظة...</p>
      </div>
    );
  if (!session)
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <p className="text-gray-600">برجاء تسجيل الدخول لعرض بيانات المحفظة</p>
      </div>
    );
  if (!wallet)
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <p className="text-gray-600">لا توجد بيانات للمحفظة</p>
      </div>
    );

  return (
    <div className="p-6  mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">محفظتك</h2>
        <Wallet className="w-6 h-6 text-blue-500" />
      </div>

      <div className="space-y-3">
        <p className="text-gray-700">
          <span className="font-semibold">اسم المستخدم: </span> {wallet.username}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">رقم الهاتف: </span> {wallet.phone}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <span className="font-semibold">الرصيد الحالي: </span>{" "}
          <span className="text-green-600 text-lg font-bold">{wallet.balance.toFixed(2)} جنيه</span>
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="font-semibold">الغرامات: </span>{" "}
          <span className="text-red-600">{wallet.fine.toFixed(2)} جنيه ({wallet.fine_status})</span>
        </p>
      </div>


    </div>
  );
}

