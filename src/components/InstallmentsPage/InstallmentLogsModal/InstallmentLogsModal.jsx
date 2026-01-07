import { Modal } from "antd";
import { useState , useEffect} from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Menu, Space, Table } from "antd";
import InstallmentStatusModal from "../InstallmentStatus/InstallmentStatus";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { handleUpdateInstallmentTransaction } from "../../../features/transactionSlice";
import { toast } from "react-toastify";
import { fetchData } from "../../../api/apiIntsance";

export default function InstallmentLogsModal({ toggleOpen,onDeleteInstallment, openModal }) {
  const [openStatusModal, setOpenStatusModal] = useState({
    open: false,
    data: {},
  });
  const [installmentDetails, setInstallmentDetails] = useState(openModal?.data || []);
  
  const { editLoading } = useSelector((state) => state?.adminTransactions);
  const [rowData, setRowData] = useState(false);
  const[deleteLoading , setDeleteLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const dispatch = useDispatch();
  const toggleStatusOpen = (data) => {
    setOpenStatusModal({
      ...openStatusModal,
      open: !openStatusModal?.open,
      data: data ? data : openStatusModal?.data,
    });
  };
  const { t } = useTranslation();
  
  useEffect(() => {
    setInstallmentDetails(openModal?.data || []);
  }, [openModal?.data]);
  
  const columns = [
    {
      dataIndex: "part_value",
      key: "id",
      title: "installment value",
    },
    {
      dataIndex: "part_status",
      key: "product",
      title: t("partStatus"),
    },

    {
      dataIndex: "part_due_date",
      key: "part_due_date",
      title: t("partDueDate"),
    },

    {
      title: "Actions",
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-2 !p-2">
            {/* <Menu.Item
              className="!bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              key="edit"
              onClick={() => {
                console.log(row);
                setOpenEditModal(true);
                setRowData(row);
              }} // Pass row data
            >
              {t("editText")}
            </Menu.Item> */}
            <Menu.Item
              className="!bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-2 flex justify-center items-center"
              key="edit"
              onClick={() => {
                console.log(row);
                setOpenDeleteModal(true);
                setRowData(row);
              }} // Pass row data
            >
              {t("deleteText")}
            </Menu.Item>
            <Menu.Item
              className="!bg-[#0d6efd] !flex !justify-center !items-center hover:!bg-[#0d6efd] !text-white rounded-md p-2"
              key="changeStatus"
              onClick={() => toggleStatusOpen(row)}
            >
              {t("change status")}
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <FaEllipsisVertical />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  function handleEdit(e) {
    e.preventDefault();
    const data_send = {
      part_id: rowData?.part_id,
      part_value: rowData?.part_value,
      part_date: rowData?.part_due_date,
    };

    console.log(data_send);
    dispatch(handleUpdateInstallmentTransaction(data_send))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          window.location.reload();
          setOpenEditModal(false);
        } else {
          toast.error(res || "there's an error while editing installment");
        }
      })
      .catch((e) => console.log(e));
  }

  async function handleDeleteInstallment() {
    const data_send = {
      part_id: rowData?.part_id,
    };
    setDeleteLoading(true)
    await fetchData({
      url: "installments/part/delete",
      method: "DELETE",
      body: data_send,
    })
      .then((res) => {
        console.log(res);
        if (res?.success) {
          const updated = installmentDetails.filter(part => part.part_id !== rowData?.part_id);
          setInstallmentDetails(updated); // ✨ تحديث المودال مباشرة
          onDeleteInstallment(rowData?.part_id); // تحديث الجدول الخارجي
          toast.success(res?.message);
          setOpenDeleteModal(false);
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
    <>
      <Modal
        title={t("addInstallmentsText")}
        footer={null}
        onCancel={() => toggleOpen([])}
        onClose={() => toggleOpen([])}
        open={openModal?.open}
        setOpen={toggleOpen}
      >
        <InstallmentStatusModal
          toggleStatusOpen={toggleStatusOpen}
          openStatusModal={openStatusModal}
          type={"part"}
          data={openStatusModal?.data}
        />

        <Table columns={columns} dataSource={installmentDetails} />
      </Modal>

      <Modal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onClose={() => setOpenDeleteModal(false)}
        footer={null}
      >
        <h2>{t("deleteInstallmentText")}</h2>
        <div className="mt-3 flex gap-2 items-center">
          <button
            onClick={handleDeleteInstallment}
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
        title={t("editInstallmentText")}
        footer={null}
        open={openEditModal}
        onCancel={() => setOpenEditModal(false)}
        onClose={() => setOpenEditModal(false)}
      >
        <form onSubmit={handleEdit}>
          <div className="input-group">
            <label>{t("part_pay_date")}</label>
            <input
              type="datetime-local"
              value={rowData?.part_due_date}
              onChange={(e) =>
                setRowData({ ...rowData, part_due_date: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("partValue")}</label>
            <input
              type="text"
              value={rowData?.part_value}
              onChange={(e) =>
                setRowData({ ...rowData, part_value: e.target.value })
              }
            />
          </div>

          <button className="mt-4 p-2 bg-blue-500 text-white rounded-sm">
            {editLoading ? t("loadingText") : t("editText")}
          </button>
        </form>
      </Modal>
    </>
  );
}
