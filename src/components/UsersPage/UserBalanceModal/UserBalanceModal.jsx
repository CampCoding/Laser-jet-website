import { Modal, Switch } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function UserBalanceModal({ open, setOpen, userId = 0 }) {
  const [userData, setUserData] = useState({
    account_balance: 0,
    available_balance: 0,
    max_limit_per_month: null,
    investment_balance: false,
    deduction_ratio: 0,
    investment_balance_true: 0,
    deduction_ratio_true: 0,
  });
  const {t} = useTranslation();
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onClose={() => setOpen(false)}
      footer={null}
      title={t("editUserBalanceText")}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("accountBalanceText")}</label>
            <input
              value={userData?.account_balance}
              onChange={(e) =>
                setUserData({ ...userData, account_balance: e.target.value })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div className="input-group">
            <label>{t("availableBalanceText")}</label>
            <input
              value={userData?.available_balance}
              onChange={(e) =>
                setUserData({ ...userData, available_balance: e.target.value })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>

        <div className="input-group">
          <label>{t("limitPerMonthText")}</label>
          <input
            value={userData?.max_limit_per_month}
            onChange={(e) =>
              setUserData({ ...userData, max_limit_per_month: e.target.value })
            }
            type="number"
            onWheel={(e) => e.target.blur()}
          />
        </div>

        <div className="flex gap-2 items-center">
          <Switch
            checked={userData?.investment_balance}
            onChange={(e) =>
              setUserData({ ...userData, investment_balance: e })
            }
          />
          <p className="text-[16px] text-gray-600">
            {t("investmentBalanceText")} :{" "}
            {userData?.investment_balance ?t("activatedText") : t("notActivatedText")}{" "}
          </p>
        </div>

        {!userData?.investment_balance && (
          <div className="input-group">
            <label> {t("NegativediscountrateText")} ({t("percentageText")})</label>
            <input
              type="number"
              value={userData?.deduction_ratio}
              onChange={(e) =>
                setUserData({ ...userData, deduction_ratio: e.target.value })
              }
              onWheel={(e) => e.target.blur()}
            />
          </div>
        )}

        {userData?.investment_balance && (
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("investmentBalanceText")}</label>
              <input
                type="number"
                value={userData?.investment_balance_true}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    investment_balance_true: e.targe.value,
                  })
                }
                onWheel={(e) => e.target.blur()}
              />
            </div>

            <div className="input-group">
              <label>{t("NegativediscountrateText")} ({t("percentageText")})</label>
              <input
                type="number"
                value={userData?.deduction_ratio_true}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    deduction_ratio_true: e.target.value,
                  })
                }
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>
        )}

        <button className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3]  p-2 rounded-md text-white flex justify-center items-center">
          {t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
