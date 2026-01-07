import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
// import MultiSelect from "../../MultiSelect/MultiSelect";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
// import { handleFetchPermissions } from "../../../../features/permissionsSlice";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { handleCreatePermission, handleCreateUserPermission, handleDeleteUserPermission, handleFetchPermissions, handleFetchUserPermission } from "../../features/permissionsSlice";
import { toast } from "react-toastify";

export default function UserPermissions() {
    const {t} = useTranslation();
    const {id} = useParams();
  const [openAddModal , setOpenAddModal] = useState(false);
  const [openDeleteModal , setOpenDeleteModal] = useState(false);
  const [rowData , setRowData] = useState({})
  const { permissions , create_user_permissions , get_user_permission , user_permissions , delete_user_permission  } = useSelector((state) => state?.permissions);
  const [permmissionData, setPermissionsData] = useState([]);
  const dispatch = useDispatch();
  const [permissionIds, setPermissionsIds] = useState([]);
  
  const columns = [
    {
        dataIndex:"permission_id",
        key:"permission_id",
        title:"#"
    },
    {
        dataIndex:"name",
        key:"name",
        title:t("nameText")
    },
    {
        dataIndex:"description",
        key:"description",
        title:t("description"),
    },
    {
        dataIndex:"created_at",
        key:"created_at",
        title:t("created_atText"),
        render:(row) => <p>{new Date(row)?.toLocaleDateString()}</p>
    },
    {
        title: "Actions",
        render: (row) => (
          <div className="flex gap-2 items-center">
            <button
              className="bg-red-700 text-white rounded-md p-2 flex justify-center items-center"
              onClick={() => {
                setRowData(row);
                setOpenDeleteModal(true);
              }}
            >
              {t("deleteText")}
            </button>
          </div>
        ),
      }
  ]

  useEffect(() => {
    dispatch(handleFetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    console.log(permissions?.data);
    const data = permissions?.data?.map((item) => ({
      label: item?.name,
      value: item?.permission_id,
    }));
    console.log(data);
    setPermissionsData(data);
  }, [permissions]);

  function handleChange(e) {
    console.log(e);
    console.log(e.map((item) => item?.value));
    setPermissionsIds(e.map((item) => item?.value));
  }

  useEffect(() => {
    dispatch(handleFetchUserPermission({role_id : id}))
    .unwrap()
    .then(res => console.log(res))
  } , [id])

  function handleSubmit(e) {
    e.preventDefault()
    const data_send = {
      role_id: id,
      permission_ids: permissionIds,
    };
    console.log(data_send);
    dispatch(handleCreateUserPermission({body : data_send}))
    .unwrap()
    .then(res =>{
        if(res?.success){
            toast.success(res?.message);
            dispatch(handleFetchUserPermission({role_id:id}))
            setOpenAddModal(false)
        }else {
            toast.error(res || res?.message);
        }
    }).catch(e => console.log(e))
  }

  function handleDelete(e) {
    e.preventDefault()
    const data_send = {
      role_id: id,
      permission_ids: [rowData?.permission_id],
    };
    console.log(data_send);
    dispatch(handleDeleteUserPermission({body : data_send}))
    .unwrap()
    .then(res =>{
        if(res?.success){
            toast.success(res?.message);
            dispatch(handleFetchUserPermission({role_id:id}))
            setOpenDeleteModal(false)
        }else {
            toast.error(res || res?.message);
        }
    }).catch(e => console.log(e))
  }
  return (
   <div>
      <div className="flex justify-between items-center">
      <h3 className="font-semibold text-[25px] text-[#0d6efd]">صلاحيات الموظف</h3>
        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          {t("addText")}
        </button>
      </div>

      <Modal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onClose={() => setOpenDeleteModal(false)}
        footer={null}
      >
        <h3>هل تريد حذف هذه الصلاحية</h3>
        <div className="flex items-center gap-2 mt-4">
          <button onClick={handleDelete} className="bg-red-700 text-white rounded-md p-2 flex justify-center items-center">
            {delete_user_permission ? t("loadingText") : t("deleteText")}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-2 flex justify-center items-center"
            onClick={() => setOpenDeleteModal(false)}
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>
      
      <Modal
      open={openAddModal}
      onCancel={() => setOpenAddModal(false)}
      onClose={() => setOpenAddModal(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="input-group">
          <label>Permissions</label>
          <Select
            onChange={handleChange}
            isMulti
            name="Permission"
            options={permmissionData}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <button className="border bg-[#0d6efd] mt-3 border-[#0d6efd] text-white outline-none rounded-md p-2 flex justify-center items-center">
          {create_user_permissions ? t("loadingText") : t("saveBtn")}
        </button>
      </form>
    </Modal>

    <Table className="mt-4" columns={columns} dataSource={user_permissions?.data}  loading={get_user_permission}/>
   </div>
  );
}
