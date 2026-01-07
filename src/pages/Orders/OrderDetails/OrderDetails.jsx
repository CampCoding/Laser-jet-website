import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { handleFetchOrderDetails } from "../../../features/ordersSlice";
import { Cascader, Dropdown, Menu, Modal, Spin, Table, Button } from "antd";
import { FaCheck, FaEllipsisVertical, FaX, FaPrint } from "react-icons/fa6";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";

export default function OrderDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openImgModal, setOpenImgModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openInstallmentModal, setInstallmentModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [editInstallmentModal, setEditInstallmentModal] = useState(false);
  const { orderDetails, loadingDetails } = useSelector(
    (state) => state?.orders
  );

  // ✅ Ref for printing
  const printRef = useRef();

  // ✅ Print handler using react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `طلب-رقم-${orderDetails?.data?.order?.order_id || id}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          direction: rtl;
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
        }
        .no-print {
          display: none !important;
        }
        .print-only {
          display: block !important;
        }
        table {
          width: 100% !important;
          border-collapse: collapse !important;
        }
        th, td {
          border: 1px solid #ddd !important;
          padding: 8px !important;
          text-align: right !important;
        }
        th {
          background-color: #f5f5f5 !important;
        }
        .ant-table-wrapper {
          overflow: visible !important;
        }
        .ant-table {
          font-size: 12px !important;
        }
        img {
          max-width: 60px !important;
          max-height: 60px !important;
        }
      }
    `,
  });

  const columns = [
    {
      dataIndex: "product_id",
      key: "product_id",
      title: "#",
    },
    {
      dataIndex: "",
      key: "",
      title: t("imageText"),
      render: (row) => (
        <img
          src={row?.images?.length > 0 && row?.images[0].image_url}
          className="w-[100px] h-[100px] object-cover rounded-md print:w-[60px] print:h-[60px]"
        />
      ),
    },
    {
      dataIndex: "title",
      key: "title",
      title: "اسم المنتج",
    },
    {
      dataIndex: "description",
      key: "description",
      title: t("description"),
      width: 400,
    },
    {
      dataIndex: "",
      key: "",
      title: t("categoryText"),
      render: (row) => <p>{row?.category?.title}</p>,
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: t("productQuantity"),
    },
    {
      dataIndex: "sympol",
      key: "sympol",
      title: t("productCodeText"),
    },
    {
      dataIndex: "price",
      key: "price",
      title: t("priceText"),
      render: (row) => (
        <p>
          {row} {t("egpText")}
        </p>
      ),
    },
    {
      dataIndex: "sell_price",
      key: "sell_price",
      title: t("sellPriceText"),
      render: (row) => (
        <p>
          {row} {t("egpText")}
        </p>
      ),
    },
    {
      dataIndex: "created_at",
      key: "created_at",
      title: t("created_atText"),
      render: (row) => <p>{new Date(row)?.toLocaleString()}</p>,
    },
  ];

  const detailColumn = [
    {
      dataIndex: "product_detail_id",
      key: "product_detail_id",
      title: "#",
    },
    {
      dataIndex: "label",
      key: "label",
      title: t("labelText"),
    },
    {
      dataIndex: "value",
      key: "value",
      title: t("valueText"),
    },
  ];

  const installmentColumns = [
    {
      dataIndex: "installment_part_id",
      key: "installment_part_id",
      title: "#",
    },
    {
      dataIndex: "part_title",
      key: "part_title",
      title: t("installmentTitle"),
    },
    {
      dataIndex: "part_value",
      key: "part_value",
      title: t("installmentValue"),
      render: (row) => (
        <p>
          {row} {t("egpText")}
        </p>
      ),
    },
    {
      dataIndex: "part_pay_date",
      key: "part_pay_date",
      title: t("part_pay_date"),
    },
    {
      dataIndex: "part_status",
      key: "part_status",
      title: t("part_status"),
      render: (status) => {
        let className = "bg-gray-100 text-gray-500";

        switch (status) {
          case "pending":
            className = "bg-gray-100 text-gray-500";
            break;
          case "paid":
            className = "bg-green-100 text-green-500";
            break;
          case "unpaid":
            className = "bg-red-100 text-red-500";
            break;
          case "refunded":
            className = "bg-blue-100 text-blue-500";
            break;
          case "stopped":
            className = "bg-orange-100 text-orange-500";
            break;
          case "paused":
            className = "bg-yellow-100 text-yellow-500";
            break;
          default:
            className = "bg-gray-200 text-gray-500";
        }

        return (
          <p className={`px-3 py-1 rounded-md font-semibold ${className}`}>
            {t(status)}
          </p>
        );
      },
    },
    {
      title: t("actions"),
      render: (row) => (
        <div className="no-print">
          <button
            onClick={() => {
              setEditInstallmentModal(true);
            }}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            {t("editText")}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(handleFetchOrderDetails({ order_id: id }));
  }, [id]);

  useEffect(() => {
    console.log(orderDetails);
  }, [orderDetails]);

  return (
    <div>
      {/* ✅ Header with Print Button */}
      <div className="flex gap-3 justify-between items-center my-4 no-print">
        <h3 className="font-semibold text-[20px] md:text-[25px] text-[#0d6efd]">
          {t("orderDetailsText")}
        </h3>

        {/* ✅ Print Button */}
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          size="large"
          className="bg-[#0d6efd] hover:bg-[#0b5ed7] flex items-center gap-2"
        >
          طباعة الطلب
        </Button>
      </div>

      {loadingDetails ? (
        <div className="h-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        // ✅ Printable Content Wrapper
        <div ref={printRef} dir="rtl">
          {/* ✅ Print Header - Only shows when printing */}
          <div className="hidden print:block print:mb-6 print:text-center print:border-b-2 print:pb-4">
            <h1 className="text-2xl font-bold text-[#0d6efd]">LASERJET</h1>
            <p className="text-gray-500 mt-2">
              تفاصيل الطلب رقم: {orderDetails?.data?.order?.order_id}
            </p>
            <p className="text-gray-400 text-sm">
              تاريخ الطباعة: {new Date().toLocaleString("ar-EG")}
            </p>
          </div>

          {/* Order Info Card */}
          <div className="bg-white shadow-xl p-3 rounded-md print:shadow-none print:border print:border-gray-300">
            <div className="grid py-4 grid-cols-1 md:grid-cols-2 print:grid-cols-2">
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-center text-[18px] md:text-[23px] text-[#0d6efd] print:text-[18px]">
                  LASERJET
                </h4>

                <div className="flex flex-col gap-3 text-gray-500">
                  <p>
                    <strong className="font-medium">
                      {t("customerText")} :
                    </strong>{" "}
                    {orderDetails?.data?.order?.name}
                  </p>
                  <p>
                    <strong className="font-medium">{t("phone")} :</strong>{" "}
                    {orderDetails?.data?.order?.phone}
                  </p>
                  <p>
                    <strong className="font-medium">
                      {t("locationText")} :
                    </strong>{" "}
                    {orderDetails?.data?.order?.details}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-center text-[18px] md:text-[23px] text-[#0d6efd] print:text-[18px]">
                  {t("ordersText")}
                </h4>

                <div className="flex flex-col gap-5 text-gray-500 print:gap-2">
                  <p>
                    <strong className="font-medium">
                      {t("orderIdText")} :
                    </strong>
                    {orderDetails?.data?.order?.order_id}
                  </p>
                  <p>
                    <strong className="font-medium">
                      {t("created_atText")} :
                    </strong>{" "}
                    {new Date(
                      orderDetails?.data?.order?.created_at
                    )?.toLocaleString()}
                  </p>
                  <p>
                    <strong className="font-medium">
                      {t("updatedAtText")} :
                    </strong>{" "}
                    {new Date(
                      orderDetails?.data?.order?.updated_at
                    )?.toLocaleString()}
                  </p>
                  <p>
                    <strong className="font-medium">
                      {t("orderStatusText")} :
                    </strong>{" "}
                    <span
                      className={`p-2 rounded-md print:p-1 print:text-sm ${
                        orderDetails?.data?.order?.order_status == "completed"
                          ? "bg-green-100 text-green-500"
                          : orderDetails?.data?.order?.order_status == "pending"
                          ? "bg-gray-100 text-gray-500"
                          : orderDetails?.data?.order?.order_status ==
                            "rejected"
                          ? "bg-red-100 text-red-500"
                          : orderDetails?.data?.order?.order_status ==
                            "canceled"
                          ? "bg-orange-100 text-orange-500"
                          : orderDetails?.data?.order?.order_status ==
                            "confirmed"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {orderDetails?.data?.order?.order_status === "completed"
                        ? "مكتمل"
                        : orderDetails?.data?.order?.order_status === "pending"
                        ? "قيد الانتظار"
                        : orderDetails?.data?.order?.order_status === "rejected"
                        ? "مرفوض"
                        : orderDetails?.data?.order?.order_status === "canceled"
                        ? "ملغى"
                        : orderDetails?.data?.order?.order_status ===
                          "confirmed"
                        ? "مؤكد"
                        : "الحالة الافتراضية"}
                    </span>
                  </p>

                  <p>
                    <strong className="font-medium">حالة الدفع:</strong>{" "}
                    <span
                      className={`p-2 rounded-md print:p-1 print:text-sm ${
                        orderDetails?.data?.order?.payment_status == "success"
                          ? "bg-green-100 text-green-500"
                          : orderDetails?.data?.order?.payment_status ==
                            "pending"
                          ? "bg-gray-100 text-gray-500"
                          : orderDetails?.data?.order?.payment_status ==
                            "failed"
                          ? "bg-red-100 text-red-500"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {orderDetails?.data?.order?.payment_status ===
                      "try to buy"
                        ? "لم يتم الدفع"
                        : orderDetails?.data?.order?.payment_status ===
                          "success"
                        ? "ناجح"
                        : orderDetails?.data?.order?.payment_status ===
                          "pending"
                        ? "قيد الانتظار"
                        : orderDetails?.data?.order?.payment_status === "failed"
                        ? "فشل"
                        : "الحالة الافتراضية"}
                    </span>
                  </p>

                  <p>
                    <strong className="font-medium">
                      {t("paymentMethodText")} :
                    </strong>{" "}
                    {orderDetails?.data?.order?.payment_method == "mini money"
                      ? "قسط"
                      : "كاش"}
                  </p>
                  <p>
                    <strong className="font-medium">
                      {t("orderValueText")} :
                    </strong>{" "}
                    <span className="text-green-600 font-bold">
                      {orderDetails?.data?.order?.total_price} {t("egpText")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <h3 className="font-semibold text-[20px] mt-5 md:text-[25px] text-[#0d6efd] print:text-[18px] print:mt-4">
            {t("productsText")}
          </h3>
          <Table
            scroll={{ x: "max-content" }}
            className="my-4"
            loading={loadingDetails}
            columns={columns}
            dataSource={
              orderDetails?.data?.order &&
              orderDetails?.data?.order?.products?.length &&
              orderDetails?.data?.order?.products
            }
            pagination={false}
          />

          {/* ✅ Print Footer - Only shows when printing */}
          <div className="hidden print:block print:mt-8 print:pt-4 print:border-t print:border-gray-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">التوقيع: _________________</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">شكراً لتعاملكم معنا</p>
                <p className="text-gray-400 text-xs">
                  LASERJET - جميع الحقوق محفوظة © {new Date().getFullYear()}
                </p>
              </div>
              <div>
                <p className="font-bold">
                  التاريخ: {new Date().toLocaleDateString("ar-EG")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals - These won't print */}
      <Modal
        open={editInstallmentModal}
        onCancel={() => {
          setEditInstallmentModal(false);
        }}
        onClose={() => setEditInstallmentModal(false)}
        title={t("editInstallmentText")}
        okText={t("editText")}
        cancelText={t("cancelText")}
      >
        <div className="input-group">
          <label>{t("part_status")}</label>
          <select>
            <option value="" disabled selected>
              Select Option
            </option>
            <option value="paid">Paid</option>
            <option value="unpaid">unPaid</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Pending</option>
            <option value="stopped">Stopped</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </Modal>

      <Modal
        open={openDetailModal}
        onCancel={() => setOpenDetailModal(false)}
        onClose={() => setOpenDetailModal(false)}
        title={t("detailsText")}
        footer={null}
      >
        <Table
          scroll={{ x: "max-content" }}
          loading={loadingDetails}
          columns={detailColumn}
          dataSource={rowData?.details?.length ? rowData.details : []}
        />
      </Modal>

      <Modal
        open={openImgModal}
        onCancel={() => setOpenImgModal(false)}
        onClose={() => setOpenImgModal(false)}
        title={t("imagesText")}
        footer={null}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {rowData?.images?.length &&
            rowData?.images?.map((item) => (
              <img src={item} className="w-[100px] h-[100px] rounded-md" />
            ))}
        </div>
      </Modal>

      <Modal
        open={openInstallmentModal}
        onCancel={() => setInstallmentModal(false)}
        onClose={() => setInstallmentModal(false)}
        title={t("InstallmentsText")}
        footer={null}
      >
        <Table
          scroll={{ x: "max-content" }}
          loading={loadingDetails}
          columns={installmentColumns}
          dataSource={
            rowData?.product_installments?.length
              ? rowData.product_installments
              : []
          }
        />
      </Modal>
    </div>
  );
}
