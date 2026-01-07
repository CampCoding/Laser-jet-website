import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleAssignPermission, handleDeleteUserPermission, handleFetchPermissions, handleFetchUserPermission } from "../../features/permissionsSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Select from "react-select";

export default function RolePermissionsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { permissions, user_permissions, get_user_permission, delete_user_permission } = useSelector(state => state?.permissions);
  const [permissionData, setPermissionData] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    dispatch(handleFetchPermissions());
    dispatch(handleFetchUserPermission({ role_id: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (permissions?.data) {
      const data = permissions.data.map((item) => ({
        label: item?.name,
        value: item?.permission_id,
      }));
      setPermissionData(data);
    }
  }, [permissions]);

  function handleSubmit(e) {
    e.preventDefault();
    const data_send = {
      role_id: id,
      permission_ids: selectedPermissions.map(item => item.value),
    };

    dispatch(handleAssignPermission({ body: data_send }))
      .unwrap()
      .then(res => {
        if (res?.success) {
          toast.success(res?.message);
          setSelectedPermissions([]);
          setOpenAssignModal(false);
          dispatch(handleFetchUserPermission({ role_id: id }));
        } else {
          toast.error(res?.message || res);
        }
      })
      .catch(e => console.log(e));
  }

  function handleDelete() {
    const data_send = {
      role_id: id,
      permission_ids: [rowData?.permission_id],
    };

    dispatch(handleDeleteUserPermission({ body: data_send }))
      .unwrap()
      .then(res => {
        if (res?.success) {
          toast.success(res?.message);
          setOpenDeleteModal(false);
          dispatch(handleFetchUserPermission({ role_id: id }));
        } else {
          toast.error(res?.message || res);
        }
      })
      .catch(e => console.log(e));
  }

  const columns = [
    {
      dataIndex: "permission_id",
      key: "permission_id",
      title: "#",
    },
    {
      dataIndex: "name",
      key: "name",
      title: t("nameText"),
    },
    {
      dataIndex: "description",
      key: "description",
      title: t("description"),
    },
    {
      dataIndex: "created_at",
      key: "created_at",
      title: t("createdAtText"),
      render: (row) => <p>{new Date(row).toLocaleDateString()}</p>,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">Role Permissions</h3>
        <button
          onClick={() => setOpenAssignModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          Assign Permission
        </button>
      </div>

      <Table
        loading={get_user_permission}
        columns={columns}
        dataSource={user_permissions?.data || []}
        scroll={{ x: "max-content" }}
      />

      {/* Assign Permissions Modal */}
      <Modal
        footer={null}
        open={openAssignModal}
        title={t("assignNewPermissions")}
        onCancel={() => setOpenAssignModal(false)}
        onClose={() => setOpenAssignModal(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="input-group">
            <label>{t("permissions")}</label>
            <Select
              isMulti
              name="permissions"
              options={permissionData}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          </div>

          <button
            type="submit"
            className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3] p-2 rounded-md text-white flex justify-center items-center"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
} 