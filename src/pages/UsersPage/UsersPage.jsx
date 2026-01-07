import { Table, Modal, Spin, Menu, Space, Dropdown, Switch } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { FaCheck, FaEllipsisVertical, FaTrash, FaX } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, fetchUserData, fetchUsers, updateUser } from "../../features/usersSlice";
import { formattedDate } from "../../../utils/formattedDate";
import { toast } from "react-toastify";
import AddUserModal from "../../components/UsersPage/AddUserModal/AddUserModal";
import EditUserModal from "../../components/UsersPage/EditUserModal/EditUserModal";
import { useTranslation } from "react-i18next";
import { fetchUserProfile } from "../../features/loginSlice";


export default function UsersPage() {
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = useState(false);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { loading, originalUsers,deleteLoading, users  , userData} = useSelector(
    (state) => state?.users
  );
  const [openDisableModal, setOpenDisableModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { t } = useTranslation();
  const [originalData , setOriginalData] = useState([]);
  const {userProfileData} = useSelector(state => state?.login);
  const [permissions , setPermissions] = useState([]);
 
  const canAddUser = true
  const canEditUser = true
  const canDeleteUser = true
  const canShowAllUser = true
  
  useEffect(() => {
    dispatch(fetchUserProfile())
  } , [dispatch])

  useEffect(() => {
    setPermissions(userProfileData?.permissions)
  } , [userProfileData])

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
      dataIndex: "national_id",
      key: "national_id",
      title: t("nationalId"),
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
      title: t("isinstallable"),
      render: (row) =>
        row?.installable == "1" ? (
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
    canShowAllUser &&  {
      key: "actions",
      title: t("actions"),
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-1 p-3">
           {canShowAllUser && <Menu.Item
              key={"user-profile"}
              onClick={() => navigate(`/profile_user/${row?.user_id}`)}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("userProfileText")}
            </Menu.Item>
      }
{
          canShowAllUser&&  <Menu.Item
              key={"disable"}
              onClick={() => {
                setOpenDisableModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("disableText")}
            </Menu.Item>}
           {(canEditUser || canShowAllUser) && <Menu.Item
              key={"edit-user"}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              onClick={() => {
                setEditModal(true);
                setRowData(row);
              }}
            >
              {t("editText")}
            </Menu.Item>}
            {(canDeleteUser ||  canShowAllUser) && <Menu.Item
              key="remove"
              onClick={() => {
                setDeleteModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
            >
              {t("deleteText")}
            </Menu.Item>}
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
  ].filter(Boolean);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  function handleDeleteUser() {
    dispatch(deleteUser({ user_id: rowData?.user_id }))
      .then((res) => {
        console.log(res);
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          setDeleteModal(false);
          dispatch(fetchUsers()); // Refresh users list
        } else {
          toast.error(res?.payload?.message);
        }
      })
      .catch((e) => console.error(e));
  }

  function handleDisableUser() {
    const newStatus = rowData?.status === "active" ? "inactive" : "active";

    const data_send = {
      ...rowData,
      status: newStatus,
    };

    dispatch(updateUser(data_send))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setOpenDisableModal(false);
          dispatch(fetchUsers()); // Refresh user list
        } else {
          toast.error(
            res?.message || "There's an error while updating user status"
          );
        }
      })
      .catch((e) => console.error(e));
  }


  const filteredUsers = useMemo(() => {
    if (!searchValue.length) return originalUsers?.data;
  
    return users?.data?.filter(
      (item) =>
        item?.username?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        item?.phone?.includes(searchValue) ||
        item?.email?.toLowerCase()?.includes(searchValue?.toLowerCase())
    );
  }, [searchValue, users, originalUsers]);
  
  useEffect(() => {
    setOriginalData(filteredUsers);
  }, [filteredUsers]);
  
  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("userPageTitle")}
        </h3>
       {(canAddUser || canShowAllUser) && <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          {t("addNewUserText")}
        </button>}
      </div>

      <AddUserModal open={openAddModal} setOpen={setOpenAddModal} />
      <EditUserModal
        open={editModal}
        setOpen={setEditModal}
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
          <button
            onClick={handleDeleteUser}
            className="bg-red-700 text-white rounded-md p-3 flex justify-center items-center"
          >
            {deleteLoading ? t("loadingText") : t("deleteText")}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-3 flex justify-center items-center"
            onClick={() => setDeleteModal(false)}
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <Modal
        open={openDisableModal}
        footer={null}
        onCancel={() => setOpenDisableModal(false)}
        onClose={() => setOpenDisableModal(false)}
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
            onClick={handleDisableUser}
            className="bg-blue-500 text-white rounded-md p-2"
          >
            {t("confirmText")}
          </button>
          <button
            onClick={() => setOpenDisableModal(false)}
            className="border border-blue-500 rounded-md p-2 text-blue-500"
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        type="text"
        placeholder={t("searchText")}
        className="my-3 border border-gray-300 p-3 w-full rounded-md outline-none"
      />
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={originalData && originalData?.length ?originalData : []}
          rowKey="id"
        />
      )}
    </div>
  );
}
