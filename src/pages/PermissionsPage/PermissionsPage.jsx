import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import MultiSelect from "../../components/MultiSelect/MultiSelect";
import { useTranslation } from "react-i18next";
import AddPermissionsModal from "../../components/PermissionsPage/AddPermissionsModal/AddPermissionsModal";
import ViewPermissionsModal from "../../components/PermissionsPage/ViewPermissionsModal/ViewPermissionsModal";
import { useDispatch, useSelector } from "react-redux";
import { handleCreateUserPermission, handleDeleteRole, handleFetchPermissions, handleFetchRoles } from "../../features/permissionsSlice";
import { toast } from "react-toastify";
import EditPermissionsModal from "../../components/PermissionsPage/EditPermissionsModal/EditPermissionsModal";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../features/loginSlice";
import AssignPermissionsModal from "../../components/PermissionsPage/AssignPermissionsModal/AssignPermissionsModal";

const data = [
  {
    id: 1,
    name: "مدير فرع",
    desc: "تسجيل المبالغ المحصلة وتحديث الكشوفات بشكل مستمر وتنفيذ التعليمات المتعلقة بسرية المعاملات المالية والتعامل معها بالحرفية والمهنية العالية. 1-تحصيل 2-بيع منتج 3-بالتقسيط 4- تفصيل حسبات العميل",
  },
];

export default function PermissionsPage() {
  const {roles ,permissions : allPermissions , get_role_loading, delete_role_loading} =  useSelector(state => state?.permissions);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewPermissionModal, setViewPermissionModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [openEditModal , setOpenEditModal] = useState(false);
  const [assignPermissionsModal, setAssignPermissionsModal] = useState(false);
  
  const {userProfileData} = useSelector(state => state?.login);
    const [permissions , setPermissions] = useState([]);

   
    const canAddRole = true
    const canEditRole = true
    const canDeleteRole = true
    const canShowAllRole = true


     useEffect(() => {
        dispatch(fetchUserProfile())
      } , [dispatch])
    
      useEffect(() => {
        setPermissions(userProfileData?.permissions)
      } , [userProfileData])

      useEffect(() => {
        dispatch(handleFetchPermissions());
      }, [dispatch]);
      

  const columns = [
    {
      dataIndex: "role_id",
      key: "role_id",
      title: "#",
    },
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
    },
    {
      dataIndex: "description",
      key: "description",
      title: "Description",
    },
    {
      dataIndex:"created_at",
      key:"created_at",
      title:t("createdAtText"),
      render:(row) => <p>{new Date(row).toLocaleDateString}</p>
    },
   canShowAllRole &&  {
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          {canEditRole && <button
            onClick={() => {
              setOpenEditModal(true);
              setRowData(row);
            }}
            className="bg-green-700  p-2 rounded-md text-white flex justify-center items-center"
          >
            Edit
          </button>}
          {canDeleteRole && <button
            className="bg-red-700 text-white rounded-md p-2 flex justify-center items-center"
            onClick={() => {
              setRowData(row);
              setDeleteModal(true);
            }}
          >
            Remove
          </button>}
          {/* <button
            className="bg-blue-700 text-white rounded-md p-2 flex justify-center items-center"
            onClick={() => {
              setRowData(row);
              setAssignPermissionsModal(true);
            }}
          >
            Assign Permission
          </button> */}
          <button
            className="bg-blue-700 text-white rounded-md p-2 flex justify-center items-center"
            onClick={() => {
              navigate(`/role-permissions/${row.role_id}`);
            }}
          >
            View Permission
          </button>
        </div>
      ),
    },
  ].filter(Boolean);

  useEffect(() => {
    dispatch(handleFetchRoles())
    .unwrap()
    .then(res => console.log(res))
  } ,[dispatch])


  
  function handleDelete() {
    const data_send = {
      role_id : rowData?.role_id
    }

    dispatch(handleDeleteRole({body : data_send}))
    .unwrap()
    .then(res => {
      if(res?.success) {
        toast.success(res?.message);
        dispatch(handleFetchRoles())
        setDeleteModal(false)
      }else {
        toast.error(res?.message || res)
      }
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    console.log(allPermissions?.data);
  } ,[allPermissions])

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">الأدوار</h3>
       {(canAddRole || canShowAllRole) && <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
        >
          {t("addText")}
        </button>}
      </div>

      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        onClose={() => setDeleteModal(false)}
        footer={null}
      >
        <h3>Are you sure you want to delete this employee?</h3>
        <div className="flex items-center gap-2 mt-4">
          <button onClick={handleDelete} className="bg-red-700 text-white rounded-md p-2 flex justify-center items-center">
            {delete_role_loading ? t("loadingText") : t("deleteText")}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-2 flex justify-center items-center"
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <AddPermissionsModal open={openAddModal} setOpen={setOpenAddModal}/>
      <EditPermissionsModal open={openEditModal} setOpen={setOpenEditModal} rowData={rowData} setRowData={setRowData} />
      <ViewPermissionsModal open={viewPermissionModal} setOpen={setViewPermissionModal} setRowData={setRowData} rowData={rowData}/>
      <AssignPermissionsModal open={assignPermissionsModal} setOpen={setAssignPermissionsModal} rowData={rowData} />

      <Table loading={get_role_loading} scroll={{x:"max-content"}} columns={columns} dataSource={roles?.data || []} />
    </div>
  );
}
