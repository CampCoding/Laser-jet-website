import { Dropdown, Menu, message, Modal, Space, Table } from "antd";
import { FaEllipsisVertical, FaX } from "react-icons/fa6";
import UserBalanceModal from "../../../components/UsersPage/UserBalanceModal/UserBalanceModal";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { conifgs } from "../../../config";
import { fetchUserProfile } from "../../../features/loginSlice";
import { useDispatch, useSelector } from "react-redux";

export default function UsersBalance({ userProfile, userId }) {
  const [editBalanceModal, setEditBalanceModal] = useState(false);
  const [sendBalanceModal, setBalanceModal] = useState(false);
  const [fineModal, setFineModal] = useState({});
  const [rowData, setRowData] = useState({});
  const [balanceData, setBalanceData] = useState({
    acc_balance: 0,
    available_balance: 0,
    investment_balance: 0,
  });
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userProfileData } = useSelector((state) => state?.login);
  const [permissions, setPermissions] = useState([]);

  const canAddBalance = true
  const canShowAllWallet = true

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setPermissions(userProfileData?.permissions);
  }, [userProfileData]);

  function handleSubmit(e) {
    e.preventDefault();
  }

  const columns = [
    {
      dataIndex: "wallet_id",
      key: "wallet_id",
      title: t("walletNumber"),
    },
    {
      title: t("username"),
      render: (_text, record) => <p>{record?.username}</p>,
    },
    {
      title: t("phone"),
      render: (_text, record) => (
        <a href={`tel:${record?.phone}`}>{record?.phone}</a>
      ),
    },
    {
      title: t("nationalId"),
      render: (_text, record) => <p>{record?.national_id}</p>,
    },
    {
      dataIndex: "balance",
      key: "balance",
      title: t("availableBalanceText"),
      render: (balance) => <p>{balance}</p>,
    },
    canShowAllWallet && {
      title: t("actions"),
      render: (_text, record) => (
        <div className="">
          <button
            onClick={() => {
              setFineModal(record);
              setRowData(record);
            }}
            className="bg-blue-500 text-white rounded-md flex justify-center items-center p-2"
          >
            {t("fine")}
          </button>
        </div>
      ),
    },
  ].filter(Boolean);

  useEffect(() => {
    console.log(userProfile, rowData);
  }, [userProfile, rowData]);

  const filteredData = useMemo(() => {
    if (!searchValue.length) return userProfile;
    return userProfile.filter(
      (item) =>
        item?.user?.username
          ?.toLowerCase()
          ?.includes(searchValue?.toLowerCase()) ||
        item?.user?.email
          ?.toLowerCase()
          ?.includes(searchValue?.toLowerCase()) ||
        item?.user?.phone?.toLowerCase()?.includes(searchValue)
    );
  }, [searchValue, userProfile]);

  useEffect(() => {
    setOriginalData(filteredData);
  }, [filteredData]);

  const addFine = async () => {
    try {
      const token = localStorage.getItem(conifgs.localStorageTokenName);
      const res = await fetch(`${conifgs.LIVE_BASE_URL}wallets/fine/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wallet_id: rowData?.id,
          fine: +fineModal?.fine,
          fine_status: "carried_on",
        }),
      });
      const result = await res.json();
      if (result.success) {
        message.success("Fine updated successfully");
        setFineModal(null);
      } else {
        message.error(result.message || "Failed to update fine");
      }
    } catch (err) {
      console.error(err);
      message.error("Error updating fine");
    }
  };

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        {(canAddBalance || canShowAllWallet) && (
          <button
            className="bg-[#0d6efd] ms-auto text-white p-3 rounded-md"
            onClick={() => setBalanceModal(true)}
          >
            {t("sendBalanceText")}
          </button>
        )}
      </div>

      <UserBalanceModal open={editBalanceModal} setOpen={setEditBalanceModal} />

      <Modal
        footer={null}
        open={fineModal?.wallet_id}
        onCancel={() => setFineModal(false)}
        onClose={() => setFineModal(false)}
        title={t("addFineText")}
      >
        <div className="input-group">
          <label>{t("fine")}</label>
          <input
            type="text"
            value={fineModal?.fine || ""}
            onChange={(e) =>
              setFineModal({ ...fineModal, fine: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2 items-center my-2">
          <button
            onClick={addFine}
            className="bg-blue-500 p-2 cursor-pointer text-white flex justify-center items-center rounded-md"
          >
            {t("addText")}
          </button>
          <button
            onClick={() => setFineModal(false)}
            className="border p-2 border-blue-500 text-blue-500 flex justify-center items-center rounded-md"
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <Modal
        width={800}
        open={sendBalanceModal}
        onCancel={() => setBalanceModal(false)}
        onClose={() => setBalanceModal(false)}
        title={t("sendBalanceText")}
        footer={null}
      >
        <div className="w-full">
          <div className="bg-white shadow-lg p-4 w-full rounded-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="input-group">
                <label>{t("accountBalanceText")}</label>
                <input
                  value={balanceData?.acc_balance}
                  disabled
                  className="disabled:bg-gray-200"
                />
              </div>
              <div className="input-group">
                <label>{t("availableBalanceText")}</label>
                <input
                  value={balanceData?.available_balance}
                  disabled
                  className="disabled:bg-gray-200"
                />
              </div>
              <div className="input-group">
                <label>{t("investmentBalanceText")}</label>
                <input
                  value={balanceData?.investment_balance}
                  disabled
                  className="disabled:bg-gray-200"
                />
              </div>
              <div className="input-group">
                <label>{t("maximumText")}</label>
                <input
                  value={balanceData?.investment_balance}
                  disabled
                  className="disabled:bg-gray-200"
                />
              </div>
              <button className="btn primary cursor-pointer">
                {t("sendBalanceText")}
              </button>
            </form>
          </div>
        </div>
      </Modal>

      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        className="border border-gray-300 outline-none w-full rounded-md p-3 my-3"
        placeholder={t("searchText")}
      />
      <Table
        columns={columns}
        rowKey="wallet_id"
        dataSource={
          userId
            ? [originalData]
            : originalData?.sort(
                (a, b) => parseFloat(a.balance) - parseFloat(b.balance)
              )
        }
      />
    </div>
  );
}
