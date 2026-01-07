import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaBagShopping, FaEnvelope, FaEye, FaUser } from "react-icons/fa6";
import { TiThLargeOutline } from "react-icons/ti";
import { useEffect, useState } from "react";
import { handleFetchStatistics } from "../../features/homeSlice";
import { Spin, Table } from "antd";
import { useNavigate } from "react-router-dom";
import OrdersModal from "./OrdersModal/OrdersModal";
import { fetchUserProfile } from "../../features/loginSlice";
import { toast } from "react-toastify";
import { conifgs } from "../../config";
import { fetchEmployees } from "../../features/employeesSlice";
import { handleFetchAdminTransations } from "../../features/aminTransactionSlice";
import { IoPricetagsSharp } from "react-icons/io5";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState({});
  const { data, loading, error } = useSelector((state) => state?.statistics);
  const { t } = useTranslation();
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [employeeBalance, setEmployeeBalance] = useState({});
  const { userProfileData } = useSelector((state) => state?.login);
  const { employees } = useSelector((state) => state?.employees);
  const { admin_transactions, get_admin_transaction_loading } = useSelector(
    (state) => state?.adminTransactions
  );

  const productsColumns = [
    {
      dataIndex: "",
      key: "",
      title: t("clientText"),
      render: (row) => {
        return (
          <div>
            <div className="flex gap-3 items-center">
              <div className="flex justify-center items-center border border-gray-400 rounded-full w-[30px] h-[30px]">
                <FaUser />
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{row?.name}</p>
                <a
                  className="font-bold text-gray-600"
                  target="_blank"
                  href={row?.email}
                >
                  {row?.email}
                </a>
              </div>
            </div>
          </div>
        );
      },
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
      dataIndex: "",
      key: "",
      title: t("actions"),
      render: (row) => {
        return (
          <button
            onClick={() => {
              setRowData(row);
              setOpenOrderModal(true);
            }}
            className="p-2 bg-white shadow-2xl rounded-md"
          >
            <FaEye />
          </button>
        );
      },
    },
  ];

  const messgaesColumns = [];

  useEffect(() => {
    dispatch(handleFetchStatistics());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserProfile())
      .unwrap()
      .then((res) => {
        if (res) {
          localStorage.setItem(
            conifgs.localStorageUserPermissionsData,
            JSON.stringify(res?.permissions)
          );
        }
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      handleFetchAdminTransations({ user_id: userProfileData?.admin_id })
    )
      .unwrap()
      .then((res) => {
        console.log(res);
      });
  }, [dispatch, userProfileData]);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchUserProfile());
  }, []);

  useEffect(() => {
    console.log(userProfileData);
    setEmployeeBalance(admin_transactions?.data?.transactions[0]?.wallet);
    // console.log(employees?.data?.rows?.filter(item => item?.);
  }, [userProfileData, admin_transactions]);

  return (
    <div className="p-2 rounded-sm border border-gray-300">
      <h4 className="text-blue-500 my-3 text-[25px] font-bold">
        {t("dashboardText")}
      </h4>

      <div>
        {loading ? (
          <div className="h-screen flex justify-center items-center">
            <Spin size="large" spinning />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 items-center">
              <div className="border px-3 py-5 justify-between flex items-center border-gray-200">
                <div className="flex flex-col">
                  <p className="font-bold text-[20px]">
                    {data?.data?.pendingOrders}
                  </p>
                  <p className="font-bold text-xl">الطلبات الجديدة</p>
                </div>
                <FaBagShopping className="text-[25px] text-orange-400" />
              </div>

              <div className="border px-3 py-5 justify-between flex items-center border-gray-200">
                <div className="flex flex-col">
                  <p className="font-bold text-[20px]">
                    {data?.data?.completedOrders}
                  </p>
                  <p className="font-bold text-xl">الطلبات المكتملة</p>
                </div>
                <FaBagShopping className="text-[25px] text-green-400" />
              </div>

              <div className="border px-3 py-5 justify-between flex items-center border-gray-200">
                <div className="flex flex-col">
                  <p className="font-bold text-[20px]">
                    {data?.data?.totalProducts}
                  </p>
                  <p className="font-bold text-xl">إجمالي المنتجات</p>
                </div>
                <TiThLargeOutline className="text-2xl text-blue-500" />
              </div>

              <div className="border px-3 py-5 justify-between flex items-center border-gray-200">
                <div className="flex flex-col">
                  <p className="font-bold text-[20px]">
                    {data?.data?.totalMessages}
                  </p>
                  <p className="font-bold text-xl">إجمالي الرسائل</p>
                </div>
                <FaEnvelope className="text-2xl text-red-400" />
              </div>

              <div className="border px-3 py-5 justify-between flex items-center border-gray-200">
                <div className="flex flex-col">
                  <p className="font-bold text-[20px]">
                    {employeeBalance?.admin_wallet_balance?.toFixed(3)}
                  </p>
                  <p className="font-bold text-xl">رصيد المحفظة</p>
                </div>
                <IoPricetagsSharp className="text-2xl text-amber-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="my-3 border border-gray-200 p-3">
                <div className="flex my-3 items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-xl text-gray-600">
                      <span>{t("newOrdersText")}</span>
                      {data?.data?.lastestOrders?.length ? (
                        <span>({data?.data?.lastestOrders?.length})</span>
                      ) : null}
                    </h3>

                    <p className="font-bold">{t("manageClients")}</p>
                  </div>

                  <button
                    onClick={() => navigate("/orders")}
                    className="bg-blue-500 text-white p-2 rounded-sm"
                  >
                    {t("viewAllText")}
                  </button>
                </div>
                <Table
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: "max-content" }}
                  columns={productsColumns}
                  dataSource={data?.data?.lastestOrders}
                />
              </div>

              <div className="my-3 border border-gray-200 p-3">
                <div className="flex my-3 items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-xl text-gray-600">
                      <span>{t("lastWeekMessages")}</span>
                      {data?.data?.lastWeekMessages?.length ? (
                        <span>({data?.data?.lastWeekMessages?.length})</span>
                      ) : null}
                    </h3>

                    <p className="font-bold">{t("messagesText")}</p>
                  </div>

                  <button className="bg-blue-500 text-white p-2 rounded-sm">
                    {t("viewAllText")}
                  </button>
                </div>
                <Table
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: "max-content" }}
                  columns={messgaesColumns}
                  dataSource={data?.data?.lastWeekMessages}
                />
              </div>
            </div>

            <OrdersModal
              open={openOrderModal}
              setOpen={setOpenOrderModal}
              data={rowData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
