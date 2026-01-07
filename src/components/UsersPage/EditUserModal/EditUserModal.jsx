import { Modal, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import {
  createUser,
  fetchUserData,
  fetchUsers,
  updateUser,
} from "../../../features/usersSlice";
import { useTranslation } from "react-i18next";
import { handleFetchRoles } from "../../../features/permissionsSlice";

export default function EditUserModal({ open, setOpen, rowData, setRowData }) {
  const { editLoading } = useSelector((state) => state.users);
  const {roles}  = useSelector(state => state?.permissions);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  console.log(rowData);

  useEffect(() => {
    dispatch(handleFetchRoles())
  } , [dispatch])

  useEffect(() => {
    console.log(roles)
  } ,[roles])

  function handleSubmit(e) {
    e.preventDefault();

    if (!rowData.username) {
      toast.warn("برجاء ادخال الاسم اولا!");
      return;
    }
  
    if (!rowData.phone) {
      toast.warn("برجاء ادخال   رقم الهاتف اولا !");
      return;
    }

    const formData = new FormData();
    formData.append("username", rowData.username);
    formData.append("email", rowData.email);
    if (rowData?.password) formData.append("password", rowData.password);
    formData.append("phone", rowData.phone);
    formData.append("national_id", rowData.national_id);
    formData.append("installable" ,rowData?.installable )
    // const data_send = {username:rowData.name,password:rowData.password ,phone:rowData.phone}
    dispatch(updateUser(formData))
      .then((res) => {
        console.log(res);
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchUsers());
          // dispatch(fetchUserData(rowData?.user_id));
          setOpen(false);
          setRowData({});
        } else {
          toast.error(
            res?.payload?.message || "There's error while creating employee"
          );
        }
      })
      .catch((e) => console.log(e));
  }
  return (
    <Modal
      title={t("editUserText")}
      open={open}
      setOpen={setOpen}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      footer={null}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="w-full input-group ">
            <label>{t("fullName")}</label>
            <input
              value={rowData.username}
              onChange={(e) =>
                setRowData({ ...rowData, username: e.target.value })
              }
              type="text"
              placeholder={t("fullName")}
            />
          </div>

          <div className="w-full input-group ">
          <label>{t("email")}</label>
          <input
            value={rowData?.email}
            onChange={(e) => setRowData({ ...rowData, email: e.target.value })}
            type="email"
            placeholder=""
          />
        </div>

          <div className="w-full input-group ">
            <label>{t("phone")}</label>
            <input
              value={rowData?.phone}
              onChange={(e) =>
                setRowData({ ...rowData, phone: e.target.value })
              }
              type="tel"
              placeholder={t("phone")}
              className=""
            />
          </div>

          <div className="w-full input-group ">
            <label>{t("nationalId")}</label>
            <input
              value={rowData?.national_id}
              onChange={(e) =>
                setRowData({ ...rowData, national_id: e.target.value })
              }
              type=""
              placeholder={t("nationalId")}
              className=""
            />
          </div>

          
        </div>

      

        <div className="w-full input-group ">
          <label>{t("password")}</label>
          <input
            value={rowData?.password}
            onChange={(e) =>
              setRowData({ ...rowData, password: e.target.value })
            }
            type="password"
            placeholder=""
          />
        </div>

         <div className="flex gap-2 items-center mt-4">
                   <Switch
                     checked={rowData.installable == "1" ? true : false}
                     onChange={(checked) =>
                       setRowData({ ...rowData, installable: checked ? 1  : 0 })
                     }
                   />
                   <label>{t("isinstallable")}</label>
                 </div>

        <button className="bg-[#0d6efd] hover:bg-[#104ba3]  text-white p-2 rounded-sm w-full">
          {editLoading ? t("loadingText") : t("saveBtn")}
        </button>
      </form>
    </Modal>
  );
}
