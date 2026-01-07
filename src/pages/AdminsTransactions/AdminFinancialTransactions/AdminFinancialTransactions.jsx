import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { handleFetchAdminsTransationsList } from "../../../features/aminTransactionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function AdminFinancialTransactions({data}) {
  //translation
  const { t } = useTranslation();

  //search
  const [debounceValue, setDebounceValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  //data
  const dispatch = useDispatch();
  const { admins_transations_data, get_admin_transaction_loading } =
    useSelector((state) => state?.adminTransactions);
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    dispatch(handleFetchAdminsTransationsList());
  }, [dispatch]);

  const columns = [
    {
      dataIndex: "admin_transaction_id",
      key: "admin_transaction_id",
      title: t("#"),
    },

    {
      dataIndex: "",
      key: "",
      title: t("name"),
      render: (row) => <p>{row?.admin?.admin_name}</p>,
    },
    {
      dataIndex: "admin_transaction_balance_before",
      key: "admin_transaction_balance_before",
      title: t("BalanceBefore"),
    },
    {
      dataIndex: "admin_transaction_amount",
      key: "admin_transaction_amount",
      title: t("operationValue"),
      render: (row) => {
        return (
          <span className="text-danger" style={{ color: "red" }}>
            {row}
          </span>
        );
      },
    },
    {
      dataIndex: "admin_transaction_balance_after",
      key: "admin_transaction_balance_after",
      title: t("BalanceAfter"),
    },
    {
      dataIndex: "admin_transaction_description",
      key: "admin_transaction_description",
      title: t("proccesDescription"),
    },
    {
      dataIndex: "admin_transaction_type",
      key: "admin_transaction_type",
      title: t("transactionType"),
    },
    {
      dataIndex: "admin_transaction_balance_date",
      key: "admin_transaction_balance_date",
      title: t("dateText"),
    },
  ];

  useEffect(() => {
    let timeout = setTimeout(() => {
      setDebounceValue(searchValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {}, [debounceValue]);

  useEffect(() => {
    if (data?.length)
      setOriginalData(data);
  }, [data]);

  useEffect(() => {
    let data = originalData;
    if (debounceValue?.length) {
      data = data?.filter(
        (item) =>
          item?.admin_transaction_description
            ?.toLowerCase()
            ?.includes(debounceValue?.toLowerCase()) ||
          item?.admin_transaction_type
            ?.toLowerCase()
            ?.includes(debounceValue?.toLowerCase()) ||
          item?.admin?.admin_name
            ?.toLowerCase()
            ?.includes(debounceValue?.toLowerCase())
      );
    }
     console.log(data)

    setFilteredData(data);
  }, [debounceValue, originalData]);
  return (
    <div className="flex flex-col gap-3">
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        className="border border-gray-300 outline-none w-full rounded-md p-3 my-3"
        placeholder={t("searchText")}
      />{" "}
      <Table
        className=""
        loading={get_admin_transaction_loading}
        dataSource={
          filteredData
        }
        columns={columns}
      />
    </div>
  );
}
