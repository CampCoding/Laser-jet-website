import { Dropdown, Menu, Modal, Table } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { handleEditOrder, handleFetcOrders } from "../../features/ordersSlice";
import { FaEllipsisVertical } from "react-icons/fa6";
import { toast } from "react-toastify";

const OPTIONS = [
  {
    id: 1,
    value: "pending",
    label: "Pending",
  },
  {
    id: 2,
    value: "confirmed",
    label: "Confirmed",
  },
  {
    id: 3,
    value: "rejected",
    label: "Rejected",
  },
  {
    id: 4,
    label: "Canceled",
    value: "canceled",
  },
  {
    id: 5,
    label: "Completed",
    value: "completed",
  },
];

export default function ProductOrder() {
  const { t } = useTranslation();
  const [editModal, setEditModal] = useState(false);
  const { product_id } = useParams();
  const [originalData, setOriginalData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [originalProductData, setOriginalProductData] = useState([]);
  const [productOrders, setProductOrders] = useState([]);
  const dispatch = useDispatch();
  const [searchVal, setSearchVal] = useState("");
  const { data, loading, orderDetails, editLoading } = useSelector(
    (state) => state?.orders
  );

  const columns = [
    {
      dataIndex: "order_id",
      key: "order_id",
      title: "#",
    },
    {
      dataIndex: "invoice_id",
      key: "invoice_id",
      title: t("invoiceId"),
    },
    {
      dataIndex: "created_at",
      key: "created_at",
      title: t("created_atText"),
      search: true,
      render: (row) => {
        const date = new Date(row).toLocaleString();
        console.log(date);
        return <p>{date}</p>;
      },
    },
    {
      dataIndex: "details",
      key: "details",
      title: t("addressText"),
    },
    {
      dataIndex: "name",
      key: "name",
      title: t("userNameText"),
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: t("phone"),
    },
    {
      dataIndex: "total_price",
      key: "total_price",
      title: t("totalPriceText"),
      render: (row) => (
        <p>
          {row} {t("egpText")}
        </p>
      ),
    },
    {
      dataIndex: "order_status",
      key: "order_status",
      title: "حالة الطلب", // Arabic title for the column
      render: (row) => {
        let statusClass = "";
        let statusText = "";

        switch (row) {
          case "pending":
            statusClass = "bg-gray-100 text-black"; // Gray
            statusText = "قيد الانتظار"; // Arabic for "Pending"
            break;
          case "completed":
            statusClass = "bg-green-100 text-green-500"; // Green
            statusText = "مكتمل"; // Arabic for "Completed"
            break;
          case "rejected":
            statusClass = "bg-red-100 text-red-500"; // Red
            statusText = "مرفوض"; // Arabic for "Rejected"
            break;
          case "canceled":
            statusClass = "bg-orange-100 text-orange-500"; // Orange
            statusText = "ملغى"; // Arabic for "Canceled"
            break;
          case "confirmed":
            statusClass = "bg-blue-100 text-blue-500"; // Blue
            statusText = "مؤكد"; // Arabic for "Confirmed"
            break;
          default:
            statusClass = "bg-gray-200 text-black"; // Default light gray
            statusText = "الحالة الافتراضية"; // Arabic for "Default"
        }

        return (
          <p
            className={`${statusClass} p-2 whitespace-nowrap rounded-md text-center`}
          >
            {statusText}
          </p>
        );
      },
    },
    {
      dataIndex: "payment_status",
      key: "payment_status",
      title: "حالة الدفع", // Arabic title for the column
      render: (row) => {
        let statusClass = "";
        let statusText = "";

        switch (row) {
          case "pending":
            statusClass = "bg-gray-100 text-black"; // Gray
            statusText = "قيد الانتظار"; // Arabic for "Pending"
            break;
          case "success":
            statusClass = "bg-green-100 text-green-500"; // Green
            statusText = "ناجح"; // Arabic for "Success"
            break;
          case "failed":
            statusClass = "bg-red-100 text-red-500"; // Red
            statusText = "فشل"; // Arabic for "Failed"
            break;
          default:
            statusClass = "bg-gray-100 text-black";
            statusText = "الحالة الافتراضية"; // Arabic for "Default"
        }

        return (
          <p
            className={`capitalize p-2 whitespace-nowrap rounded-md text-center ${statusClass}`}
          >
            {statusText}
          </p>
        );
      },
    },
    {
      dataIndex: "",
      title: t("actions"),
      render: (row) => {
        return (
          <button
            onClick={() => {
              setRowData(row);
              setEditModal(true);
            }}
            className="bg-blue-500 text-white p-2 rounded-md flex justify-center items-center"
          >
            {t("editText")}
          </button>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(handleFetcOrders({ page: 1, per_page: 7 }));
  }, [dispatch]);

  function handleEdit() {
    console.log(rowData);
    const data_send = {
      order_id: rowData.order_id,
      new_status: rowData?.order_status,
    };

    dispatch(handleEditOrder(data_send))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setEditModal(false);
          dispatch(handleFetcOrders({ page: 1, per_page: 20 }));
        } else {
          toast.error(res);
        }
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    const matchedProducts = data?.data?.orders
      ?.filter((item) =>
        item?.products?.find((prod) => prod?.product_id == product_id)
      )
      ?.filter(Boolean);
    setProductOrders(matchedProducts);
    setOriginalData(matchedProducts);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchVal?.length) return originalData;

    return originalData?.filter(
      (item) =>
        item?.details?.toLowerCase()?.includes(searchVal?.toLowerCase()) ||
        item?.name?.toLowerCase()?.includes(searchVal?.toLowerCase()) ||
        item?.phone?.toLowerCase()?.includes(searchVal)
    );
  }, [searchVal, originalData]);

  useEffect(() => {
    setOriginalProductData(filteredData);
  }, [filteredData]);

  return (
    <div>
      <h3 className="font-semibold my-3 text-[25px] text-[#0d6efd]">
        {t("orderProductsText")}
      </h3>

      <Modal
        onOk={handleEdit}
        open={editModal}
        onCancel={() => setEditModal(false)}
        onClose={() => setEditModal(false)}
        title={t("editOrderText")}
        okText={editLoading ? t("loadingText") : t("editText")}
        cancelText={t("cancelText")}
      >
        <div className="input-group">
          <label>{t("orderStatusText")}</label>
          <select
            onChange={(e) =>
              setRowData({ ...rowData, order_status: e.target.value })
            }
            value={rowData?.order_status}
          >
            <option value="" disabled>
              Choose Status
            </option>
            {OPTIONS.map((item) => (
              <option key={item?.id} value={item?.value}>
                {item?.label}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      <input
        onChange={(e) => setSearchVal(e.target.value)}
        value={searchVal}
        type="text"
        placeholder={t("searchText")}
        className="my-3 border border-gray-300 p-3 w-full rounded-md outline-none"
      />
      <Table
        pagination={true}
        columns={columns}
        scroll={{ x: "max-content" }}
        loading={loading}
        dataSource={originalProductData}
      />
    </div>
  );
}
