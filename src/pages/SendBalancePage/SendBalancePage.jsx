import { Modal, Table } from "antd";
import { useState } from "react";

export default function SendBalancePage() {
  const [openModal, setOpenModal] = useState(false);
  const [balanceData, setBalanceData] = useState({
    acc_balance: 0,
    available_balance: 0,
    investment_balance: 0,
  });

  function handleSubmit(e) {
    e.preventDefault();
  }

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "acc_balance",
      key: "acc_balance",
      title: "Account Balance",
    },
    {
      dataIndex: "available_balance",
      key: "available_balance",
      title: "Available Balance",
    },
    {
      dataIndex: "investment_balance",
      key: "investment_balance",
      title: "Investment Balance",
    },
    {
      dataIndex: "",
      key: "",
      title: "Actions",
      render: (row, text) => <button>Edit</button>,
    },
  ];
  return (
    <div>

        <h3 className="font-semibold text-center my-6 text-[25px] text-[#0d6efd]">
          ارسال الرصيد
        </h3>
   
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        title="Amount to send"
        footer={null}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="input-group">
            <label>Account Balance</label>
            <input
              value={balanceData?.acc_balance}
              onChange={(e) =>
                setBalanceData({ ...balanceData, acc_balance: e.target.value })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div className="input-group">
            <label>Available Balance</label>
            <input
              value={balanceData?.available_balance}
              onChange={(e) =>
                setBalanceData({
                  ...balanceData,
                  available_balance: e.target.value,
                })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div className="input-group">
            <label>Investment Balance</label>
            <input
              value={balanceData?.investment_balance}
              onChange={(e) =>
                setBalanceData({
                  ...balanceData,
                  investment_balance: e.target.value,
                })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <button className="bg-[#0d6efd] hover:bg-[#104ba3] w-full text-white p-2 rounded-sm">
            Save
          </button>
        </form>
      </Modal>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow-lg p-4 rounded-md">   
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="input-group">
            <label>رصيد الحساب</label>
            <input
              value={balanceData?.acc_balance}
              onChange={(e) =>
                setBalanceData({ ...balanceData, acc_balance: e.target.value })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div className="input-group">
            <label>الرصيد المتاح</label>
            <input
              value={balanceData?.available_balance}
              onChange={(e) =>
                setBalanceData({
                  ...balanceData,
                  available_balance: e.target.value,
                })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div className="input-group">
            <label>رصيد الاستثمار</label>
            <input
              value={balanceData?.investment_balance}
              onChange={(e) =>
                setBalanceData({
                  ...balanceData,
                  investment_balance: e.target.value,
                })
              }
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <button className="bg-[#0d6efd] hover:bg-[#104ba3] w-full text-white p-2 rounded-sm">
            حفظ
          </button>
        </form>
        </div>

        <div className="bg-white shadow-lg p-4 rounded-md">   
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="input-group">
            <label>رصيد الحساب</label>
            <input
              value={balanceData?.acc_balance}
              disabled
              className="disabled:bg-gray-200"
            />
          </div>

          <div className="input-group">
            <label>الرصيد المتاح</label>
            <input
              value={balanceData?.available_balance}
             disabled
             className="disabled:bg-gray-200"
            />
          </div>

          <div className="input-group">
            <label>رصيد الاستثمار</label>
            <input
              value={balanceData?.investment_balance}
              disabled
              className="disabled:bg-gray-200"
            />
          </div>

        </form>
        </div>
      </div>

    </div>
  );
}
