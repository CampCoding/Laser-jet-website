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

export default function EditProductModal({
  open,
  setOpen,
  rowData,
  setRowData,
}) {
  const [deletedImg, setDeletedImg] = useState([]);
  const {t} = useTranslation();
  const [deletedDetail, setDeletedDetail] = useState([]);
  const { data } = useSelector((state) => state.categories);
  const { editLoading } = useSelector((state) => state?.products);
  const dispatch = useDispatch();
  const { data : categories } = useSelector((state) => state.categories);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("description", rowData.description);
    formData.append("title", rowData.title);
    formData.append("price", rowData.price);
    formData.append("is_active", rowData.is_active);
    formData.append("product_id", rowData.product_id);
    formData.append("category_id", rowData.category_id);
    formData.append("quantity", +rowData.quantity);

    if (rowData?.details?.length > 0) {
      rowData?.details.forEach((detail, index) => {
        formData.append(`details[${index}][product_detail_id]` , detail?.product_detail_id);
        formData.append(`details[${index}][label]`, detail.label);
        formData.append(`details[${index}][value]`, detail.value);
      });
    }

    if (deletedImg?.length > 0) {
      deletedImg.forEach((item, index) =>
        formData.append(`deletedImages[${index}]`, item)
      );
    }
    if (deletedDetail?.length > 0) {
      deletedDetail.forEach((item, index) => {
        formData.append(`details[${index}][product_detail_id]`, item);
      });
    }
       if(rowData?.image?.length >0) {
        rowData?.image?.forEach((item,index) => formData.append(`image`, item))
       }

    dispatch(editProduct(formData))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchProducts({ page: 1, per_page: 1000 }));
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
        { product_detail_id: null, label: "", value: "" },
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
            <label>{t("titleText")}</label>
            <input
              type="text"
              value={rowData.title}
              onChange={(e) =>
                setRowData({ ...rowData, title: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("priceText")}</label>
            <input
              type="text"
              value={rowData.price}
              onChange={(e) =>
                setRowData({ ...rowData, price: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="input-group">
          <label>{t("productCodeText")}</label>
          <input
            type="text"
            value={rowData.sympol}
            onChange={(e) => setRowData({ ...rowData, sympol: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>{t("productQuantity")}</label>
          <input
            type="text"
            value={rowData.quantity}
            onChange={(e) => setRowData({ ...rowData, quantity: e.target.value })}
          />
        </div>
        </div>

        <div className="input-group">
          <label>{t("description")}</label>
          <textarea
            value={rowData.description}
            onChange={(e) =>
              setRowData({ ...rowData, description: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <label>{t("categoryText")}</label>
          <select
          value={rowData?.category_id}
            onChange={(e) =>
              setRowData({ ...rowData, category_id: +e.target.value })
            }
          >
            <option value="" disabled selected>
              Select category...
            </option>
            {categories?.data?.categories?.map((item) => (
              <option key={item?.category_id} value={item?.category_id}>
                {item?.title}
              </option>
            ))}
          </select>
       
        </div>

        <div className="input-group">
          <label>{t("imagesText")}</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setRowData({
                ...rowData,
                image: [...(rowData.image || []), ...e.target.files],
              })
            }
          />
        </div>

        {rowData?.images?.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {rowData.images.map((item, idx) => (
              <div
                key={item?.product_image_id}
                className="flex gap-2 items-center"
              >
                <img
                  src={item?.image_url}
                  className="w-[100px] h-[100px] object-cover rounded-md"
                />
                <FaTrash
                  className="text-red-500"
                  onClick={() => handleImageDelete(item?.product_image_id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="my-3">
          <div className="flex gap-2 justify-between items-center">
            <label>{t("detailsText")}</label>
            <FaPlus onClick={handleAddDetail} />
          </div>
          {rowData?.details?.map((item) => (
            <div key={item.product_detail_id} className="flex gap-2 items-center my-3">
              <input
                className="p-2 border border-gray-200 rounded-md w-full outline-hidden"
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    details: rowData.details.map((detail) =>
                        detail.product_detail_id === item.product_detail_id
                          ? { ...detail, label: e.target.value }
                          : detail
                      ),
                  })
                }
              />
              <input
                className="p-2 border border-gray-200 rounded-md w-full outline-hidden"
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) =>
                  setRowData({
                    ...rowData,
                    details: rowData.details.map((detail) =>
                        detail.product_detail_id === item.product_detail_id
                          ? { ...detail, value: e.target.value }
                          : detail
                      ),
                  })
                }
              />
              <FaTrash
                className="text-red-600 text-[23px]"
                onClick={() => handleDeleteDetail(item.product_detail_id)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center mt-4">
          <Switch
            checked={rowData.is_active}
            onChange={(checked) =>
              setRowData({ ...rowData, is_active: checked })
            }
          />
          <label>{t("isActiveText")}</label>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white w-full p-2 rounded-md"
        >
          {editLoading ? t("loadingText") :t("saveBtn")}
        </button>
      </div>
    </Modal>
  );
}
