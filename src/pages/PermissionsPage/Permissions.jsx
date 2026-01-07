import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  handleCreatePermission,
  handleDeletePermission,
  handleFetchPermissions,
  handleUpdatePermission,
} from "../../features/permissionsSlice";
import { Modal, Table } from "antd";
import { toast } from "react-toastify";
import { fetchUserProfile } from "../../features/loginSlice";

export default function Permissions() {
  const { t } = useTranslation();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [permissionData, setPermissionData] = useState({
    name: "",
    description: "",
  });
  const dispatch = useDispatch();
  const {
    permissions,
    get_permissions,
    create_permission,
    edit_permission,
    delete_permission,
  } = useSelector((state) => state?.permissions);
  const { userProfileData } = useSelector((state) => state?.login);
  const [permissionsData, setPermissionsData] = useState([]);

  const canAddPermission = true
  const canEditPermission = true
  const canDeletePermission = true
  const canShowAllPermission = true

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setPermissionsData(userProfileData?.permissions);
  }, [userProfileData]);

  const columns = [
    {
      key: "permission_id",
      dataIndex: "permission_id",
      title: "#",
    },
    {
      key: "name",
      dataIndex: "name",
      title: t("nameText"),
    },
    {
      key: "description",
      dataIndex: "description",
      title: t("description"),
    },
    {
      key: "created_at",
      dataIndex: "created_at",
      title: t("created_atText"),
      render: (row) => <p>{new Date(row).toLocaleDateString()}</p>,
    },
    canShowAllPermission && {
      title: t("actions"),
      render: (row) => (
        <div className="flex gap-2 items-center">
          {canEditPermission && (
            <button
              onClick={() => {
                setRowData(row);
                setOpenEditModal(true);
              }}
              className="bg-blue-600 text-white rounded-md p-2 flex justify-center items-end"
            >
              {t("editText")}
            </button>
          )}

          {canDeletePermission && (
            <button
              onClick={() => {
                setRowData(row);
                setOpenDeleteModal(true);
              }}
              className="bg-red-600 text-white rounded-md p-2 flex justify-center items-end"
            >
              {t("deleteText")}
            </button>
          )}
        </div>
      ),
    },
  ].filter(Boolean);

  useEffect(() => {
    dispatch(handleFetchPermissions());
  }, [dispatch]);

  function handleSubmit(e) {
    e.preventDefault();

    dispatch(handleCreatePermission({ body: permissionData }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          dispatch(handleFetchPermissions());
          setOpenAddModal(false);
          setPermissionData({
            name: "",
            description: "",
          });
        } else {
          toast.error(res || res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  function handleEdit(e) {
    e.preventDefault();

    dispatch(handleUpdatePermission({ body: rowData }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          dispatch(handleFetchPermissions());
          setOpenEditModal(false);
        } else {
          toast.error(res || res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  function handleDelete(e) {
    e.preventDefault();

    dispatch(
      handleDeletePermission({
        body: { permission_id: rowData?.permission_id },
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          dispatch(handleFetchPermissions());
          setOpenDeleteModal(false);
        } else {
          toast.error(res || res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <div>
      <div className="flex gap-2 justify-between items-center">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("Permissions")}
        </h3>
      </div>

      <Modal
        footer={null}
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        onClose={() => setOpenAddModal(false)}
        title="Add Permission"
      >
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{t("name")}</label>
            <input
              type="text"
              value={permissionData?.name}
              onChange={(e) =>
                setPermissionData({ ...permissionData, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("description")}</label>
            <input
              type="text"
              value={permissionData?.description}
              onChange={(e) =>
                setPermissionData({
                  ...permissionData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <button className="bg-blue-600  mt-3 text-white p-2 rounded-md">
            {create_permission ? t("loadingText") : t("saveBtn")}
          </button>
        </form>
      </Modal>

      <Modal
        footer={null}
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        onClose={() => setOpenEditModal(false)}
        title="Edit Permission"
      >
        <form onSubmit={handleEdit}>
          <div className="input-group">
            <label>{t("name")}</label>
            <input
              type="text"
              value={rowData?.name}
              onChange={(e) => setRowData({ ...rowData, name: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label>{t("description")}</label>
            <input
              type="text"
              value={rowData?.description}
              onChange={(e) =>
                setRowData({ ...rowData, description: e.target.value })
              }
            />
          </div>

          <button className="bg-blue-600  mt-3 text-white p-2 rounded-md">
            {edit_permission ? t("loadingText") : t("saveBtn")}
          </button>
        </form>
      </Modal>

      <Modal
        open={openDeleteModal}
        footer={null}
        onCancel={() => setOpenDeleteModal(false)}
        onClose={() => setOpenDeleteModal(false)}
      >
        <h3>هل تريد حذف هذه الصلاحية؟</h3>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white rounded-md p-2 flex justify-center items-center"
          >
            {delete_permission ? t("loadingText") : t("deleteText")}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-2 flex justify-center items-center"
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Table
        className="my-3"
        loading={get_permissions}
        columns={columns}
        dataSource={permissions?.data || []}
      />
    </div>
  );
}
