import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import MultiSelect from "../../MultiSelect/MultiSelect";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { handleFetchPermissions } from "../../../features/permissionsSlice";

export default function ViewPermissionsModal({
  open,
  setOpen,
  rowData,
  setRowData,
}) {
  const { permissions , user_permissions } = useSelector((state) => state?.permissions);
  const [permmissionData, setPermissionsData] = useState([]);
  const dispatch = useDispatch();
  const [permissionIds, setPermissionsIds] = useState([]);

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

  function handleSubmit() {
    const data_send = {
      role_id: rowData?.role_id,
      permission_id: permissionIds,
    };
    console.log(data_send);
    dispatch(handleCrea);
  }

  useEffect(() =>{
    
    dispatch(handleFetchPermissions({role_id : rowData?.role_id}))
  } , [dispatch , rowData])

  useEffect(() =>{
    console.log(user_permissions);
   },[user_permissions])
 
  const columns =[
    {
      dataIndex:"permission_id",
      key:"permission_id",
      title:"#"
    },
    {
      dataIndex:"name",
      key:"name",
      title:"Name",
    },
    {
      dataIndex:"description",
      key:"description",
      title:"Description"
    }
  ]


  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      footer={null}
    >
      <Table columns={columns} />
      {/* <form className="flex flex-col gap-2">
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
          Save
        </button>
      </form> */}
    </Modal>
  );
}
