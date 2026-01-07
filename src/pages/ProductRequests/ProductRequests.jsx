import React, { useEffect, useState } from "react";
import AddProductModal from "../../components/ProductsPage/AddProductModal/AddProductModal";
import { Dropdown, Menu, Modal, Space, Spin, Table } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchProducts } from "../../features/productsSlice";
import { toast } from "react-toastify";
import { fetchCategories } from "../../features/categoriesSlice";
import EditProductModal from "../../components/ProductsPage/EditProductModal/EditProductModal";
import { useTranslation } from "react-i18next";
import {
  addOfferProducts,
  deleteOfferProducts,
  fetchOfferProducts,
} from "../../features/offersSlice";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { data: categories } = useSelector((state) => state.categories);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const { data, deleteLoading, loading } = useSelector(
    (state) => state.offers?.offerProducts
  );
  const { data: productsData } = useSelector((state) => state.products);
  const x = useSelector((state) => console.log(state));
  const {offerProducts ,} = useSelector(state => state?.offers);
  const [searchVal, setSearchVal] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const { t } = useTranslation();
  const [allOffers , setAllOffers] = useState([]);
  const { offer_id } = useParams();
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, per_page: 2000000 }));
    if (searchVal && searchVal?.length)
      dispatch(fetchOfferProducts({ offer_id }));
    else dispatch(fetchOfferProducts({ offer_id }));
  }, [searchVal]);

  const columns = [
    {
      dataIndex: "product_id",
      key: "product_id",
      title: "#",
    },
    {
      dataIndex: "title",
      key: "title",
      title: t("titleText"),
    },
    // {
    //   dataIndex: "description",
    //   key: "description",
    //   title: t("description"),
    // },
    {
      dataIndex: "",
      key: "",
      title: t("categoryText"),
      render: (row) => <p>{row?.category?.title}</p>,
    },
    {
      dataIndex: "price",
      key: "price",
      title: t("priceText"),
    },
    {
      dataIndex: "quantity",
      key: "quantity",
      title: t("productQuantity"),
    },
    {
      dataIndex: "details",
      key: "details",
      title: t("detailsText"),
      ellipsis: true,
      render: (row) => (
        <div className="flex flex-col gap-2">
          {row?.map((item) => (
            <p key={item?.product_detail_id}>
              {item?.label}: {item?.value}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: t("actions"),
      render: (row) => {
        const menu = (
          <Menu className="flex flex-col gap-1 !p-2">
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
    const data_send = {
      product_id: rowData?.product_id,
      offer_id,
    };
    dispatch(deleteOfferProducts(data_send))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload.message);
          dispatch(fetchOfferProducts({ offer_id }));
          dispatch(fetchOfferProducts({ offer_id }));
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
  const [products, setProducts] = useState([]);
  function handleAddProducts() {
    const data_send = {
      products: products?.map((item) => item?.value),
      offer_id,
    };
    console.log(data_send);
    dispatch(addOfferProducts(data_send))
      .then((res) => {
        if (res?.payload?.success) {
          dispatch(addOfferProducts({ data_send }));
          dispatch(fetchOfferProducts({ offer_id }));
          toast.success(res?.payload.message);
          setOpenAddModal(false);
        } else {
          toast.error(res?.payload);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setOpenAddModal(false);
      });
  }
  useEffect(() => {
    if(offerProducts?.data?.offers?.find(item => item?.offer?.offer_id == offer_id)?.products?.length) {
      setAllOffers(offerProducts?.data?.offers?.find(item => item?.offer?.offer_id == offer_id)?.products)
    }
  }, [offerProducts , offer_id]);

  useEffect(() => {
    console.log(productsData?.data?.products?.filter(item => !allOffers?.includes(item?.value)))
  } , [])

  return (
    <div>
      <div className="flex gap-3 justify-between my-4">
        <h3 className="font-semibold text-[20px] md:text-[25px] text-[#0d6efd]">
          {t("productsText")}
        </h3>
        {console.log("productsData", productsData)}

        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white rounded-md p-1 md:p-3 flex justify-center items-center"
        >
          {t("addProductText")}
        </button>
      </div>

      <Modal
        open={openDeleteModal}
        onCancel={() => setOpenDeleteModal(false)}
        onClose={() => setOpenDeleteModal(false)}
        footer={null}
      >
        <h3>{t("deleteProductText")}</h3>
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

      <Modal
        open={openImageModal}
        onCancel={() => setOpenImageModal(false)}
        onClose={() => setOpenImageModal(false)}
        title={t("productsImagesText")}
      >
        {rowData?.images?.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {rowData?.images?.map((item) => (
              <img
                key={item?.product_image_id}
                src={item?.image_url}
                className="w-[100px] h-[100px] object-cover rounded-md"
              />
            ))}
            {/* <img/> */}
          </div>
        ) : (
          <p>{t("noImagesData")}</p>
        )}
      </Modal>

      <Modal
        open={openAddModal}
        onCancel={() => setOpenAddModal(false)}
        onClose={() => setOpenAddModal(false)}
        footer={null}
      >
        <h3>{t("addProductText")}</h3>
        <Select
          onChange={setProducts}
          defaultValue={products}
          isMulti
          name="Products"
          options={productsData?.data?.products?.filter(item => 
            !allOffers?.some(offer => offer?.product_id  == item?.product_id)
          )?.map((item) => ({
            label: item?.title,
            value: item?.product_id,
          }))}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleAddProducts}
            className="bg-red-700 text-white rounded-md p-2 flex justify-center items-center"
          >
            {t("saveBtn")}
          </button>
          <button
            className="border border-[#0d6efd] text-[#0d6efd] outline-none rounded-md p-2 flex justify-center items-center"
            onClick={() => setOpenAddModal(false)}
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      <input
        onChange={(e) => setSearchVal(e.target.value)}
        type="text"
        placeholder={t("searchText")}
        className="p-3 border border-gray-300 outlin-hidden my-3 w-full rounded-md"
      />
      {console.log("data-data", data?.data?.offers)}
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <Table
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={allOffers?.length ? allOffers : []}
        />
      )}
    </div>
  );
}
