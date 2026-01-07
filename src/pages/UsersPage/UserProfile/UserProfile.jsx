import { Dropdown, Table, Space, Menu, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import UserViewModal from "../../../components/UsersPage/UserViewModal/UserViewModal";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchUserData,
  handleCreateDeposite,
} from "../../../features/usersSlice.js";
import EditUserModal from "../../../components/UsersPage/EditUserModal/EditUserModal.jsx";
import { toast } from "react-toastify";
import { fetchUserProfile } from "../../../features/loginSlice.js";

export default function UserProfile() {
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState({});

  const [depositeData, setDepositeData] = useState({
    price: null,
  });
  const [imgs, setImgs] = useState({
    file: null,
    url: "",
  });

  const [rowData, setRowData] = useState({});
  const {
    fetchUserDataLoading,
    addDepositeLoading,
    userData: data,
  } = useSelector((state) => state?.users);
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation();
  const [disableModal, setDisableModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [depositeModal, setDepositeModal] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const { userProfileData } = useSelector((state) => state?.login);

  const canEditDocs = permissions?.some((item) => item?.permission_id == 32);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setPermissions(userProfileData?.permissions);
  }, [userProfileData]);

  useEffect(() => {
    if (userId)
      dispatch(fetchUserData(userId)).then((res) => {
        console.log(res);
        setUserProfile(res?.payload?.data);
      });
  }, [userId, dispatch]);

  // Helper function: opens a new window with invoice data and prints it.
  function printInvoice({ price, user }) {
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            .invoice { margin: 20px auto; max-width: 400px; border: 1px solid #ddd; padding: 20px; }
            .invoice p { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <h1>Deposit Invoice</h1>
            <p><strong>User ID:</strong> ${user?.user_id || userId}</p>
            <p><strong>User Name:</strong> ${user?.username || userId}</p>
            <p><strong>Deposit Amount:</strong> ${price}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  function hanleSendDeposite() {
    console.log(depositeData);
    dispatch(handleCreateDeposite({ body: depositeData, user_id: userId }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setDepositeModal(false);
          // Print invoice using the deposit amount and user info
          printInvoice({ price: depositeData.price, user: userProfile });
          setDepositeData({ price: null });
        } else {
          toast(res?.message || res || "there's an error while depositing");
        }
      })
      .catch((e) => console.log(e));
  }

  const columns = [
    {
      dataIndex: "user_id",
      key: "user_id",
      title: "#",
    },
    {
      dataIndex: "username",
      key: "username",
      title: t("username"),
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: t("phone"),
    },
    {
      dataIndex: "national_id",
      key: "nationalId",
      title: t("nationalId"),
    },
    {
      dataIndex: "address",
      key: "address",
      title: t("addressText"),
    },
    {
      key: "actions",
      title: t("actions"),
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-1 !p-2">
            <Menu.Item
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
              onClick={() => {
                setDepositeModal(true);
                setDepositeData({ ...depositeData, ...row });
              }}
            >
              {t("depositeText")}
            </Menu.Item>
            <Menu.Item
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
              onClick={() => {
                navigate("/user_orders/" + row?.user_id);
              }}
            >
              {t("ordersText")}
            </Menu.Item>

            <Menu.Item
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
              onClick={() => {
                navigate("/account-requests/" + row?.user_id);
              }}
            >
              {t("accountRequests")}
            </Menu.Item>
            <Menu.Item
              onClick={() => navigate(`/user_finance_transactions/${userId}`)}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
            >
              {t("financeTransactionsText")}
            </Menu.Item>
            {canEditDocs && (
              <Menu.Item
                onClick={() => navigate(`/employee-docs/${userId}`)}
                className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              >
                ملفات مستخدم
              </Menu.Item>
            )}
            <Menu.Item
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              onClick={() => {
                setViewModal(true);
                setRowData(row);
              }}
            >
              {t("editText")}
            </Menu.Item>
            {/* <Menu.Item
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
              onClick={() => {
                setDeleteModal(true);
                setRowData(row);
              }}
            >
              {t("deleteText")}
            </Menu.Item> */}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Space>
              <FaEllipsisVertical />
            </Space>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("userProfileText")}
        </h3>
      </div>

      <Modal
        open={depositeModal}
        onCancel={() => setDepositeModal(false)}
        onClose={() => setDepositeModal(false)}
        title={t("depositeText")}
        footer={null}
      >
        <div>
          <div className="input-group my-3">
            <label>{t("Current Balance")}</label>
            <input type="number" disabled value={depositeData?.balance} />
          </div>
          <div className="input-group my-3">
            <label>{t("priceText")}</label>
            <input
              type="number"
              value={depositeData?.price}
              onChange={(e) =>
                setDepositeData({ ...depositeData, price: e.target.value })
              }
            />
          </div>

          <button
            onClick={hanleSendDeposite}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            {addDepositeLoading ? t("loadingText") : t("addText")}
          </button>
        </div>
      </Modal>

      <Modal
        open={disableModal}
        onCancel={() => setDisableModal(false)}
        onClose={() => setDisableModal(false)}
        footer={null}
        title={t("disableUserText")}
      >
        <div className="flex flex-col gap-2">
          <div className="input-group">
            <label>{t("reasonText")}</label>
            <input type="text" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button className="bg-red-700 text-white rounded-md p-3 flex justify-center items-center">
              {t("disableText")}
            </button>
            <button className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-3 flex justify-center items-center">
              {t("cancelText")}
            </button>
          </div>
        </div>
      </Modal>
      <EditUserModal
        open={viewModal}
        setOpen={setViewModal}
        rowData={rowData}
        setRowData={setRowData}
      />

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
        footer={null}
      >
        <h3>{t("areYouSureDeleteUserText")}</h3>
        <div className="flex items-center gap-2 mt-4">
          <button className="bg-red-700 text-white rounded-md p-3 flex justify-center items-center">
            {t("deleteText")}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-3 flex justify-center items-center"
            onClick={() => setDeleteModal(false)}
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <input
        type="text"
        placeholder={t("searchText")}
        className="my-3 border border-gray-300 p-3 w-full rounded-md outline-none"
      />
      <Table
        loading={fetchUserDataLoading}
        columns={columns}
        dataSource={[data?.data]}
        rowKey="id"
      />
    </div>
  );
}
