import React, { useEffect, useState } from "react";
import AddEmployeeModal from "../../components/EmployeePage/AddEmployeeModal/AddEmployessModal";
import { Dropdown, Menu, Modal, Space, Spin, Switch, Table } from "antd";
import { FaCheck, FaEllipsisVertical, FaX } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ViewEmployeeModal from "../../components/EmployeePage/ViewEmployeeModal/ViewEmployeeModal";
import EmployeeBalanceModal from "../../components/EmployeePage/EmployeeBalanceModal/EmployeeBalanceModal";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployees,
  fetchEmployees,
  updateEmployees,
} from "../../features/employeesSlice";
import { toast } from "react-toastify";
import { formattedDate } from "../../../utils/formattedDate";
import EditEmployeeModal from "../../components/EmployeePage/EditEmployeeModal/EditEmployeeModal";
import { useTranslation } from "react-i18next";

export default function EmployeePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [viewModal, setViewModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sendBalanceModal, setSendBalanceModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [disableModal, setDisableModal] = useState(false);
  const [disableLoading , setDisableLoading] = useState(false);
  const [employeeBalanceModal, setEmployeeBalanceModal] = useState(false);
  const [permissionModal, setPermissionModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const { employees, loading, deleteLoading , editLoading } = useSelector(
    (state) => state?.employees
  );
  const columns = [
    {
      dataIndex: "admin_id",
      key: "admin_id",
      title: "#",
    },
    {
      dataIndex: "identity_image",
      key: "identity_image",
      title: t("imageText"),
      render: (row) => (
        <img src={row} className="object-cover w-[30px] h-[30px] rounded-md" />
      ),
    },
    {
      dataIndex: "username",
      key: "username",
      title: t("nameText"),
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: t("phone"),
    },
    {
      dataIndex: "email",
      key: "email",
      title: t("email"),
      render: (row) => (
        <a href={`mailto:${row}`} target="_blank">
          {row}
        </a>
      ),
    },
    {
      dataIndex: "address",
      key: "address",
      title: t("addressText"),
    },
    {
      dataIndex: "role",
      key: "role",
      title: t("role"),
    },
    {
      dataIndex: "",
      key: "",
      title: t("status"),
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
      dataIndex: "",
      key: "",
      title: t("blockedText"),
      render: (row) =>
        row?.status == "inactive" ? (
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
      title: t("lastlogin"),
      render: (row) => {
        const date = formattedDate(row);
        return <p>{date}</p>;
      },
    },
    {
      dataIndex: "",
      key: "",
      title: t("verified"),
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
      title: t("actions"),
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-1 p-3">
            <Menu.Item
              onClick={() => {
                navigate(`/employee_profile/${row?.admin_id}`);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("admin_profile")}
            </Menu.Item>
            {/* <Menu.Item
              onClick={() => {
                setViewModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("viewText")}
            </Menu.Item> */}

            {/* <Menu.Item
              onClick={() => navigate(`/employee-docs/1`)}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              Edit Docs
            </Menu.Item> */}
            {/* <Menu.Item
              onClick={() => {
                setPermissionModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("Permissions")}
            </Menu.Item> */}
            <Menu.Item
              onClick={() => {
                setRowData(row);
                setSendBalanceModal(true);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("sendBalanceText")}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setDisableModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("disableText")}
            </Menu.Item>
            <Menu.Item
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              onClick={() => {
                setEditModal(true);
                setRowData(row);
              }}
            >
              {t("editText")}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setDeleteModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("deleteText")}
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
  function handleDisableEmployee() {
    const formData = new FormData();
    formData.append("admin_id", rowData?.admin_id);
    formData.append("status", rowData?.status);
    dispatch(updateEmployees(formData))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setDisableModal(false);
        } else {
          toast.error(res || res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    dispatch(fetchEmployees(searchValue));
  }, [searchValue]);

  function handleDeleteEmployee() {
    const data_send = {
      admin_id: rowData?.admin_id,
    };
    dispatch(deleteEmployees(data_send))
      .then((res) => {
        console.log(res);
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          setDeleteModal(false);
          dispatch(fetchEmployees());
        } else {
          toast.success(res?.payload?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    console.log(employees);
  }, [employees]);

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">{t("employee")}</h3>
        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          {t("addEmployee")}
        </button>
      </div>

      <Modal
        open={disableModal}
        footer={null}
        onCancel={() => setDisableModal(false)}
        onClose={() => setDisableModal(false)}
      >
        <h3 className="my-3">
          {rowData?.status == "active" ? t("blockUser") : t("unBlockUser")}
        </h3>
        <Switch
          className="mt-3"
          checked={rowData?.status === "inactive"}
          onChange={() =>
            setRowData({
              ...rowData,
              status: rowData?.status === "active" ? "inactive" : "active",
            })
          }
        />

        <div className="flex gap-2 items-center mt-4">
          <button
            onClick={handleDisableEmployee}
            className="bg-blue-500 text-white rounded-md p-2"
          >
            { editLoading ?t("loadingText") :t("confirmText")}
          </button>
          <button
            onClick={() => setDisableModal(false)}
            className="border border-blue-500 rounded-md p-2 text-blue-500"
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <EmployeeBalanceModal
        open={sendBalanceModal}
        setOpen={setSendBalanceModal}
        rowData={rowData}
        setRowData={setRowData}
      />

      <ViewEmployeeModal
        viewModal={viewModal}
        setViewModal={setViewModal}
        rowData={rowData}
        setRowData={setRowData}
      />
      <EditEmployeeModal
        open={editModal}
        rowData={rowData}
        setOpen={setEditModal}
        setRowData={setRowData}
      />

      {/* <Modal
        open={permissionModal}
        onCancel={() => setPermissionModal(false)}
        onClose={() => setPermissionModal(false)}
        footer={null}
        title="Add Permission"
      >
        <form>
          <div className="input-group">
            <label>Permissions</label>
            <select>
              <option disabled selected>
                Choose Permission
              </option>
              <option>خدمه العملاء - البائعين</option>
              <option>مدير فرع</option>
              <option>محصل</option>
              <option>اداره شئون الادارات القانونيه</option>
              <option>محصل غير معتمد</option>
            </select>
          </div>

          <button className="bg-[#0d6efd] mt-4 hover:bg-[#104ba3]  text-white p-2 rounded-sm w-full">
            Save
          </button>
        </form>
      </Modal> */}

      {/* <Modal
        open={disableModal}
        onCancel={() => setDisableModal(false)}
        onClose={() => setDisableModal(false)}
        footer={null}
        title="Disable User"
      >
        <div className="flex flex-col gap-2">
          <div className="input-group">
            <label>Reason</label>
            <input type="text" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button className="bg-red-700 text-white rounded-md p-3 flex justify-center items-center">
              Disable
            </button>
            <button className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-3 flex justify-center items-center">
              Cancel
            </button>
          </div>
        </div>
      </Modal> */}

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
        footer={null}
      >
        <h3>Are you sure you want to delete this user?</h3>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleDeleteEmployee}
            className="bg-red-700 text-white rounded-md p-3 flex justify-center items-center"
          >
            {deleteLoading ? "Loading..." : "Remove"}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-3 flex justify-center items-center"
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <AddEmployeeModal open={openAddModal} setOpen={setOpenAddModal} />

      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search Employee..."
        className="w-full rounded-md p-3 my-3 border border-gray-300 outline-hidden"
      />
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={employees?.data?.rows}
        />
      )}
    </div>
  );
}
