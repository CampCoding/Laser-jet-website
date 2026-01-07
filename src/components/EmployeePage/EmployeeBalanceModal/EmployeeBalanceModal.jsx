import { Modal, Switch } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleAdminTransferMoney } from "../../../features/aminTransactionSlice";
import { toast } from "react-toastify";

export default function EmployeeBalanceModal({ open, setOpen, rowData }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    price: "",
  });
  const { add_transfer_loading } = useSelector(
    (state) => state?.adminTransactions
  );

  function handleSubmit() {
    dispatch(
      handleAdminTransferMoney({
        user_id: rowData?.admin_id,
        price: +userData?.price,
      })
    )
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.success) {
          toast.success("تم إرسال النقود بنجاح");
          setOpen(false);
          setUserData({ price: "" });
        } else {
          toast.error(res || res?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      footer={null}
      title={t("sendBalanceText")}
    >
      <div className="flex flex-col gap-3">
        <div className="">
          <div className="input-group">
            <label>{t("priceText")}</label>
            <input
              value={userData?.price}
              onChange={(e) =>
                setUserData({ ...userData, price: e.target.value })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3]  p-2 rounded-md text-white flex justify-center items-center"
        >
          {add_transfer_loading ? t("laoding...") : t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
