import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InvoicesComponent from "../../components/Invoices/Invoices";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAdminTransactions } from "../../features/transactionSlice";
import { handleFetcOrders } from "../../features/ordersSlice";
import { Spin } from "antd";

export default function Invoices() {
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();
  const [allInstallments, setAllInstallments] = useState([]);
  const { loading } = useSelector((state) => state?.adminTransactions);
  const dispatch = useDispatch();
  const [isLoading , setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(handleFetchAdminTransactions())
      ?.unwrap()
      ?.then((res) => {
        console.log(res?.data?.installments[0]);
        if (res?.success) {
          setAllInstallments(
            res?.data?.installments?.map((install) => ({
              ...install,
              details: install?.details?.map((detail) => ({
                ...detail,
                product_id: install?.product_id,
                product: install?.product,
                value: install?.value,
                order_number: install?.order_number,
                installment_id: install?.installment_id,
                user: install?.user,
              })),
            }))
          );
          setIsLoading(false)
        }
        console.log(res);
      })
      .catch(e => console.log(e))
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!searchValue.length) return allInstallments;

    return allInstallments.filter(
      (item) =>
        item?.product?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
        item?.name?.toLowerCase()?.includes(searchValue)
    );
  }, [searchValue, allInstallments]);

  useEffect(() => {
    console.log(allInstallments, loading);
  }, [allInstallments, loading]);

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("InvoicesText")}
        </h3>
      </div>

      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search Invoices..."
        className="w-full rounded-md p-3 my-3 border border-gray-300 outline-hidden"
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <InvoicesComponent isLoading={isLoading} loading={loading} item={filteredData} />
      )}
    </div>
  );
}
