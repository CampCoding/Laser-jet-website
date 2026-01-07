import { Spin, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleFetcOrders } from "../../../features/ordersSlice";
import { useParams, useSearchParams } from "react-router-dom";
import { handleFetchAdminTransactions } from "../../../features/transactionSlice";
import { fetchUserProfile } from "../../../features/loginSlice";

const logoURL = "https://laserjet-8405a.web.app/media/logos/logo.png";
export default function InvoiceDetails() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("order_number"));
  const orderNumber = searchParams.get("order_number");
  const productId = searchParams.get("product_id");
  const userId = searchParams.get("user_id");
  const dispatch = useDispatch();
  const printRef = useRef(null);
  const { data, loading } = useSelector((state) => state?.orders);
  const { invoiceId } = useParams();
  const [selectedOrder, setSelectedOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [note, setNote] = useState("");
  const [imgs, setImgs] = useState({ file: null, url: "" });
  const [imgLoading, setImgLoading] = useState(false);
  const [allInstallments, setAllInstallments] = useState([]);
  const { userProfileData } = useSelector((state) => state?.login);
  const [permissions, setPermissions] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading , setIsLoading] =useState(false);

  const canExportReport = permissions?.some(
    (item) => item?.name === "تصدير التقارير"
  );
  const canShowAllReports = permissions?.some(
    (item) => item?.name === "إدارة التقارير"
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setPermissions(userProfileData?.permissions);
  }, [userProfileData]);

  useEffect(() => {
    console.log(orderNumber, productId, userId);
  }, [orderNumber, productId, userId]);

  const columns = [
    {
      dataIndex: "installment_id",
      key: "installment_id",
      title: "#",
    },
    {
      dataIndex: "product_id",
      key: "product_id",
      title: t("productId"),
    },
    {
      dataIndex: "order_number",
      key: "order_number",
      title: t("orderNo"),
    },
    {
      dataIndex: "product",
      key: "product",
      title: t("productTitle"),
    },
    {
      dataIndex: "part_value",
      key: "part_value",
      title: t("installmentValue"),
    },
    {
      dataIndex: "part_status",
      key: "part_status",
      title: t("part_status"),
    },
    {
      dataIndex: "part_due_date",
      key: "part_due_date",
      title: t("createdAtText"),
      render: (row) => {
        console.log(row);
        console.log(new Date(row)?.toLocaleString());
        return <p>{new Date(row)?.toLocaleString()}</p>;
      },
    },
    {
      dataIndex: "",
      key: "",
      title: t("username"),
      render: (row) => (
        <div className="flex gap-2">
          <h6>{row?.user?.name}</h6>
        </div>
      ),
    },
    {
      dataIndex: "",
      key: "",
      title: t("phone"),
      render: (row) => (
        <div className="flex gap-2">
          <h6>{row?.user?.phone}</h6>
        </div>
      ),
    },
    {
      dataIndex: "value",
      key: "value",
      title: t("totalPriceText"),
    },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgs({
          file: file,
          url: reader?.result,
        });
        setImgLoading(false);
      };
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=900,height=600");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice_${allInstallments[0]?.user?.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Cairo', Arial, sans-serif;
              padding: 20px;
              margin: 0;
              direction: rtl;
            }
            .invoice-container {
              width: 90%;
              margin: auto;
              padding: 20px;
              border: 1px solid #ddd;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              background: #fff;
            }
            .invoice-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .invoice-header img,
            .main-img {
              max-width: 50px !important;
              width:100%;
              margin-bottom: 15px;
            }
            .customer-info {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .customer-info h4 {
              margin: 8px 0;
              color: #333;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: center;
            }
            th {
              background-color: #f4f4f4;
              font-weight: 600;
            }
            .notes-section {
              margin-top: 30px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .notes-section h3 {
              color: #333;
              margin-bottom: 10px;
            }
            .image-section {
              margin-top: 20px;
              text-align: center;
            }
            .image-section img {
              max-width: 200px;
              border: 1px solid #ddd;
              padding: 5px;
              border-radius: 4px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none;
              }
              .ant-pagination {
                display: none !important;
              }
              .invoice-container {
                box-shadow: none;
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h2>فاتورة</h2>
            </div>
            
            <div class="customer-info">
              <h4>الاسم : ${allInstallments[0]?.user?.name}</h4>
              <h4>رقم الهاتف : ${allInstallments[0]?.user?.phone}</h4>
              <h4>رقم البطاقه : ${allInstallments[0]?.user?.national_id}</h4>
            </div>

            ${printContent}
            
            ${note ? `
              <div class="notes-section">
                <h3>ملاحظات :</h3>
                <p>${note}</p>
              </div>
            ` : ''}
            
            ${imgs?.url ? `
              <div class="image-section">
                <h3>الصورة المرفقة:</h3>
                <img src="${imgs?.url}" alt="Attached Image"/>
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
    }, 3000);
  };

  useEffect(() => {
  setIsLoading(true);
    dispatch(handleFetchAdminTransactions())
      ?.unwrap()
      ?.then((res) => {
        if (res?.success) {
          console.log(
            res?.data?.installments?.filter(
              (item) => item?.user?.user_id == userId
            )
          );
          setAllInstallments(
            res?.data?.installments
              ?.filter((item) => item?.user?.user_id == userId)
              .map((install) => ({
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
          setIsLoading(false);
          // console.log(
          //   res?.data?.installments[0]?.data
          //     ?.filter(
          //       (item) =>
          //         // item?.product_id == productId &&
          //         // item?.order_number == orderNumber &&
          //         item?.user?.user_id == userId
          //     )
          //     ?.map((install) => ({
          //       ...install,
          //       details: install?.details?.map((detail) => ({
          //         ...detail,
          //         product_id: install?.product_id,
          //         product: install?.product,
          //         value: install?.value,
          //         order_number: install?.order_number,
          //         installment_id: install?.installment_id,
          //         user: install?.user,
          //       })),
          //     }))
          // );
          // setAllInstallments(
          //   res?.data?.installments
          //   ?.filter(
          //     (item) =>
          //       item?.product_id == productId &&
          //       item?.order_number == orderNumber &&
          //       item?.user?.user_id == userId
          //   )
          //   ?.map((install) => ({
          //     ...install,
          //     details: install?.details?.map((detail) => ({
          //       ...detail,
          //       product_id: install?.product_id,
          //       product: install?.product,
          //       value: install?.value,
          //       order_number: install?.order_number,
          //       installment_id: install?.installment_id,
          //       user: install?.user,
          //     })),
          //   })))
        }
      });
  }, [dispatch, orderNumber, productId, userId]);

  useEffect(() => {
    console.log(allInstallments);
    // console.log("details", ...allInstallments?.map(item => item?.details));
  }, [allInstallments]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div
          ref={printRef}
          className="invoice-container bg-white pb-4 w-[1200px] shadow-md p-6 rounded-md border border-gray-300"
        >
          <div className="border-b main-img border-b-gray-200 pb-4 text-center">
           {!isPrinting && <img
              className="object-cover h-[80px] mx-auto"
              src={logoURL}
              alt="Company Logo"
            />
           }
            <h2 className="text-2xl font-bold mt-4">فاتورة</h2>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg my-4">
            <h4 className="text-lg mb-2">الاسم : {allInstallments[0]?.user?.name}</h4>
            <h4 className="text-lg mb-2">رقم الهاتف : {allInstallments[0]?.user?.phone}</h4>
            <h4 className="text-lg">رقم البطاقه : {allInstallments[0]?.user?.national_id}</h4>
          </div>

          <Table
            columns={columns}
            dataSource={allInstallments?.map(item => item?.details).flat()}
            loading={loading}
            pagination={!isPrinting}
            className="invoice-table"
          />

          <div className="mt-6 no-print">
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">{t("notesText")}</h3>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                onChange={(e) => setNote(e.target.value)}
                value={note}
                placeholder="Add your notes here..."
              />
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">{t("imageText")}</h3>
              <input
                type="file"
                className="block w-full border border-gray-300 p-2 rounded-md"
                onChange={handleImageUpload}
              />
            </div>

            {imgs?.url && (
              <div className="text-center">
                <img
                  src={imgs?.url}
                  className="w-[200px] h-[200px] rounded-md object-cover border border-gray-300 mx-auto"
                  alt="Uploaded"
                />
              </div>
            )}
          </div>

          {canExportReport && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md w-full mt-4 no-print transition-colors"
              onClick={handlePrint}
            >
              {imgLoading ? t("loadingText") : t("printText")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
