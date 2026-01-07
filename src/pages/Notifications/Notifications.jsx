import { TreeSelect } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, handleNotificationToSpecificUser } from "../../features/NotificationSlice";
import { useTranslation } from "react-i18next";
import NotificationSpecificUsers from "./NotificationSpecificUsers/NotificationSpecificUsers";

export default function Notifications() {
  const [tabs, setTabs] = useState(0);
  const {data,loading, error} = useSelector(state => state?.notifications);
  const dispatch = useDispatch();
  const {t} = useTranslation()
  useEffect(() =>{
    dispatch(fetchNotifications())
  } ,[dispatch])

  useEffect(() => {
    console.log(data)
  } ,[data])
   const [notificationData, setNotificationData] = useState({
      title: "",
      body: "",
      isGeneral: true,
    });
  function handleSubmit(e) {
    e.preventDefault()
    const data_send  = {
        ...notificationData
    }

    console.log(data_send)

    dispatch(handleNotificationToSpecificUser(data_send)).unwrap().then(res => console.log(res))
  }
  return (
    <div>
      <h3 className="font-semibold text-center text-[25px] text-[#0d6efd]">
        {t("notificationsText")}
      </h3>
      <div className="flex gap-3 items-center">
        <button
          className={`p-3 border border-[#0d6efd] rounded-md flex justify-center items-center ${
            tabs == 0
              ? "bg-[#0d6efd] text-white"
              : "bg-transparent text-[#0d6efd]"
          }`}
          onClick={() => setTabs(0)}
        >
          {t("specificUsers")}
        </button>
        <button
          className={`p-3 border border-[#0d6efd] rounded-md flex justify-center items-center ${
            tabs == 1
              ? "bg-[#0d6efd] text-white"
              : "bg-transparent text-[#0d6efd]"
          }`}
          onClick={() => setTabs(1)}
        >
          {t("everyoneText")}
        </button>
      </div>

      {tabs == 0 && (
        <NotificationSpecificUsers />
        // <div className="my-4">
        //   <form className="flex flex-col gap-3">
        //     <div className="input-group">
        //       <label>{t("selectUsers")}</label>
        //       <select></select>
        //       {/* <TreeSelect /> */}
        //     </div>

        //     <div className="input-group">
        //       <label>{t("titleText")}</label>
        //       <input type="text" />
        //     </div>

        //     <div className="input-group">
        //       <label>{t("description")}</label>
        //       <textarea></textarea>
        //     </div>

        //     <div className="input-group">
        //       <label>{t("imageText")} ({t("optionalText")})</label>
        //       <input type="file" />
        //     </div>

        //     <button className="bg-[#0d6efd] text-white p-4 rounded-lg w-fit">
        //       {t("sendText")}
        //     </button>
        //   </form>
        // </div>
      )}

      {tabs == 1 && (
        <div className="my-4">
          <form className="flex flex-col gap-3">
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
      )}
    </div>
  );
}
