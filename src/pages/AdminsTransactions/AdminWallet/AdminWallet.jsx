import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchAdminsTransationsList } from "../../../features/aminTransactionSlice";
import { Table } from "antd";
import { useTranslation } from "react-i18next";

export default function AdminWallet({data}) {
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
      dataIndex: "admin_wallet_id",
      key: "admin_wallet_id",
      title: "#",
    },
    {
      title: "Admin Id",
      render: (row) => <p>{row?.admin_data?.admin_id|| row?.admin?.admin_id}</p>,
    },
    {
      dataIndex: "admin_wallet_balance",
      key: "admin_wallet_balance",
      title: t("adminWalletBalance"),
    },
    {
      title: t("adminName"),
      render: (row) => <p>{row?.admin_data?.admin_name || row?.admin?.admin_name || "--"}</p>,
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(searchValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (data?.length)
      setOriginalData(data);
  }, [data]);

  useEffect(() => {
    let data;
    if (debounceValue?.length) {
      data = originalData?.filter((item) =>
        item?.admin_data?.admin_name
          ?.toLowerCase()
          ?.includes(debounceValue?.toLowerCase())
      );
    } else {
      data = originalData;
    }
    setFilteredData(data);
  }, [originalData, debounceValue]);

  return (
    <div className="flex flex-col gap-3">
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        className="border border-gray-300 outline-none w-full rounded-md p-3 my-3"
        placeholder={t("searchText")}
      />{" "}
      <Table
        rowKey={(record) => record?.admin_wallet_id}
        className=""
        loading={get_admin_transaction_loading}
        dataSource={filteredData}
        columns={columns}
      />
    </div>
  );
}
