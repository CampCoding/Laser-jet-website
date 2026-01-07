import React, { useEffect, useMemo, useState } from "react";
import AddInstallmentModal from "../../../components/InstallmentsPage/AddInstallmentModal/AddInstallmentModal";
import { Dropdown, Menu, Modal, Space, Table } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import EditInstallmentModal from "../../../components/InstallmentsPage/EditInstallmentModal/EditInstallmentModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InstallmentLogsModal from "../../../components/InstallmentsPage/InstallmentLogsModal/InstallmentLogsModal";
import InstallmentStatusModal from "../../../components/InstallmentsPage/InstallmentStatus/InstallmentStatus";


export default function UserManualInstallrments({ userProfile }) {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openLogs, setOpenLogs] = useState({
    open: false,
    data: []
  });
  const [searchValue , setSearchValue] = useState("");
  const [originalData , setOriginalData] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState({
    open: false,
    data: {}
  });
  const [editInstallmentModal , setEditInstallmentModal] = useState(false);
const toggleStatusOpen = (data) => {
  setOpenStatusModal({
      ...openStatusModal,
      open: !openStatusModal?.open,
      data: data ? data : openStatusModal?.data
    });
  };
  const toggleOpenLogs = (data) => {
    setOpenLogs({
      ...openLogs,
      open: !openLogs?.open,
      data: data ? data : openLogs?.data
    });
  };
  const [rowData, setRowData] = useState({});
  const { t } = useTranslation();

  const columns = [
    {
      dataIndex:"username",
      key:"username",
      title:t("username"),
    },
    {
      dataIndex:"phone",
      key:"phone",
      title:t("phone"),
    },
    {
      dataIndex:"national_id",
      key:"national_id",
      title:t("الرقم القومي"),
    },
    {
      title: "رقم القسط",
      dataIndex: "installment_part_id",
      key: "installment_part_id",
    },

    {
      title: "القيمة",
      dataIndex: "part_value",
      key: "part_value",
    },
    {
      title: "الحالة",
      dataIndex: "part_status",
      key: "part_status",
    },
    {
      title: "تاريخ الدفع",
      dataIndex: "part_pay_date",
      key: "part_pay_date",
      render: (text) => new Date(text).toLocaleString(),
    },
    // You can add additional columns for created_at, wallet_id, etc.
  ];
  const filteredData = useMemo(() => {
      if(!searchValue.length) return userProfile
  
      return userProfile.filter(item => (item?.product?.toLowerCase()?.includes(searchValue?.toLowerCase())) 
      ||  (item?.user?.name?.toLowerCase()?.includes(searchValue?.toLowerCase())) ||
      (item?.user?.phone?.toLowerCase()?.includes(searchValue))
    )
    } , [searchValue , userProfile])
    
    useEffect(() => {
      setOriginalData(filteredData)
    },[filteredData])

  return (
    <div>
      <EditInstallmentModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        rowData={rowData}
        setRowData={setRowData}
      />
      <Modal open={editInstallmentModal} onClose={() => setEditInstallmentModal(false)} onCancel={() => setEditInstallmentModal(false)}>
        <form>
          <div className="input_group">
            <label>{t("")}</label>
          </div>
        </form>
      </Modal>
      <AddInstallmentModal open={openAddModal} setOpen={setOpenAddModal} />
      <InstallmentLogsModal toggleOpen={toggleOpenLogs} openModal={openLogs} />
      <InstallmentStatusModal toggleStatusOpen={toggleStatusOpen} openStatusModal={openStatusModal} type={"installment"} data={openStatusModal?.data}/>
      <input
        type="text"
        value={searchValue}
        onChange={(e) =>setSearchValue(e.target.value)}
        placeholder={t("searchText")}
        className="border border-gray-300 outline-hidden p-3 my-3 w-full rounded-md"
      />
      <Table columns={columns} dataSource={originalData} />
    </div>
  );
}
