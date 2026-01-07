import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa6";

export default function OrdersModal({ open, setOpen, data }) {
  const [statusClass, setStatusClass] = useState("");
  console.log(data);
  const { t } = useTranslation();

  useEffect(() => {
    switch (data?.order_status) {
      case "pending":
        setStatusClass("bg-gray-100 text-black");
        break;
      case "completed":
        setStatusClass("bg-green-100 text-green-500");
        break;
      case "rejected":
        setStatusClass("bg-red-100 text-red-500");
        break;
      case "canceled":
        setStatusClass("bg-orange-100 text-orange-500");
        break;
      case "confirmed":
        setStatusClass("bg-blue-100 text-blue-500");
        break;
      default:
        setStatusClass("bg-gray-200 text-black");
    }
  }, [data]);

  return (
    <Modal
      footer={null}
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
    >
      <div>
        <div>
          <h3 className="font-bold text-2xl">{t("clientText")}:</h3>
          <div className="flex justify-between my-3 items-center">
            <div className="flex gap-2 items-center">
              <div className="w-[35px] border border-gray-200 h-[35px] rounded-full flex justify-center items-center">
                <FaUser />
              </div>

              <div>
                <p>{data?.name}</p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <a
                href={`mailto:${data?.email}`}
                target="_blank"
                className="!bg-gray-200 text-black flex justify-center items-center !shadow-2xl p-2 rounded-2xl"
              >
                <FaEnvelope className="text-black text-xl" />
              </a>

              <a
                href={`tel:${data?.phone}`}
                target="_blank"
                className="!bg-gray-200 flex justify-center items-center !shadow-2xl p-2 rounded-2xl"
              >
                <FaPhone className="text-black text-xl" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl">{t("orderStatusText")} :</h3>
            <button className={`${statusClass} w-fit p-2 rounded-sm`}>
              {data?.order_status}
            </button>
          </div>

          {data?.delivery_price ? (
            <div className="flex items-center gap-2 mt-3">
              <h3 className="font-bold text-xl">{t("deliveryPrice")} :</h3>
              <button className={`w-fit p-2 rounded-sm text-lg`}>
                {data?.delivery_price}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
