import { Modal, Switch } from "antd";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../features/categoriesSlice";
import {
  addProduct,
  editProduct,
  fetchProducts,
} from "../../../features/productsSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { editOffer, fetchOffers } from "../../../features/offersSlice";

export default function EditOfferModal({ open, setOpen, rowData, setRowData }) {
  const [deletedImg, setDeletedImg] = useState([]);
  const { t } = useTranslation();
  const [deletedDetail, setDeletedDetail] = useState([]);
  const { data } = useSelector((state) => state.categories);
  const { editLoading } = useSelector((state) => state?.products);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(editOffer(rowData))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchOffers({ page: 1, per_page: 7 }));
          setOpen(false);
        } else {
          toast.error(res?.payload || "There's an error while adding product");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleAddDetail = () => {
    setRowData({
      ...rowData,
      details: [
        ...(rowData.details || []),
        { product_detail_id: Date.now(), label: "", value: "" },
      ],
    });
  };

  const handleDeleteDetail = (id) => {
    setDeletedDetail([...deletedDetail, id]);
    const updatedDetails = rowData.details.filter(
      (item) => item?.product_detail_id !== id
    );
    setRowData({ ...rowData, details: updatedDetails });
  };

  const handleImageDelete = (index) => {
    setDeletedImg([...deletedImg, index]);
    const updatedImages = rowData.images.filter(
      (item, i) => item?.product_image_id != index
    );
    setRowData({ ...rowData, image: updatedImages, images: updatedImages });
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={t("editProductText")}
      footer={null}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="input-group">
            <label>{t("start_date")}</label>
            <input
              type="datetime-local"
              value={rowData.start_date}
              onChange={(e) =>
                setRowData({ ...rowData, start_date: e.target.value })
              }
            />
          </div>
          <div className="input-group">
            <label>{t("end_date")}</label>
            <input
              type="datetime-local"
              value={rowData.end_date}
              onChange={(e) =>
                setRowData({ ...rowData, end_date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid  grid-cols-1 md:grid-cols-2 gap-2">
          <div className="input-group">
            <label>{t("offer_value")}</label>
            <input
              type="number"
              onWheel={(e) => e?.target?.blur()}
              defaultValue={rowData.offer_value}
              value={rowData.value}
              onChange={(e) =>
                setRowData({ ...rowData, value: e.target.value })
              }
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#0d6efd] text-white w-full p-2 rounded-md"
        >
          {t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
