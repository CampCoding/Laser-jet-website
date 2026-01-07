import React, { useEffect, useState } from "react";
import AddProductModal from "../../components/ProductsPage/AddProductModal/AddProductModal";
import { Dropdown, Menu, Modal, Space, Spin, Table } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchProducts } from "../../features/productsSlice";
import { toast } from "react-toastify";
import { fetchCategories } from "../../features/categoriesSlice";
import EditProductModal from "../../components/ProductsPage/EditProductModal/EditProductModal";
import { useTranslation } from "react-i18next";
import { deleteOffer, fetchOffers } from "../../features/offersSlice";
import AddOfferModal from "../../components/OffersPage/AddOfferModal/AddOfferModal";
import EditOfferModal from "../../components/OffersPage/EditOfferModal/EditOfferModal";

export default function OffersPage() {
  const navigate = useNavigate();
  const { data: categories } = useSelector((state) => state.categories);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const {
    data,
    products,
    error,
    addLoading,
    editLoading,
    deleteLoading,
    loading,
  } = useSelector((state) => state.offers);
  const x = useSelector((state) => console.log(state));
  const [searchVal, setSearchVal] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const { t } = useTranslation();
  useEffect(() => {
    if (searchVal && searchVal?.length)
      dispatch(fetchOffers({ page: 1, per_page: 7, keywords: searchVal }));
    else dispatch(fetchOffers({ page: 1, per_page: 7 }));
  }, [searchVal]);

  const columns = [
    {
      dataIndex: "offer_id",
      key: "offer_id",
      title: "#",
    },
    {
      dataIndex: "start_date",
      key: "start_date",
      title: t("start_date"),
    },
    {
      dataIndex: "end_date",
      key: "end_date",
      title: t("end_date"),
    },
    {
      dataIndex: "offer_value",
      key: "offer_value",
      title: t("offer_value"),
    },
    {
      title: t("actions"),
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-1 !p-2">
            <Menu.Item
              onClick={() => {
                setOpenEditModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
              key={"edit"}
            >
              {t("editText")}
            </Menu.Item>

            <Menu.Item
              onClick={() => {
                setOpenDeleteModal(true);
                setRowData(row);
              }}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
              key={"delete"}
            >
              {t("deleteText")}
            </Menu.Item>

            <Menu.Item
              onClick={() => navigate("/product_requests/" + row?.offer_id)}
              className="bg-[#0d6efd] hover:!bg-[#0d6efd] !text-white rounded-md p-3 flex justify-center items-center"
              key={"request"}
            >
              {t("productsText")}
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

  function handleDelete() {
    console.log(rowData)
    const data_send = {
      offer_id: rowData?.offer_id,
    };
    dispatch(deleteOffer(data_send))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload.message);
          dispatch(fetchOffers({ page: 1, per_page: 7 }));
          setOpenDeleteModal(false);
        } else {
          toast.error(res?.payload);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setOpenDeleteModal(false);
      });
  }

  useEffect(() => {
    console.log("data offers", data?.data);
  }, [data?.data?.offers]);

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[20px] md:text-[25px] text-[#0d6efd]">
          {t("offersText")}
        </h3>
        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-1 md:p-3 flex justify-center items-center"
        >
          {t("addOfferText")}
        </button>
      </div>

      <Modal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onClose={() => setOpenDeleteModal(false)}
        footer={null}
      >
        <h3>{t("deleteOfferText")}</h3>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white rounded-md p-2 flex justify-center items-center"
          >
            {deleteLoading ? <Spin className="text-white" /> : t("deleteText")}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-2 flex justify-center items-center"
            onClick={() => setOpenDeleteModal(false)}
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      {console.log("data", data)}

      <AddOfferModal open={openAddModal} setOpen={setOpenAddModal} />
      <EditOfferModal
        rowData={rowData}
        setRowData={setRowData}
        open={openEditModal}
        setOpen={setOpenEditModal}
      />

      <input
        onChange={(e) => setSearchVal(e.target.value)}
        type="text"
        placeholder={t("searchText")}
        className="p-3 border border-gray-300 outline-hidden my-3 w-full rounded-md"
      />
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={
            data?.data?.offers?.length
              ? data?.data?.offers?.map((item) => item?.offer)
              : []
          }
        />
      )}
    </div>
  );
}
