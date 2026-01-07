import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchEmployees,
  updateEmployees,
} from "../../../features/employeesSlice";
import { Dropdown, Menu, Modal, Space, Spin, Table } from "antd";
import { FaCheck, FaEllipsisVertical, FaX } from "react-icons/fa6";
import { formattedDate } from "../../../../utils/formattedDate";
import EditEmployeeModal from "../../../components/EmployeePage/EditEmployeeModal/EditEmployeeModal";
import { useTranslation } from "react-i18next";
import EmployeeBalanceModal from "../../../components/EmployeePage/EmployeeBalanceModal/EmployeeBalanceModal";

export default function EmployeeProfile() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { employees, loading, deleteLoading } = useSelector(
    (state) => state?.employees
  );
  const navigate = useNavigate();
  const [viewModal, setViewModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [employeeBalanceModal, setEmployeeBalanceModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  const columns = [
    {
      dataIndex: "admin_id",
      key: "admin_id",
      title: "#",
    },
    {
      dataIndex: "identity_image",
      key: "identity_image",
      title: "Image",
      render: (row) => (
        <img src={row} className="object-cover w-[30px] h-[30px] rounded-md" />
      ),
    },
    {
      dataIndex: "username",
      key: "username",
      title: "User Name",
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone Number",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      render: (row) => (
        <a href={`mailto:${row}`} target="_blank">
          {row}
        </a>
      ),
    },
    {
      dataIndex: "address",
      key: "address",
      title: "Address",
    },
    {
      dataIndex: "role",
      key: "role",
      title: "Role",
    },
    {
      dataIndex: "",
      key: "",
      title: "status",
      render: (row) =>
        row?.status == "active" ? (
          <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-green-100 text-green-500">
            <FaCheck />
          </div>
        ) : (
          <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-red-100 text-red-500">
            <FaX />
          </div>
        ),
    },
    {
      dataIndex: "last_login",
      key: "last_login",
      title: "Last Login",
      render: (row) => {
        const date = formattedDate(row);
        return <p>{date}</p>;
      },
    },
    {
      dataIndex: "",
      key: "",
      title: "Verified",
      render: (row) =>
        row?.is_verified ? (
          <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-green-100 text-green-500">
            <FaCheck />
          </div>
        ) : (
          <div className="w-[30px] h-[30px] flex justify-center items-center rounded-full bg-red-100 text-red-500">
            <FaX />
          </div>
        ),
    },
    {
      dataIndex: "",
      key: "",
      title: "Actions",
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-1 p-3">
            {/* <Menu.Item
              onClick={() => {
                setPermissionModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("Permissions")}
            </Menu.Item> */}
            {/* <Menu.Item onClick={() => {
              setRowData(row)
              setEmployeeBalanceModal(true)
            }} className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center">
              {t("sendBalanceText")}
            </Menu.Item> */}
            {/* <Menu.Item
              onClick={() => {
                setDisableModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("disableText")}
            </Menu.Item> */}
            {/* <Menu.Item
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              onClick={() => {
                setEditModal(true);
                setRowData(row);
              }}
            >
              {t("editText")}
            </Menu.Item> */}
            <Menu.Item
              onClick={() => {
                navigate(`/admin_transactions/${row?.admin_id}`);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("financeTransactionsText")}
            </Menu.Item>
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
      <h3 className="font-semibold my-4 text-[25px] text-[#0d6efd]">
        {t("admin_profile")}
      </h3>

      <EditEmployeeModal
        open={editModal}
        rowData={rowData}
        setOpen={setEditModal}
        setRowData={setRowData}
      />
      <EmployeeBalanceModal
        open={employeeBalanceModal}
        setOpen={setEmployeeBalanceModal}
      />

      <Modal
        open={disableModal}
        onCancel={() => setDisableModal(false)}
        onClose={() => setDisableModal(false)}
        footer={null}
        title="Disable User"
      >
        <div className="flex flex-col gap-2">
          <h2>{t("disableEmployeeText")}</h2>

          <div className="flex items-center gap-2 mt-4">
            <button className="bg-red-700 text-white rounded-md p-3 flex justify-center items-center">
              Disable
            </button>
            <button className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-3 flex justify-center items-center">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <h3 className="font-semibold text-[25px] text-[#0d6efd]">{}</h3>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={employees?.data?.rows?.filter(
            (item) => item?.admin_id == id
          )}
        />
      )}
    </div>
  );
}
