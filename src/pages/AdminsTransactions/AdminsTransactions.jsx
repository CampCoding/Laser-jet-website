import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminWallet from "./AdminWallet/AdminWallet";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAdminsTransationsList } from "../../features/aminTransactionSlice";
import AdminFinancialTransactions from "./AdminFinancialTransactions/AdminFinancialTransactions";

export default function AdminsTransactions() {
  //redux
  const dispatch = useDispatch();
  const { admins_transations_data, get_admin_transaction_loading } =
    useSelector((state) => state?.adminTransactions);
  

  const { t } = useTranslation();
  const [tabs, setTabs] = useState(1);
  const TABS = [
    {
      id: 1,
      nameAr: t("walletBalance"),
    },
    {
      id: 4,
      nameAr: t("operationText"),
    },
  ];
  
  //fetch transactions
  useEffect(() =>{
    dispatch(handleFetchAdminsTransationsList())
  } , [dispatch])

  useEffect(() => {
    console.log(admins_transations_data)
  } , [admins_transations_data])

  return (
    <div>
      <h3 className="text-center my-5 text-[23px] text-[#0d6efd] font-bold">
        {t("financeTransactionsText")}
      </h3>
      <div className="flex gap-3 items-center">
        {TABS.map((item) => (
          <button
            className={`p-3 border border-[#0d6efd] rounded-md flex justify-center items-center ${
              tabs == item?.id
                ? "bg-[#0d6efd] text-white"
                : "bg-transparent text-[#0d6efd]"
            }`}
            key={item?.id}
            onClick={() => setTabs(item?.id)}
          >
            {item?.nameAr}
          </button>
        ))}
        {/* <button className={`p-3 border border-[#0d6efd] ${tabs == 0}`} onClick={() => setTabs(0)}>رصيد الحساب</button> */}
      </div>

      {tabs == 1 && <AdminWallet data={admins_transations_data?.data?.wallets} />}
      {tabs == 4 && <AdminFinancialTransactions data={admins_transations_data?.data?.transactions} />}
    </div>
  );
}
