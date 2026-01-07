import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployees, employeesSlcie, fetchEmployees } from "../../../features/employeesSlice";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function AddEmployeeModal({ open, setOpen }) {
  const {t} = useTranslation();
  const [employeeData, setEmployeeData] = useState({
    name: "",
    phone: "",
    password: "",
    confrimPass: "",
    nationalId: "",
    address: "",
    role_id: "",
    email:""
  });
  const [imgs, setImgs] = useState({
    file: null,
    url: "",
  });
  const {addLoading , addEmployeesData} = useSelector(state => state.employees);
  const {roles} = useSelector(state => state?.permissions);
  const dispatch = useDispatch()

  function handleSubmit(e) {
    e.preventDefault();

    if(!employeeData.name) {
      toast.warn("برجاء ادخال الاسم اولا!");
      return;
    }
    if(!employeeData.password) {
      toast.warn("برجاء ادخال كلمه السر اولا!");
      return;
    }

    // if(!employeeData.email) {
    //   toast.warn("برجاء ادخال البريد الالكتروني اولا!");
    //   return;
    // }

    if(!employeeData.nationalId) {
      toast.warn("برجاء ادخال الباسبورد اولا!");
      return;
    }

    if(!employeeData.role_id) {
      toast.warn("برجاء اختيار role اولا!");
      return;
    }

    const formData  = new FormData();
    formData.append("username",employeeData.name);
    formData.append("password",employeeData.password);
    formData.append("phone",employeeData.phone);
    formData.append("email",employeeData.email)
    formData.append("national_id",employeeData.nationalId);
    formData.append("role_id",employeeData.role_id);
    formData.append("role","admin");
    formData.append("identity_image",imgs.file);
    formData.append("address",employeeData.address)
    console.log(formData.get("address"))
    dispatch(createEmployees(formData)).then(res => {
      console.log(res)
      if(res?.payload?.success) {
        toast.success(res?.payload?.message)
        dispatch(fetchEmployees())
        setOpen(false)
        setEmployeeData({
          name: "",
          phone: "",
          password: "",
          confrimPass: "",
          nationalId: "",
          address: "",
          role_id: "",
          email:""
        })
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
      title="Add Employee"
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
              value={employeeData?.name}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, name: e.target.value })
              }
              type="text"
              placeholder="Full Name"
            />
          </div>

          <div className="w-full input-group ">
            <label>Phone Number</label>
            <input
              value={employeeData?.phone}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, phone: e.target.value })
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
              value={employeeData?.password}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, password: e.target.value })
              }
              type="password"
              placeholder="**********"
            />
          </div>
          <div className="input-group">
           <label>البريد الالكتروني</label>
           <input type="email" value={employeeData.email} onChange={(e) => setEmployeeData({...employeeData,email:e.target.value})}/>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="w-full input-group ">
            <label>National ID / Passport</label>
            <input
              value={employeeData?.nationalId}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, nationalId: e.target.value })
              }
              type="text"
              placeholder="National ID / Passport"
            />
          </div>

          <div className="w-full input-group ">
            <label>Address (Optional)</label>
            <input
              value={employeeData?.address}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, address: e.target.value })
              }
              type="text"
              placeholder="Address"
              className=""
            />
          </div>
        </div>

        <div className="w-full input-group ">
          <label>{t("Permissions")}</label>
          <select value={employeeData?.role_id} onChange={(e) => setEmployeeData({...employeeData , role_id : e.target.value})}>
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

        <button className="bg-[#0d6efd] hover:bg-[#104ba3]  text-white p-2 rounded-sm w-full">{addLoading ? "Loading...":"Save"}</button>
      </form>
    </Modal>
  );
}
