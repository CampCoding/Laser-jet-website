import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchUsers } from "../../../features/usersSlice";
import { toast } from "react-toastify";
import { handleNotificationToSpecificUser } from "../../../features/NotificationSlice";

export default function NotificationSpecificUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const { data } = useSelector((state) => state?.users);
  const [notificationData, setNotificationData] = useState({
    ids: [],
    title: "",
    body: "",
    isGeneral: false,
  });

  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .then((res) => {
        if (res?.success) {
          console.log(res?.data);
          const allData = res?.data?.map((item) => ({
            label: item?.username,
            value: item?.user_id,
          }));
          setUsers(allData);
        } else {
          toast.error(res?.message || res);
        }
      });
  }, [dispatch]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  function handleChange(e) {
    console.log(e);
    setNotificationData({
        ...notificationData ,
        ids : e.map(item => item?.value)
    })
  } 

  useEffect(() => {
    console.log(notificationData)
  } ,[notificationData])

  function handleSubmit(e) {
    e.preventDefault()
    const data_send  = {
        ...notificationData
    }

    console.log(data_send)

    dispatch(handleNotificationToSpecificUser(data_send)).unwrap().then(res => console.log(res))
  }

  return (
    <div className="my-4">
      <form className="flex flex-col gap-3">
        <div className="input-group">
          <label>{t("selectUsers")}</label>
          <Select
            onChange={handleChange}
            defaultValue={[users[2], users[3]]}
            isMulti
            name="Users"
            options={users}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="input-group">
          <label>{t("titleText")}</label>
          <input
            onChange={(e) =>
              setNotificationData({
                ...notificationData,
                title: e.target.value,
              })
            }
            type="text"
          />
        </div>

        <div className="input-group">
          <label>{t("description")}</label>
          <textarea
            onChange={(e) =>
              setNotificationData({ ...notificationData, body: e.target.value })
            }
          ></textarea>
        </div>

        <button onClick={handleSubmit} className="bg-[#0d6efd] text-white p-4 rounded-lg w-fit">
          {t("sendText")}
        </button>
      </form>
    </div>
  );
}
