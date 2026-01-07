import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa6";
import { createUser, fetchUsers } from "../../../features/usersSlice";
import { useTranslation } from "react-i18next";

export default function AddUserModal({ open, setOpen }) {
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    password: "",
    email:"",
    national_id:""
  });
  const { t } = useTranslation();
  const { addLoading } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();

    if (!userData.name) {
      toast.warn("برجاء ادخال الاسم اولا!");
      return;
    }
    if (!userData.password) {
      toast.warn("برجاء ادخال كلمه السر اولا!");
      return;
    }
    if (!userData.phone) {
      toast.warn("برجاء ادخال   رقم الهاتف اولا !");
      return;
    }

    const formData = new FormData();
    formData.append("username", userData.name ? userData.name : "");
    formData.append("password", userData.password ? userData.password : "");
    formData.append("phone", userData.phone ? userData.phone : "");
    formData.append("email", userData.email ? userData.email : "");
    formData.append("national_id", userData.national_id ? userData.national_id : 0 );
    dispatch(
      createUser({
        username: userData.name,
        password: userData.password,
        phone: userData.phone,
        email: userData.email,
        national_id : userData?.national_id ?  userData.national_id : "0"
      })
    )
      .then((res) => {
        console.log(res);
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchUsers());
          setOpen(false);
          setUserData({
            name: "",
            phone: "",
            password: "",
            email:"",
            national_id:"",
          });
        } else {
          toast.error(
            res?.payload?.message || res?.payload || "There's error while creating employee"
          );
        }
      })
      .catch((e) => console.log(e));
  }
  return (
    <Modal
      title={t("addNewUserText")}
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
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              type="text"
              placeholder={t("fullName")}
            />
          </div>
          <div className="w-full input-group ">
            <label>{t("email")}</label>
            <input
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              type="text"
              placeholder={t("email")}
            />
          </div>
          <div className="w-full input-group ">
            <label>{t("phone")}</label>
            <input
              value={userData?.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              type="tel"
              placeholder={t("phone")}
              className=""
            />
          </div>

          <div className="w-full input-group ">
            <label>{t("nationalId")}</label>
            <input
              value={userData?.national_id}
              onChange={(e) =>
                setUserData({ ...userData, national_id: e.target.value })
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
            value={userData?.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            type="password"
            placeholder="**********"
          />
        </div>

        <button className="bg-[#0d6efd] hover:bg-[#104ba3]  text-white p-2 rounded-sm w-full">
          {addLoading ? t("loadingText") : t("saveBtn")}
        </button>
      </form>
    </Modal>
  );
}
