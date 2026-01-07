import { Dropdown, Menu, Space, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEllipsisVertical } from "react-icons/fa6";

export default function UserOperations({ userProfile }) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
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
      dataIndex: "balance_before",
      key: "name",
      title: t("BalanceBefore"),
    },
    {
      dataIndex: "amount",
      key: "name",
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
      dataIndex: "balance_after",
      key: "name",
      title: t("BalanceAfter"),
    },
    {
      dataIndex: "description",
      key: "name",
      title: t("proccesDescription"),
    },
    {
      dataIndex: "transaction_type",
      key: "name",
      title: t("transactionType"),
    },
    {
      dataIndex: "transaction_date",
      key: "transaction_date",
      title: t("dateText"),
    },
  ];

  useEffect(() => {
    if (searchValue.trim().length === 0) {
      const sortedData = userProfile
        ? [...userProfile].sort(
            (a, b) =>
              new Date(b.transaction_date) - new Date(a.transaction_date)
          )
        : [];
      setOriginalData(sortedData);
    } else {
      const val = searchValue.toLowerCase();
      const filtered = userProfile.filter((item) => {
        return (
          item?.description?.toLowerCase()?.includes(val) ||
          item?.transaction_type?.toLowerCase()?.includes(val) ||
          item?.user?.name?.toLowerCase()?.includes(val) ||
          item?.user?.national_id?.includes(val) ||
          item?.user?.phone?.includes(val) ||
          String(item?.amount)?.includes(val) ||
          String(item?.balance_after)?.includes(val) ||
          String(item?.current_balance)?.includes(val)
        );
      });

      const sortedFiltered = filtered.sort(
        (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
      );
      setOriginalData(sortedFiltered);
    }
  }, [searchValue, userProfile]);

  useEffect(() => {
    console.log(originalData);
  }, [originalData]);

  return (
    <div>
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        type="text"
        placeholder={t("searchText")}
        className="my-3 border border-gray-300 p-3 w-full rounded-md outline-none"
      />
      <Table columns={columns} dataSource={originalData} rowKey="id" />
    </div>
  );
}
