import React, { useEffect, useMemo, useState } from "react";
import AddInstallmentModal from "../../../components/InstallmentsPage/AddInstallmentModal/AddInstallmentModal";
import { Dropdown, Menu, Modal, Space, Table } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import EditInstallmentModal from "../../../components/InstallmentsPage/EditInstallmentModal/EditInstallmentModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InstallmentLogsModal from "../../../components/InstallmentsPage/InstallmentLogsModal/InstallmentLogsModal";
import InstallmentStatusModal from "../../../components/InstallmentsPage/InstallmentStatus/InstallmentStatus";
import { toast } from "react-toastify";
import { fetchData } from "../../../api/apiIntsance";

export default function UserInstallments({ userProfile  }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openLogs, setOpenLogs] = useState({
    open: false,
    data: [],
  });
  const [searchValue, setSearchValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState({
    open: false,
    data: {},
  });
  const [editInstallmentModal, setEditInstallmentModal] = useState(false);
  const toggleStatusOpen = (data) => {
    setOpenStatusModal({
      ...openStatusModal,
      open: !openStatusModal?.open,
      data: data ? data : openStatusModal?.data,
    });
  };
  const toggleOpenLogs = (data) => {
    setOpenLogs({
      ...openLogs,
      open: !openLogs?.open,
      data: data ? data : openLogs?.data,
    });
  };
  const [rowData, setRowData] = useState({});
  const { t } = useTranslation();

  function handleDeleteInstallment(partId) {
    const updated = originalData.map((item) => {
      const filteredDetails = item?.details?.filter(
        (detail) => detail?.part_id !== partId
      );
      return { ...item, details: filteredDetails };
    });

    setOriginalData(updated);
  }

  const columns = [
    {
      dataIndex: "order_number",
      key: "id",
      title: t("orderNo"),
    },
    {
      dataIndex: "product",
      key: "product",
      title: t("productTitle"),
      render:(row) => <p>{row ? row : "--"}</p>
    },

    {
      dataIndex: "value",
      key: "value",
      title: t("totalValueText"),
    },
    // {
    //   dataIndex: "value",
    //   key: "value",
    //   title: t("valueText"),
    // },
    {
      dataIndex: "",
      key: "",
      title: t("username"),
      render: (row) => <p>{row?.user?.name}</p>,
    },
    {
      dataIndex: "",
      key: "",
      title: t("phone"),
      render: (row) => (
        <a href={`tel:${row?.user?.phone}`}>{row?.user?.phone}</a>
      ),
    },
    {
      title: "Actions",
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-2 !p-2">
            <Menu.Item
              className="!bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              key="change_status"
              onClick={() => {
                toggleStatusOpen(row);
              }}
            >
              {t("change status")}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                toggleOpenLogs(row?.details);
              }}
              className="!bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              key="logs"
            >
              {t("viewLogsText")}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setOpenDeleteModal(true)
                setRowData(row)
              }}
              className="!bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              key="logs"
            >
              {t("deleteText")}
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Space>
              <FaEllipsisVertical />
            </Space>
          </Dropdown>
        );
      },
    },
  ];

  const filteredData = useMemo(() => {
    if (!searchValue.length) return userProfile;

    return userProfile.filter(
      (item) =>
        item?.product?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        item?.user?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        item?.user?.phone?.toLowerCase()?.includes(searchValue)
    );
  }, [searchValue, userProfile]);

  useEffect(() => {
    setOriginalData(filteredData);
  }, [filteredData]);

  useEffect(()=>{
    console.log(userProfile)
  },[userProfile])

 async function handleDeleteInstall() {
     const data_send = {
      installment_id: rowData?.installment_id,
     };
     setDeleteLoading(true)
     await fetchData({
       url: "installments/order/delete",
       method: "DELETE",
       body: data_send,
     })
       .then((res) => {
         console.log(res);
         if (res?.success) {
          // setUserProfile((prev) => {
          //   const newInstallments = prev.installments[0].data.filter(
          //     (item) => item.installment_id !== rowData.installment_id
          //   );
          
          //   return {
          //     ...prev,
          //     installments: [
          //       {
          //         ...prev.installments[0],
          //         data: newInstallments,
          //       },
          //     ],
          //   };
          // });
                    toast.success(res?.message);
           setOpenDeleteModal(false);
           window.location.reload()
         }
         else {
           toast.error(res || res?.message);
         }
       })
       .catch((e) => console.log(e))
       .finally(() => {
         setDeleteLoading(false)
         setOpenDeleteModal(false)
       })
   }


  return (
    <div>
      <EditInstallmentModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        rowData={rowData}
        setRowData={setRowData}
      />

      <Modal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onClose={() => setOpenDeleteModal(false)}
        footer={null}
      >
        <h2>{t("deleteInstallmentText")}</h2>
        <div className="mt-3 flex gap-2 items-center">
          <button
            onClick={handleDeleteInstall}
            className="bg-red-600 text-white p-2 rounded-md"
          >
            {deleteLoading ? t("loadingText") : t("deleteText")}
          </button>
          <button onClick={() => setOpenDeleteModal(false)} className="border border-blue-600 rounded-md p-2 text-blue-600">
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <Modal
        open={editInstallmentModal}
        onClose={() => setEditInstallmentModal(false)}
        onCancel={() => setEditInstallmentModal(false)}
      >
        <form>
          <div className="input_group">
            <label>{t("")}</label>
          </div>
        </form>
      </Modal>
      <AddInstallmentModal open={openAddModal} setOpen={setOpenAddModal} />
      <InstallmentLogsModal
        onDeleteInstallment={handleDeleteInstallment}
        toggleOpen={toggleOpenLogs}
        openModal={openLogs}
      />
      <InstallmentStatusModal
        toggleStatusOpen={toggleStatusOpen}
        openStatusModal={openStatusModal}
        type={"installment"}
        data={openStatusModal?.data}
      />
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={t("searchText")}
        className="border border-gray-300 outline-hidden p-3 my-3 w-full rounded-md"
      />
      <Table columns={columns} dataSource={originalData} />
    </div>
  );
}
