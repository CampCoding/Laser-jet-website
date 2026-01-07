import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { handleAssignPermission, handleCreateUserPermission, handleFetchPermissions } from '../../../features/permissionsSlice';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';

export default function AssignPermissionsModal({ open, setOpen, rowData }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { permissions, create_user_permissions } = useSelector(state => state?.permissions);
  const [permissionData, setPermissionData] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    dispatch(handleFetchPermissions());
  }, [dispatch]);

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
      role_id: rowData?.role_id,
      permission_ids: selectedPermissions.map(item => item.value),
    };
     
    dispatch(handleAssignPermission({ body: data_send }))
      .unwrap()
      .then(res => {
        console.log(res);
        if (res?.success) {
    
          toast.success(res?.message);
          setOpen(false);
          setSelectedPermissions([]);
        } else {
          toast.error(res?.message || res);
        }
      })
      .catch(e => console.log(e));
  }

  return (
    <Modal
      footer={null}
      open={open}
      title={t("assignPermissions")}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
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
            defaultValue={""}
            value={selectedPermissions}
            onChange={setSelectedPermissions}
          />
        </div>

        <button
          type="submit"
          className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3] p-2 rounded-md text-white flex justify-center items-center"
        >
          {create_user_permissions ? t("loadingText") : t("saveBtn")}
        </button>
      </form>
    </Modal>
  );
} 