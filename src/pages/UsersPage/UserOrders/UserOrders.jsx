import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  handleEditOrder,
  handleFetchOrderDetails,
  handleFetcOrders,
} from "../../../features/ordersSlice";
import { Dropdown, Menu, Modal, Table } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

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

export default function Orders() {
  const { t } = useTranslation();
  const [statusText, setStatusText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dateData, setDateData] = useState({
    from: "",
    to: "",
  });
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, orderDetails, editLoading } = useSelector(
    (state) => state?.orders
  );
  const [params, setParams] = useState({
    page: 1,
    per_page: 20,
  });
  const [editModal, setEditModal] = useState(false);
  const [orderProdModal, setOrderProdModal] = useState(false);
  const [tabs, setTabs] = useState(0);
  const [rowData, setRowData] = useState({});
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
      title: t("orderStatusText"),
      render: (row) => {
        let statusClass = "";

        switch (row) {
          case "pending":
            statusClass = "bg-gray-100 text-black"; // Gray
            break;
          case "completed":
            statusClass = "bg-green-100 text-green-500"; // Green
            break;
          case "rejected":
            statusClass = "bg-red-100 text-red-500"; // Red
            break;
          case "canceled":
            statusClass = "bg-orange-100 text-orange-500"; // Orange
            break;
          case "confirmed":
            statusClass = "bg-blue-100 text-blue-500"; // Blue
            break;
          default:
            statusClass = "bg-gray-200 text-black"; // Default light gray
        }

        return (
          <p
            className={`${statusClass} p-2 whitespace-nowrap rounded-md text-center`}
          >
            {row.charAt(0).toUpperCase() + row.slice(1)}
          </p>
        );
      },
    },

    {
      dataIndex: "payment_status",
      key: "payment_status",
      title: t("paymentStatusText"),
      render: (row) => {
        let statusClass = "";
        switch (row) {
          case "pending":
            statusClass = "bg-gray-100 text-black"; // Gray
            break;
          case "success":
            statusClass = "bg-green-100 text-green-500"; // Green
            break;
          case "failed":
            statusClass = "bg-red-100 text-red-500"; // Red
            break;
          default:
            statusClass = "bg-gray-100 text-black";
        }
        return (
          <p
            className={`capitalize  p-2 whitespace-nowrap rounded-md text-center ${statusClass}`}
          >
            {row}
          </p>
        );
      },
    },

    {
      title: t("actions"),
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-1 p-3">
            <Menu.Item
              onClick={() => {
                setRowData(row);
                setEditModal(true);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("editText")}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setOrderProdModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {" "}
              {t("productsText")}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                navigate(`/ordersDetails/${row?.order_id}`);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {" "}
              {t("orderDetailsText")}
            </Menu.Item>
            <Menu.Item className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center">
              {" "}
              {t("printText")}
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <FaEllipsisVertical />
          </Dropdown>
        );
      },
    },
  ];

  const productColumn = [
    {
      dataIndex: "product_id",
      key: "product_id",
      title: "#",
    },
    {
      dataIndex: "product_title",
      key: "product_title",
      title: t("productTitle"),
    },
    {
      dataIndex: "product_quantity",
      key: "product_quantity",
      title: t("productQuantity"),
    },
    {
      dataIndex: "product_price",
      key: "product_price",
      title: t("priceText"),
    },
  ];

  useEffect(() => {
    if (dateData.from && dateData.to && dateData.from > dateData.to) {
      toast.error("اختر تاريخ بدايه اقل من تاريخ النهايه");
      return;
    }

    if (statusText?.length) {
      setParams({ ...params, keywords: statusText });
    }

    if (dateData?.from && dateData?.to) {
      setParams({ ...params, from: dateData?.from, to: dateData?.to });
    }
    if (userId) {
      setParams({ ...params, user_id: userId });
    }
  }, [statusText, dateData]);
  useEffect(() => {
    dispatch(handleFetcOrders(params));
  }, [params, dispatch]);
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
    setFilteredData(
      data?.data?.orders?.filter((item) => item?.user_id == userId)
    );
  }, [userId, data]);

  return (
    <div>
      <div className="flex justify-between items-center">
        {/* <div className="flex w-full justify-between items-center"> */}
        <div className="flex flex-col gap-3  my-4">
          <h3 className="font-semibold text-[20px] md:text-[25px] text-[#0d6efd]">
            {t("ordersText")}
          </h3>

          {/* <div className="flex gap-3 items-center">
            <button
              onClick={() => setTabs(0)}
              className={`p-3 rounded-md ${
                tabs == 0
                  ? "bg-blue-500 text-white"
                  : "bg-transparent border border-blue-500 text-blue-500"
              }`}
            >
              {t("paidOrders")}
            </button>
            <button
              onClick={() => setTabs(1)}
              className={`p-3 rounded-md ${
                tabs == 1
                  ? "bg-blue-500 text-white"
                  : "bg-transparent border border-blue-500 text-blue-500"
              }`}
            >
              {t("unpaidOrders")}
            </button>
          </div> */}
        </div>

        {/* <button onClick={() => navigate("/create_order")} className="bg-blue-500 text-white p-3 rounded-md">{t("createOrderText")}</button> */}

        {tabs == 1 && (
          <div className="flex gap-3 items-center">
            <div className="input-group">
              <label>{t("orderStatusText")}</label>
              <select
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
              >
                <option value="" disabled selected>
                  Select option
                </option>
                {OPTIONS.map((item) => (
                  <option key={item?.id} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="input-group">
                <label>{t("fromText")}</label>
                <input
                  value={dateData?.from}
                  onChange={(e) =>
                    setDateData({ ...dateData, from: e.target.value })
                  }
                  type="date"
                />
              </div>

              <div className="input-group">
                <label>{t("toText")}</label>
                <input
                  value={dateData.to}
                  onChange={(e) =>
                    setDateData({ ...dateData, to: e.target.value })
                  }
                  type="date"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        scroll={{ x: "max-content" }}
        loading={loading}
        dataSource={
          tabs == 0
            ? filteredData?.filter((item) => item?.payment_status == "success")
            : filteredData?.filter(
                (item) =>
                  item?.order_status !== "try to buy" ||
                  item?.payment_status !== "success"
              )
        }
      />
      {console.log(
        data?.data?.orders?.filter((item) => item?.payment_status == "success")
      )}
      <Modal
        open={orderProdModal}
        onCancel={() => setOrderProdModal(false)}
        onClose={() => setOrderProdModal(false)}
        title={t("ProductsOrdersText")}
        footer={null}
      >
        <Table
          columns={productColumn}
          dataSource={rowData?.products}
          scroll={{ x: "max-content" }}
        />
      </Modal>
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
    </div>
  );
}
