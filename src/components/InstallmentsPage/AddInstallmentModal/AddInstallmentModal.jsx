import { Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa6";

export default function AddInstallmentModal({ open, setOpen }) {
  const [pictures , setPictures] = useState([]);
  const {t} = useTranslation()
  const [installmentsData, setInstallmentsData] = useState({
    title: "",
    desc: "",
    user: "",
    start_date: "",
    total_value: "",
    total_installments: "",
    installment_interval: "",
  });
  const [imgs, setImgs] = useState({
    file: null,
    url: "",
  });

  return (
    <Modal
      title={t("addInstallmentsText")}
      footer={null}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      open={open}
      setOpen={setOpen}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="input-group">
            <label>{t("titleText")}</label>
            <input
              type="text"
              value={installmentsData.title}
              onChange={(e) =>
                setInstallmentsData({
                  ...installmentsData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("chooseUserText")}</label>
            <select
              onChange={(e) =>
                setInstallmentsData({
                  ...installmentsData,
                  user: e.target.value,
                })
              }
            >
              <option disabled selected value="">
                 {t("chooseUserText")}
              </option>
              <option value="rahma">Rahma</option>
              <option value="ahmed">Ahmed</option>
              <option value="mohamed">Mohamed</option>
              <option value="asmaa">Asmaa</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>{t("description")}</label>
          <textarea
            value={installmentsData?.desc}
            onChange={(e) =>
              setInstallmentsData({ ...installmentsData, desc: e.target.value })
            }
          ></textarea>
        </div>

        <div className="input-group">
          <label>{t("startDateText")}</label>
          <input
            type="date"
            value={installmentsData?.start_date}
            onChange={(e) =>
              setInstallmentsData({
                ...installmentsData,
                start_date: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("totalValueText")}</label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              value={installmentsData?.total_value}
              onChange={(e) =>
                setInstallmentsData({
                  ...installmentsData,
                  total_value: e.target.value,
                })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("TotalInstallmentsText")}</label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              value={installmentsData?.total_installments}
              onChange={(e) =>
                setInstallmentsData({
                  ...installmentsData,
                  total_installments: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("TotalInstallmentsText")}</label>
            <input
              type="number"
              className="disabled:bg-gray-200"
              value={installmentsData?.total_installments}
              disabled
            />
          </div>

          <div className="input-group">
            <label>{t("InstallmentIntervalText")}</label>
            <select
              value={installmentsData?.installment_interval}
              onChange={(e) =>
                setInstallmentsData({
                  ...installmentsData,
                  installment_interval: e.target.value,
                })
              }
            >
              <option disabled selected>
                {t("pleaseSelectValueText")}
              </option>
              <option value={"day"}>{t("dayText")}</option>
              <option value="month">{t("monthText")}</option>
              <option value={"year"}>{t("yearText")}</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>{t("imagesText")}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setImgs({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
              })
            }
          />
        </div>
        {pictures?.length > 0 && <div className="grid grid-cols-3 gap-3">
           {pictures?.map((pic , index) => <div key={index} className="flex gap-2 items-center">
           <img src={pic} className="w-[100px] h-[100px] object-cover"/>
           <FaTrash className="text-red-600"/>
           </div>)}
          </div>}
        <button className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3]  p-2 rounded-md text-white flex justify-center items-center">
          {t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
