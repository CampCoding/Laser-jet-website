import { Modal, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployees, employeesSlcie, fetchEmployees, updateEmployees } from "../../../features/employeesSlice";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import { handleFetchRoles } from "../../../features/permissionsSlice";
import { useTranslation } from "react-i18next";

export default function EditEmployeeModal({ open, setOpen, rowData , setRowData }) {
  const {t} = useTranslation();
  const {roles}  = useSelector(state => state?.permissions);
  const [imgs, setImgs] = useState({
    file: null,
    url: "",
  });
  const {editLoading , addEmployeesData} = useSelector(state => state.employees);
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(handleFetchRoles())
    } , [dispatch])

  function handleSubmit(e) {
    e.preventDefault();
    console.log(rowData)
    if(!rowData.username) {
      toast.warn("برجاء ادخال الاسم اولا!");
      return;
    }
  
    if(!rowData.role) {
      toast.warn("برجاء اختيار role اولا!");
      return;
    }

    const formData  = new FormData();
    formData.append("username",rowData.username);
    formData.append("admin_id",rowData.admin_id);
    formData.append("phone",rowData.phone);
    formData.append("password",rowData.password);
    formData.append("email",rowData.email)
    formData.append("national_id",rowData.national_id);
    formData.append("role",rowData.role);
    formData.append("identity_image",imgs.file);
    formData.append("status",rowData.status);
    formData.append("address",rowData.address)
    formData.append("role_id",rowData.role_id)
    dispatch(updateEmployees(formData)).then(res => {
      console.log(res)
      if(res?.payload?.success) {
        toast.success(res?.payload?.message)
        dispatch(fetchEmployees())
        setOpen(false)
        setRowData({})
        setImgs({
          file:null,
          url:""
        })
      }else {
       toast.error(res?.payload?.message || "There's error while creating employee")
      }
    }).catch(e => console.log(e))
  }
  return (
    <Modal
      title="Edit Employee"
      open={open}
      setOpen={setOpen}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="w-full input-group ">
            <label>Full Name</label>
            <input
              value={rowData?.username}
              onChange={(e) =>
                setRowData({ ...rowData, username: e.target.value })
              }
              type="text"
              placeholder="Full Name"
            />
          </div>

          <div className="w-full input-group ">
            <label>Phone Number</label>
            <input
              value={rowData?.phone}
              onChange={(e) =>
                setRowData({ ...rowData, phone: e.target.value })
              }
              type="tel"
              placeholder="Phone Number"
              className=""
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
        <div className="w-full input-group ">
            <label>Password</label>
            <input
              value={rowData?.password}
              onChange={(e) =>
                setRowData({ ...rowData, password: e.target.value })
              }
              type="password"
              placeholder="**********"
            />
          </div>
          <div className="input-group">
           <label>البريد الالكتروني</label>
           <input type="email" value={rowData.email} onChange={(e) => setRowData({...rowData,email:e.target.value})}/>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="w-full input-group ">
            <label>National ID / Passport</label>
            <input
              value={rowData?.national_id}
              onChange={(e) =>
                setRowData({ ...rowData, national_id: e.target.value })
              }
              type="text"
              placeholder="National ID / Passport"
            />
          </div>

          <div className="w-full input-group ">
            <label>Address (Optional)</label>
            <input
              value={rowData?.address}
              onChange={(e) =>
                setRowData({ ...rowData, address: e.target.value })
              }
              type="text"
              placeholder="Address"
              className=""
            />
          </div>
        </div>

        <div className="w-full input-group ">
          <label>{t("Permissions")}</label>
          <select value={rowData?.role_id} onChange={(e) => setRowData({...rowData , role_id : e.target.value})}>
            <option value="" disabled>Select Role</option>
            {roles?.data?.map(item => <option value={item?.role_id}>{item?.name}</option>)}
          </select>
        </div>


        <div className="input-group">
          <label>Identity Photo (Optional)</label>
          <input
            accept="image/*"
            onChange={(e) =>
              setImgs({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
              })
            }
            type="file"
          />
        </div>

        {imgs?.url && (
          <div className="flex items-center gap-3">
            <img
              src={imgs?.url}
              className="w-[100px] h-[100px] object-contain rounded-sm"
            />
            <FaTrash
              className="text-red-500"
              onClick={() =>
                setImgs({
                  file: null,
                  url: "",
                })
              }
            />
          </div>
        )} 

        <div className="flex gap-2 items-center">
           <label>Active</label>
           <Switch defaultChecked={rowData?.status == "active"} onChange={(e) => setRowData({...rowData ,status : e ? "active":"inactive"})}/>
        </div>

        <button className="bg-[#0d6efd] hover:bg-[#104ba3]  text-white p-2 rounded-sm w-full">{editLoading ? "Loading...":"Save"}</button>
      </form>
    </Modal>
  );
}
