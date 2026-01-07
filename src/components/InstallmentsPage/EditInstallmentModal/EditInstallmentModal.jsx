import { Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EditInstallmentModal({ open, setOpen , rowData  , setRowData }) {
  const {t} = useTranslation();
  const [imgs, setImgs] = useState({
    file: null,
    url: "",
  });

  return (
    <Modal
      title={t("editText")}
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
              value={rowData.title}
              onChange={(e) =>
                setRowData({
                  ...rowData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("chooseUserText")}</label>
            <select
            value={rowData?.user}
              onChange={(e) =>
                setRowData({
                  ...rowData,
                  user: e.target.value,
                })
              }
            >
              <option disabled selected value="">
                {t("pleaseSelectUserText")}
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
            value={rowData?.desc}
            onChange={(e) =>
              setRowData({ ...rowData, desc: e.target.value })
            }
          ></textarea>
        </div>

        <div className="input-group">
          <label>{t("startDateText")}</label>
          <input
            type="date"
            value={rowData?.start_date}
            onChange={(e) =>
              setRowData({
                ...rowData,
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
              value={rowData?.total_value}
              onChange={(e) =>
                setRowData({
                  ...rowData,
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
              value={rowData?.total_installments}
              onChange={(e) =>
                setRowData({
                  ...rowData,
                  total_installments: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("TotalInstallmentsValueText")}</label>
            <input
              type="number"
              className="disabled:bg-gray-200"
              value={rowData?.total_installments}
              disabled
            />
          </div>

          <div className="input-group">
            <label>{t("InstallmentIntervalText")}</label>
            <select
              value={rowData?.installment_interval}
              onChange={(e) =>
                setRowData({
                  ...rowData,
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

        <button className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3]  p-2 rounded-md text-white flex justify-center items-center">
          {t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
