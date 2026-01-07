import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { handleCreateCreditForm } from "../../../features/creditFormSlice";
import { toast } from "react-toastify";
import { conifgs } from "../../../config";

export default function AddCreditFormModal({
  openAddModal,
  user_id,
  setOpenAddModal,
}) {
  const { t } = useTranslation();
  const imageInputRef = useRef();
  const [newImages, setNewImages] = useState([]);
  const [newDocs, setNewDocs] = useState([]);
  const [moreInfoInputs, setMoreInfoInputs] = useState([]);
  const docInputRef = useRef();
  const dispatch = useDispatch();
  const [accountRequests, setAccountRequests] = useState([]);
  const [creditFormData, setCreditFormData] = useState({
    full_name: "",
    email: "",
    national_id: "",
    address_in_card: "",
    current_address: "",
    job: "",
    salary: "",
    insurance_status: "",
    birthday: "",
    type: "",
    images: "",
    docs: "",
  });

  // Handle single-file selection for images (no multiple)
  function handleAddNewImage(e) {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setNewImages((prev) => [...prev, newFile]);
    }
  }

  // Handle single-file selection for docs (no multiple)
  function handleAddNewDoc(e) {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setNewDocs((prev) => [...prev, newFile]);
    }
  }

  function handleAddOneInput() {
    setMoreInfoInputs((prev) => [
      ...prev,
      { id: moreInfoInputs?.length + 1, label: "", value: "" },
    ]);
  }

  function handleDeleteInput(id) {
    setMoreInfoInputs((prev) => prev?.filter((item) => item?.id !== id));
  }

  function handleChangeInput(key, value, id) {
    const updatedIputs = moreInfoInputs.map((item) =>
      item?.id == id ? { ...item, [key]: value } : item
    );
    setMoreInfoInputs(updatedIputs);
  }

  
    function handleGetCreditForm() {
        fetch(`${conifgs.LIVE_BASE_URL}credit-forms?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // If API returns a single object, wrap it in an array to use in Table
            setAccountRequests(
              Array.isArray(data.data) ? data.data : [data.data]
            );
          }
        })
        .catch((error) => console.error("Error fetching credit forms:", error));
    }

    useEffect(() => {
        if (user_id) {
         handleGetCreditForm()
        }
      }, [user_id]);
  

  function handleSubmit() {
    const formData = new FormData();
    formData.append("full_name", creditFormData?.full_name);
    formData.append("national_id", creditFormData?.national_id);
    formData.append("email", creditFormData?.email);
    formData.append("address_in_card", creditFormData?.address_in_card);
    formData.append("current_address", creditFormData?.current_address);
    formData.append("job", creditFormData?.job);
    formData.append("salary", creditFormData?.salary);
    formData.append("type", "request");
    // formData.append("images", JSON.stringify(newImages));
    formData.append("user_id", user_id);
    // formData.append("docs", JSON.stringify(newDocs));
    formData.append("birthday", creditFormData.birthday);
    formData.append("insurance_status", creditFormData.insurance_status);
    moreInfoInputs.forEach((item, index) => {
        formData.append(`details[${index}][label]`, item?.label);
        formData.append(`details[${index}][value]`, item?.value);
      });
      
      newImages.forEach(file => formData.append("images", file));
      newDocs?.forEach(file => formData.append("docs", file));
    dispatch(handleCreateCreditForm(formData)).unwrap().then(res => {
        if(res?.success) {
            toast.success(res?.message)
            setOpenAddModal(false)
            handleGetCreditForm()
            setCreditFormData({
                full_name: "",
                email: "",
                national_id: "",
                address_in_card: "",
                current_address: "",
                job: "",
                salary: "",
                insurance_status: "",
                birthday: "",
                type: "",
                images: "",
                docs: "",
            })
            setNewDocs([]);
            setNewImages([]);
            setMoreInfoInputs([]);

        }
    })
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
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("fullName")}</label>
              <input
                type="text"
                value={creditFormData?.full_name || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    full_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("phone")}</label>
              <input
                type="tel"
                value={creditFormData?.phone || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("nationalId")}</label>
              <input
                type="text"
                value={creditFormData?.national_id || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    national_id: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("email")}</label>
              <input
                type="email"
                value={creditFormData?.email || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("job")}</label>
              <input
                type="text"
                value={creditFormData?.job || ""}
                onChange={(e) =>
                  setCreditFormData({ ...creditFormData, job: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("insuranceStatus")}</label>
              <select
                value={creditFormData.insurance_status}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    insurance_status: e.target.value,
                  })
                }
              >
                <option value={""} selected disabled>
                  اختر حالة
                </option>
                <option value={"exists"}>{t("existText")}</option>
                <option value={"not-exists"}>{t("notExistText")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("addressInCard")}</label>
              <input
                type="text"
                value={creditFormData?.address_in_card || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    address_in_card: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("currentAddress")}</label>
              <input
                type="text"
                value={creditFormData?.current_address || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    current_address: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex">
            <div className="input-group">
              <label>{t("salaryText")}</label>
              <input
                type="text"
                value={creditFormData?.salary || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    salary: e.target.value,
                  })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("birthday")}</label>
              <input
                type="date"
                value={creditFormData?.birthday || ""}
                onChange={(e) =>
                  setCreditFormData({
                    ...creditFormData,
                    birthday: e.target.value,
                  })
                }
              />
            </div>
          </div>
          {/* "Add Image" button and hidden single-file input */}
          <div className="input-group">
            <label>{t("uploadImagesText")}</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="bg-green-600 text-white p-2 rounded-sm"
                onClick={() => imageInputRef.current.click()}
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

          {/* Preview newly chosen images */}
          {newImages.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {newImages.map((file, index) => {
                const previewUrl = URL.createObjectURL(file);
                return (
                  <div key={index} className="relative">
                    <img
                      src={previewUrl}
                      className="w-[100px] h-[100px] object-contain rounded-md"
                      alt="chosen file"
                    />
                    <FaTrash
                      className="text-red-500 absolute top-0 right-0 cursor-pointer"
                      onClick={() =>
                        openRemoveConfirmation("newImage", index, null)
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* "Add Doc" button and hidden single-file input */}
          <div className="input-group">
            <label>{t("uploadDocsText")}</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="bg-blue-600 text-white p-2 rounded-sm"
                onClick={() => docInputRef.current.click()}
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

          {/* Preview newly chosen docs */}
          {newDocs.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {newDocs.map((file, index) => {
                const isImage = file.type.startsWith("image/");
                const previewUrl = isImage
                  ? URL.createObjectURL(file)
                  : "https://via.placeholder.com/100?text=DOC";
                return (
                  <div key={index} className="relative">
                    <img
                      src={previewUrl}
                      className="w-[100px] h-[100px] object-contain rounded-md"
                      alt="chosen doc"
                    />
                    <FaTrash
                      className="text-red-500 absolute top-0 right-0 cursor-pointer"
                      onClick={() =>
                        openRemoveConfirmation("newDoc", index, null)
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}


        </div>

        <div className="flex justify-between items-center gap-2">
          <label>{t("addMoreInfoText")}</label>
          <div
            onClick={handleAddOneInput}
            className="flex justify-center items-center rounded-sm p-2 bg-blue-500 text-white"
          >
            <FaPlus />
          </div>
        </div>

        {moreInfoInputs?.map((item) => (
          <div key={item?.id} className="w-full gap-2 items-center flex">
            <div className="flex w-full input-group flex-col gap-1">
              <label>{t("labelText")}</label>
              <input
                onChange={(e) =>
                  handleChangeInput("label", e.target.value, item?.id)
                }
              />
            </div>

            <div className="flex flex-col input-group gap-1">
              <label>{t("valueText")}</label>
              <input
                onChange={(e) =>
                  handleChangeInput("value", e.target.value, item?.id)
                }
              />
            </div>

            <FaTrash
              onClick={() => handleDeleteInput(item?.id)}
              className="text-red-500 text-[28px]  my-auto flex h-fit"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center mt-4">
        <button
          onClick={handleSubmit}
          className="flex justify-center items-center rounded-sm p-2 bg-blue-500 text-white"
        >
          {t("addText")}
        </button>
        <button
          onClick={() => setOpenAddModal(false)}
          className="flex justify-center items-center rounded-sm p-2 border border-blue-500 text-blue-500"
        >
          {t("cancelText")}
        </button>
      </div>
    </Modal>
  );
}
