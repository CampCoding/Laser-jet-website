import { Dropdown, Menu, Space, Table } from "antd";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

export default function UserDeductions({ userProfile }) {
  const [searchValue , setSearchValue] = useState("");
  const [originalData , setOriginalData] = useState([]); 
  const columns = [
    {
      dataIndex: "",
      key: "",
      title: t("username"),
      render: (row) => <p>{row?.user?.name}</p>,
    },

    {
      dataIndex: "",
      key: "",
      title: t("phone"),
      render: (row) => (
        <a href={`tel:${row?.user?.phone}`}>{row?.user?.phone}</a>
      ),
    },

    {
      dataIndex: "",
      key: "",
      title: t("nationalId"),
      render: (row) => <p>{row?.user?.national_id}</p>,
    },
    {
      dataIndex: "",
      key: "",
      title: t("BalanceBefore"),
      render: (row) => <p>{row?.balance_before}</p>,
    },
    {
      dataIndex: "",
      key: "",
      title: t("الغرامات"),
      render: (row) => <p>{row?.amount}</p>,
    },

    {
      dataIndex: "",
      key: "",
      title: t("BalanceAfter"),
      render: (row) => <p>{row?.balance_after}</p>,
    },
    {
      dataIndex:"transaction_date",
      key:"transaction_date",
      title:t("dateText")
    }
  ];
  
  useEffect(() => {
    if(searchValue?.trim()?.length == 0) {
      const sortedData = [...userProfile]?.sort((a , b) => new Date(b.transaction_date) - new Date(a.transaction_date))
      setOriginalData(sortedData)
    }else  {
      const val = searchValue.toLowerCase();
      const filtered = userProfile.filter((item) => {
        return (
          item?.description?.toLowerCase()?.includes(val) ||
          item?.user?.name?.toLowerCase()?.includes(val) ||
          item?.user?.national_id?.includes(val) ||
          item?.user?.phone?.includes(val) ||
          String(item?.amount)?.includes(val) ||
          String(item?.balance_after)?.includes(val) ||
          String(item?.balance_before)?.includes(val) ||
          String(item?.current_balance)?.includes(val)
        );
      });
  
      const sortedFiltered = filtered.sort(
        (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
      );
      setOriginalData(sortedFiltered);
    }
  } , [searchValue , userProfile])


  return (
    <div>
      <input
       value={searchValue}
       onChange={(e) => setSearchValue(e?.target?.value)}
        type="text"
        placeholder="Search Users..."
        className="my-3 border border-gray-300 p-3 w-full rounded-md outline-none"
      />
      <Table columns={columns} dataSource={originalData} rowKey="id" />
    </div>
  );
}
