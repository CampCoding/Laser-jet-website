import { Modal } from "antd";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  handleDeleteDetail,
  handleGetCreditForm,
  handleUpdateCreditForm,
} from "../../../features/creditFormSlice";
import { toast } from "react-toastify";

export default function EditCreditFormModal({
  openAddModal,
  user_id,
  setOpenAddModal,
  rowData,
  setRowData,
}) {
  const { t } = useTranslation();
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  const { editLoading } = useSelector((state) => state?.creditForm);
  const dispatch = useDispatch();

  const [moreInfoInputs, setMoreInfoInputs] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newDocs, setNewDocs] = useState([]);

  useEffect(() => {
    if (user_id) {
      dispatch(handleGetCreditForm({ user_id }));
    }
  }, [dispatch, user_id]);

  useEffect(() => {
    setMoreInfoInputs(rowData?.details || []);
  }, [rowData]);

  function getPreviewUrl(file) {
    if (typeof file === "string") {
      return file;
    } else if (file instanceof File || file instanceof Blob) {
      return URL.createObjectURL(file);
    }

    return "";
  }

  const handleAddNewImage = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        setNewImages((prev) => [...prev, file]);

        setRowData((prev) => ({
          ...prev,
          images: [...(prev.images || []), file],
        }));
      }
    },
    [setRowData]
  );

  const handleAddNewDoc = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setNewDocs((prev) => [...prev, file]);

        setRowData((prev) => ({
          ...prev,
          docs: [...(prev.docs || []), file],
        }));
      }
    },
    [setRowData]
  );

  function handleAddOneInput() {
    const newItem = { id: null, label: "", value: "" };
    setMoreInfoInputs((prev) => [...prev, newItem]);

    setRowData((prev) => ({
      ...prev,
      details: [...(prev?.details || []), newItem],
    }));
  }

  function handleDeleteInput(detailId) {
    if (!detailId) {
      const updated = rowData?.details?.filter((item) => item.id !== detailId);
      setRowData((prev) => ({ ...prev, details: updated }));
      setMoreInfoInputs(updated);
      return;
    }

    dispatch(handleDeleteDetail({ detail_id: detailId }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);

          const updated = rowData?.details?.filter(
            (item) => item.id !== detailId
          );
          setRowData({ ...rowData, details: updated });
          setMoreInfoInputs(updated);
        } else {
          toast.error(res?.message || t("errorOccuredWhileDeletingDetail"));
        }
      })
      .catch((err) => {
        console.log("Error on deleting detail:", err);
        toast.error(t("errorOccuredWhileDeletingDetail"));
      });
  }

  function handleChangeInput(label, value, detailId) {
    const updated = (rowData?.details || []).map((item) =>
      item.id === detailId ? { ...item, [label]: value } : item
    );
    setRowData((prev) => ({ ...prev, details: updated }));
    setMoreInfoInputs(updated);
  }

  function handleRemoveImage(index) {
    const updated = [...(rowData?.images || [])];
    updated.splice(index, 1);
    setRowData((prev) => ({ ...prev, images: updated }));
  }

  function handleRemoveDoc(index) {
    const updated = [...(rowData?.docs || [])];
    updated.splice(index, 1);
    setRowData((prev) => ({ ...prev, docs: updated }));
  }

  function handleSubmit() {
    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("form_id", rowData?.form_id || "");
    formData.append("full_name", rowData?.full_name || "");
    formData.append("national_id", rowData?.national_id || "");
    formData.append("email", rowData?.email || "");
    formData.append("job", rowData?.job || "");
    formData.append("insurance_status", rowData?.insurance_status || "");
    formData.append("current_address", rowData?.current_address || "");
    formData.append("address_in_card", rowData?.address_in_card || "");
    formData.append("salary", rowData?.salary || "");
    formData.append("birthday", rowData?.birthday || "");

    const imagesForJSON = (rowData?.images || []).map((item) => {
      if (typeof item === "string") {
        return { url: item };
      } else {
        return null;
      }
    });

    rowData?.images?.forEach((file) => formData.append("images", file));
    rowData?.docs?.forEach((file) => formData.append("docs", file));

    rowData?.details?.forEach((detail, idx) => {
      formData.append(`details[${idx}][id]`, detail.id || "");
      formData.append(`details[${idx}][label]`, detail.label || "");
      formData.append(`details[${idx}][value]`, detail.value || "");
    });

    dispatch(handleUpdateCreditForm(formData))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);

          dispatch(handleGetCreditForm({ user_id }));
          setOpenAddModal(false);
        } else {
          toast.error(res?.message || t("somethingWentWrong"));
        }
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error(t("somethingWentWrong"));
      });
  }

  return (
    <Modal
      footer={null}
      open={openAddModal}
      onCancel={() => setOpenAddModal(false)}
      onClose={() => setOpenAddModal(false)}
      title={t("addMoreInfoText")}
    >
      <div className="flex flex-col gap-2">
        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("fullName")}</label>
            <input
              type="text"
              value={rowData?.full_name || ""}
              onChange={(e) =>
                setRowData((prev) => ({ ...prev, full_name: e.target.value }))
              }
            />
          </div>
          <div className="input-group">
            <label>{t("nationalId")}</label>
            <input
              type="text"
              value={rowData?.national_id || ""}
              onChange={(e) =>
                setRowData((prev) => ({ ...prev, national_id: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Another row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("email")}</label>
            <input
              type="email"
              value={rowData?.email || ""}
              onChange={(e) =>
                setRowData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="input-group">
            <label>{t("job")}</label>
            <input
              type="text"
              value={rowData?.job || ""}
              onChange={(e) =>
                setRowData((prev) => ({ ...prev, job: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Another row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("insuranceStatus")}</label>
            <select
              value={rowData?.insurance_status || ""}
              onChange={(e) =>
                setRowData((prev) => ({
                  ...prev,
                  insurance_status: e.target.value,
                }))
              }
            >
              <option value="">{t("select")}</option>
              <option value="exists">{t("existText")}</option>
              <option value="not-exists">{t("notExistText")}</option>
            </select>
          </div>
          <div className="input-group">
            <label>{t("salaryText")}</label>
            <input
              type="number"
              value={rowData?.salary || ""}
              onChange={(e) =>
                setRowData((prev) => ({ ...prev, salary: e.target.value }))
              }
            />
          </div>
        </div>

        {/* addresses */}
        <div className="grid grid-cols-2 gap-3">
          <div className="input-group">
            <label>{t("addressInCard")}</label>
            <input
              type="text"
              value={rowData?.address_in_card || ""}
              onChange={(e) =>
                setRowData((prev) => ({
                  ...prev,
                  address_in_card: e.target.value,
                }))
              }
            />
          </div>
          <div className="input-group">
            <label>{t("currentAddress")}</label>
            <input
              type="text"
              value={rowData?.current_address || ""}
              onChange={(e) =>
                setRowData((prev) => ({
                  ...prev,
                  current_address: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* birthday */}
        <div className="input-group">
          <label>{t("birthday")}</label>
          <input
            type="date"
            value={
              rowData?.birthday
                ? new Date(rowData?.birthday).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setRowData((prev) => ({ ...prev, birthday: e.target.value }))
            }
          />
        </div>

        {/* -----------
            IMAGES
            ----------- */}
        <div className="input-group">
          <label>{t("uploadImagesText")}</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-green-600 text-white p-2 rounded-sm"
              onClick={() => imageInputRef.current?.click()}
            >
              +
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAddNewImage}
            />
          </div>
        </div>

        {rowData?.images && rowData?.images?.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-3">
            {rowData?.images?.map((fileOrUrl, index) => {
              const previewUrl = getPreviewUrl(fileOrUrl);
              return (
                <div key={index} className="relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      className="w-[100px] h-[100px] object-contain rounded-md"
                      alt="preview"
                    />
                  ) : null}
                  <FaTrash
                    className="text-red-500 absolute top-0 right-0 cursor-pointer"
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* -----------
            DOCS
            ----------- */}
        <div className="input-group">
          <label>{t("uploadDocsText")}</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-blue-600 text-white p-2 rounded-sm"
              onClick={() => docInputRef.current?.click()}
            >
              +
            </button>
            <input
              ref={docInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleAddNewDoc}
            />
          </div>
        </div>

        {rowData?.docs && rowData?.docs?.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-3">
            {rowData?.docs?.map((fileOrUrl, index) => {
              const previewUrl = getPreviewUrl(fileOrUrl);

              let isImage = false;
              if (fileOrUrl instanceof File) {
                isImage = fileOrUrl.type?.startsWith("image/");
              } else if (typeof fileOrUrl === "string") {
                isImage = fileOrUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              }
              return (
                <div key={index} className="relative">
                  {isImage ? (
                    <img
                      src={previewUrl}
                      className="w-[100px] h-[100px] object-contain rounded-md"
                      alt="doc"
                    />
                  ) : (
                    <img
                      src={
                        previewUrl || "https://via.placeholder.com/100?text=DOC"
                      }
                      className="w-[100px] h-[100px] object-contain rounded-md"
                      alt="doc"
                    />
                  )}
                  <FaTrash
                    className="text-red-500 absolute top-0 right-0 cursor-pointer"
                    onClick={() => handleRemoveDoc(index)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* -----------
            DETAILS
            ----------- */}
        <div>
          <div className="flex justify-between items-center">
            <h4 className="text-lg my-3 font-bold">{t("detailsText")}</h4>
            <button
              type="button"
              className="bg-blue-600 text-white p-2 rounded-sm mt-2"
              onClick={handleAddOneInput}
            >
              <FaPlus />
            </button>
          </div>
          {rowData?.details?.map((detail, index) => (
            <div key={index} className="flex gap-3 mb-2">
              <div className="input-group">
                <label>{t("labelText")}</label>
                <input
                  type="text"
                  placeholder={t("labelText")}
                  value={detail?.label}
                  onChange={(e) =>
                    handleChangeInput("label", e.target.value, detail?.id)
                  }
                />
              </div>
              <div className="input-group">
                <label>{t("valueText")}</label>
                <input
                  type="text"
                  placeholder={t("valueText")}
                  value={detail?.value}
                  onChange={(e) =>
                    handleChangeInput("value", e.target.value, detail?.id)
                  }
                />
              </div>
              <button
                type="button"
                className="text-red-500"
                onClick={() => handleDeleteInput(detail?.id)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* -----------
            SUBMIT
            ----------- */}
        <div className="flex justify-between mt-3">
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={handleSubmit}
            disabled={editLoading}
          >
            {editLoading ? t("loadingText") : t("editText")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
