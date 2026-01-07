import { Modal, Table } from "antd";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { conifgs } from "../../config";
import AddCreditFormModal from "./AddCreditFormModal/AddCreditFormModal";
import { useDispatch } from "react-redux";
import { handleDeleteDetail } from "../../features/creditFormSlice";
import { toast } from "react-toastify";
import EditCreditFormModal from "./EditCreditFormModal/EditCreditFormModal";

export default function AccountRequestsPage() {
  const { t } = useTranslation();
  const { user_id } = useParams();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [originalAccountComplain, setOriginalAccountComplain] = useState([]);
  const [accountRequests, setAccountRequests] = useState([]);
  const [accountComplain, setAccountComplain] = useState([]);
  const [originalAccountRequests, setOriginalAccountRequests] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [editModal, setEditModal] = useState(false);
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
  const [newImages, setNewImages] = useState([]);
  const [newDocs, setNewDocs] = useState([]);

  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const dispatch = useDispatch();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmData, setConfirmData] = useState({
    type: "", // "newImage", "newDoc", "serverImage", "serverDoc"
    localIndex: null,
    serverId: null,
  });
  const [moreInfoInputs, setMoreInfoInputs] = useState([
    {
      id: 1,
      label: "",
      value: "",
    },
  ]);
  const [accountSearch, setAccountSearch] = useState("");
  const [complainSearch, setComplainSearch] = useState("");

  function handleDeleteDetails(id) {
    console.log(id);
    dispatch(handleDeleteDetail({ detail_id: id }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          setRowData((prevRowData) => ({
            ...prevRowData, // Keep other properties
            details: prevRowData.details.filter((item) => item?.id !== id), // Remove the deleted item
          }));
        }
      });
  }

  function handleChangeInput(key, value, id) {
    const updatedIputs = moreInfoInputs.map((item) =>
      item?.id == id ? { ...item, [key]: value } : item
    );
    setMoreInfoInputs(updatedIputs);
  }

  function openRemoveConfirmation(type, localIndex = null, serverId = null) {
    setConfirmData({ type, localIndex, serverId });
    setConfirmModalVisible(true);
  }

  function confirmRemove() {
    const { type, localIndex, serverId } = confirmData;
    if (type === "newImage" && localIndex !== null) {
      handleRemoveChosenImage(localIndex);
    } else if (type === "newDoc" && localIndex !== null) {
      handleRemoveChosenDoc(localIndex);
    } else if (type === "serverImage" && serverId) {
      handleRemoveImageFromServer(serverId);
    } else if (type === "serverDoc" && serverId) {
      handleRemoveDocFromServer(serverId);
    }
    setConfirmModalVisible(false);
  }

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    form_id: "",
    form_status: "pending",
    credit_limit: 0,
    monthly_limit: 0,
  });

  function openStatusModal(record) {
    setStatusFormData({
      form_id: record.form_id,
      form_status: record.form_status || "pending",
      credit_limit: record.credit_limit || 0,
      monthly_limit: record.monthly_limit || 0,
    });
    setStatusModalVisible(true);
  }

  async function handleSaveStatus() {
    try {
      const token = localStorage.getItem(conifgs.localStorageTokenName);
      const response = await fetch(
        `${conifgs.LIVE_BASE_URL}credit-forms/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            form_id: statusFormData.form_id,
            form_status: statusFormData.form_status,
            credit_limit: statusFormData.credit_limit,
            monthly_limit: statusFormData.monthly_limit,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setStatusModalVisible(false);
        // Re-fetch data
        if (user_id) {
          fetch(`${conifgs.LIVE_BASE_URL}credit-forms?user_id=${user_id}`)
            .then((res) => res.json())
            .then((resData) => {
              if (resData.success) {
                const accountData = Array.isArray(resData.data)
                  ? resData.data
                  : [resData.data];
                setAccountRequests(accountData);
                setOriginalAccountRequests(accountData);
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
                  .catch((error) =>
                    console.error("Error fetching credit forms:", error)
                  );
              }
            })
            .catch((error) =>
              console.error("Error fetching credit forms:", error)
            );
        }
      } else {
        console.error("Update status failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  useEffect(() => {
    if (user_id) {
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
  }, [user_id]);

  const columns = [
    {
      dataIndex: "form_id",
      key: "form_id",
      title: "#",
    },
    {
      dataIndex: "full_name",
      key: "full_name",
      title: t("fullName"),
    },
    {
      dataIndex: "national_id",
      key: "national_id",
      title: t("nationalId"),
    },
    {
      dataIndex: "form_status",
      key: "form_status",
      title: t("status"),
      render: (text, record) => (
        <p
          className={`${
            record?.form_status === "pending"
              ? "text-gray-500"
              : record?.form_status === "accepted"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {record?.form_status}
        </p>
      ),
    },
    {
      dataIndex: "actions",
      key: "actions",
      title: t("actions"),
      render: (text, record) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setEditModal(true);
              setRowData(record);
              // Clear any new uploads from previous usage
              setNewImages([]);
              setNewDocs([]);
            }}
            className="bg-green-700 text-white rounded-md flex justify-between p-3"
          >
            {t("editText")}
          </button>
          <button
            onClick={() => {
              setViewModal(true);
              setRowData(record);
              // Clear any new uploads from previous usage
              setNewImages([]);
              setNewDocs([]);
            }}
            className="bg-[#0d6efd] text-white rounded-md flex justify-between p-3"
          >
            {t("viewText")}
          </button>
          <button
            onClick={() => {
              setDeleteModal(true);
              setRowData(record);
            }}
            className="bg-red-500 text-white rounded-md flex justify-between p-3"
          >
            {t("deleteText")}
          </button>

          {/* NEW BUTTON TO OPEN CHANGE-STATUS MODAL */}
          <button
            onClick={() => openStatusModal(record)}
            className="bg-yellow-500 text-white rounded-md p-3"
          >
            {t("changeStatus") || "Change Status"}
          </button>
        </div>
      ),
    },
  ];

  const ComplaintsColumns = [
    {
      dataIndex: "form_id",
      key: "form_id",
      title: "#",
    },
    {
      dataIndex: "full_name",
      key: "full_name",
      title: t("fullName"),
    },
    {
      dataIndex: "national_id",
      key: "national_id",
      title: t("nationalId"),
    },
    {
      dataIndex: "form_status",
      key: "form_status",
      title: t("status"),
      render: (text, record) => (
        <p
          className={`${
            record?.form_status === "pending"
              ? "text-gray-500"
              : record?.form_status === "accepted"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {record?.form_status}
        </p>
      ),
    },
    {
      dataIndex: "actions",
      key: "actions",
      title: t("actions"),
      render: (text, record) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setViewModal(true);
              setRowData(record);
              // Clear any new uploads from previous usage
              setNewImages([]);
              setNewDocs([]);
            }}
            className="bg-[#0d6efd] text-white rounded-md flex justify-between p-3"
          >
            {t("viewText")}
          </button>
          <button
            onClick={() => {
              setDeleteModal(true);
              setRowData(record);
            }}
            className="bg-red-500 text-white rounded-md flex justify-between p-3"
          >
            {t("deleteText")}
          </button>
        </div>
      ),
    },
  ];

  const commentsColumns = [
    {
      dataIndex: "form_id",
      key: "form_id",
      title: "#",
    },
    {
      dataIndex: "admin_name",
      key: "admin_name",
      title: "اسم المسؤول",
    },
    {
      dataIndex: "comment",
      key: "comment",
      title: " التعليق ",
    },
  ];

  async function handleSave() {
    try {
      // Prepare form data
      const formData = new FormData();
      // Append existing text fields from rowData
      formData.append("form_id", rowData.form_id);
      formData.append("full_name", rowData.full_name || "");
      formData.append("national_id", rowData.national_id || "");
      formData.append("email", rowData.email || "");
      formData.append("address_in_card", rowData.address_in_card || "");
      formData.append("current_address", rowData.current_address || "");
      formData.append("job", rowData.job || "");
      formData.append("salary", rowData.salary || "");
      formData.append("insurance_status", rowData.insurance_status || "");
      // If you need birthday in "YYYY-MM-DD" format:
      formData.append("birthday", rowData.birthday || "");
      console.log(newImages);
      // Append new images (one at a time, but we may have multiple from repeated selections)
      for (let i = 0; i < newImages.length; i++) {
        formData.append("images", newImages[i]);
      }

      // Append new docs (one at a time, but we may have multiple from repeated selections)
      for (let i = 0; i < newDocs.length; i++) {
        formData.append("docs", newDocs[i]);
      }

      // Send PUT request with Bearer token
      const token = localStorage.getItem(conifgs.localStorageTokenName);
      const response = await fetch(
        `${conifgs.LIVE_BASE_URL}credit-forms/data/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Use your stored token
          },
          body: formData, // Do NOT set Content-Type manually
        }
      );

      const data = await response.json();
      if (data.success) {
        setViewModal(false);
        // Refresh the data in the table
        dispatch(handleGetCreditForm({ user_id }));
        // if (user_id) {
        //   fetch(`${conifgs.LIVE_BASE_URL}credit-forms?user_id=${user_id}`)
        //     .then((res) => res.json())
        //     .then((data) => {
        //       if (data.success) {
        //         setAccountRequests(
        //           Array.isArray(data.data) ? data.data : [data.data]
        //         );
        //       }
        //     })
        //     .catch((error) =>
        //       console.error("Error fetching credit forms:", error)
        //     );
        // }
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating credit form:", error);
    }
  }

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

  // Remove a chosen image from the newImages array
  function handleRemoveChosenImage(index) {
    setNewImages((prevImages) => {
      const updated = [...prevImages];
      updated.splice(index, 1);
      return updated;
    });
  }

  // Remove a chosen doc from the newDocs array
  function handleRemoveChosenDoc(index) {
    setNewDocs((prevDocs) => {
      const updated = [...prevDocs];
      updated.splice(index, 1);
      return updated;
    });
  }

  // Remove image from server
  async function handleRemoveImageFromServer(imageId) {
    try {
      const token = localStorage.getItem(conifgs.localStorageTokenName);
      const response = await fetch(
        `${conifgs.LIVE_BASE_URL}credit-forms/image/delete?imageId=${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Re-fetch
        if (user_id) {
          fetch(`${conifgs.LIVE_BASE_URL}credit-forms?user_id=${user_id}`)
            .then((res) => res.json())
            .then((resData) => {
              if (resData.success) {
                setAccountRequests(
                  Array.isArray(resData.data) ? resData.data : [resData.data]
                );
              }
            })
            .catch((error) =>
              console.error("Error fetching credit forms:", error)
            );
        }
      } else {
        console.error("Failed to remove image:", data.message);
      }
    } catch (error) {
      console.error("Error removing image:", error);
    }
  }

  async function handleRemoveDocFromServer(docId) {
    try {
      const token = localStorage.getItem(conifgs.localStorageTokenName);
      const response = await fetch(
        `${conifgs.LIVE_BASE_URL}credit-forms/doc/delete?docId=${docId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        // Re-fetch
        if (user_id) {
          fetch(`${conifgs.LIVE_BASE_URL}credit-forms?user_id=${user_id}`)
            .then((res) => res.json())
            .then((resData) => {
              if (resData.success) {
                setAccountRequests(
                  Array.isArray(resData.data) ? resData.data : [resData.data]
                );
              }
            })
            .catch((error) =>
              console.error("Error fetching credit forms:", error)
            );
        }
      } else {
        console.error("Failed to remove doc:", data.message);
      }
    } catch (error) {
      console.error("Error removing doc:", error);
    }
  }

  useEffect(() => {
    if (!accountSearch) {
      setOriginalAccountRequests(
        accountRequests?.filter((item) => item?.type === "request")
      );
      return;
    }

    const filtered = accountRequests
      ?.filter((item) => item?.type === "request")
      ?.filter(
        (item) =>
          item?.full_name
            ?.toLowerCase()
            ?.includes(accountSearch?.toLowerCase()) ||
          item?.national_id?.includes(accountSearch)
      );

    setOriginalAccountRequests(filtered);
  }, [accountSearch, accountRequests, accountRequests]);

  console.log("شكوي :", originalAccountComplain);

  useEffect(() => {
    if (!complainSearch) {
      setOriginalAccountComplain(
        accountRequests?.filter((item) => item?.type === "compliment")
      );
      return;
    }

    const filtered = accountRequests
      ?.filter((item) => item?.type === "compliment")
      ?.filter(
        (item) =>
          item?.full_name
            ?.toLowerCase()
            ?.includes(complainSearch?.toLowerCase()) ||
          item?.national_id?.includes(complainSearch)
      );

    setOriginalAccountComplain(filtered);
  }, [complainSearch, accountRequests, accountRequests]); // FIX: added accountRequests here

  useEffect(() => {
    console.log(rowData);
  }, [rowData]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("accountRequests")}
        </h3>

        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-[#0d6efd] text-white p-2 rounded-md flex justify-center items-center"
        >
          {t("addText")}
        </button>
      </div>

      <AddCreditFormModal
        user_id={user_id}
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />

      <EditCreditFormModal
        rowData={rowData}
        setRowData={setRowData}
        user_id={user_id}
        setOpenAddModal={setEditModal}
        openAddModal={editModal}
      />

      <Modal
        open={viewModal}
        onCancel={() => setViewModal(false)}
        onClose={() => setViewModal(false)}
        title={t("viewAccountRequest")}
        footer={null}
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("fullName")}</label>
              <input
                type="text"
                value={rowData?.full_name || ""}
                onChange={(e) =>
                  setRowData({ ...rowData, full_name: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("phone")}</label>
              <input
                type="tel"
                value={rowData?.phone || ""}
                onChange={(e) =>
                  setRowData({ ...rowData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("nationalId")}</label>
              <input
                type="text"
                value={rowData?.national_id || ""}
                onChange={(e) =>
                  setRowData({ ...rowData, national_id: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("statusText")}</label>
              <input
                className="disabled:bg-gray-200"
                type="text"
                value={rowData?.form_status || ""}
                disabled
              />
            </div>
          </div>

          <div className="input-group">
            <label>{t("email")}</label>
            <input
              type="email"
              value={rowData?.email || ""}
              onChange={(e) =>
                setRowData({ ...rowData, email: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("job")}</label>
            <input
              type="text"
              value={rowData?.job || ""}
              onChange={(e) => setRowData({ ...rowData, job: e.target.value })}
            />
          </div>

          {Array.isArray(rowData?.details) && (
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">{t("detailsText")}</h3>
              {rowData.details.map((item) => (
                <div key={item?.id} className="flex gap-2 items-center">
                  <div className="input-group">
                    <label>{t("labelText")}</label>
                    <input value={item?.label} disabled />
                  </div>
                  <div className="input-group">
                    <label>{t("valueText")}</label>
                    <input value={item?.value} disabled />
                  </div>
                  <FaTrash
                    className="text-red-500 text-[23px] cursor-pointer"
                    onClick={() => handleDeleteDetails(item?.id)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label>{t("addressInCard")}</label>
              <input
                type="text"
                value={rowData?.address_in_card || ""}
                onChange={(e) =>
                  setRowData({ ...rowData, address_in_card: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>{t("currentAddress")}</label>
              <input
                type="text"
                value={rowData?.current_address || ""}
                onChange={(e) =>
                  setRowData({ ...rowData, current_address: e.target.value })
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
                const previewUrl = file && URL.createObjectURL(file);
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

          {rowData?.images && rowData.images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {rowData.images.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    className="w-[100px] h-[100px] object-contain rounded-md"
                    alt="credit form"
                  />
                  <FaTrash
                    className="text-red-500 absolute top-0 right-0 cursor-pointer"
                    onClick={() =>
                      openRemoveConfirmation("serverImage", null, img.id)
                    }
                  />
                </div>
              ))}
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
                  ? file && URL.createObjectURL(file)
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

          {/* Display existing docs */}
          {rowData?.docs && rowData.docs.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {rowData.docs.map((doc) => (
                <div key={doc.id} className="relative">
                  <img
                    src={doc.url}
                    className="w-[100px] h-[100px] object-contain rounded-md"
                    alt="document"
                  />
                  <FaTrash
                    className="text-red-500 absolute top-0 right-0 cursor-pointer"
                    onClick={() =>
                      openRemoveConfirmation("serverDoc", null, doc.id)
                    }
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-center mt-3">
            <button
              className="bg-green-800 hover:bg-green-900 text-white p-2 rounded-sm"
              onClick={handleSave}
            >
              {t("saveBtn")}
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-sm"
              onClick={() => setViewModal(false)}
            >
              {t("cancelText")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal (for entire row) */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
        footer={null}
      >
        <h2 className="font-medium text-[20px]">{t("deleteRequestText")}</h2>
        <div className="flex gap-3 items-center mt-3">
          <button className="bg-red-700 text-white p-2 rounded-md">
            {t("saveBtn")}
          </button>
          <button
            className="text-blue-600 p-2 border border-(--main-color) rounded-md"
            onClick={() => setDeleteModal(false)}
          >
            {t("cancelText")}
          </button>
        </div>
      </Modal>

      {/* Confirmation Modal (for removing images/docs) */}
      <Modal
        open={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        onCancel={() => setConfirmModalVisible(false)}
        footer={null}
      >
        <h2 className="font-medium text-[20px] mb-4">
          {t("confirmRemoveText") || "Confirm Removal?"}
        </h2>
        <div className="flex gap-3 items-center">
          <button
            className="bg-red-700 text-white p-2 rounded-md"
            onClick={confirmRemove}
          >
            {t("yesText") || "Yes"}
          </button>
          <button
            className="text-blue-600 p-2 border border-(--main-color) rounded-md"
            onClick={() => setConfirmModalVisible(false)}
          >
            {t("noText") || "No"}
          </button>
        </div>
      </Modal>

      {/* NEW MODAL FOR CHANGING STATUS, CREDIT LIMIT, MONTHLY LIMIT */}
      <Modal
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <h2 className="font-medium text-[20px]">
          {t("changeStatus") || "Change Status"}
        </h2>
        <div className="flex flex-col gap-3 mt-3">
          <div className="input-group">
            <label>{t("statusText")}</label>
            <select
              value={statusFormData.form_status}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  form_status: e.target.value,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="input-group">
            <label>{t("creditLimit") || "Credit Limit"}</label>
            <input
              type="number"
              value={statusFormData.credit_limit}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  credit_limit: e.target.value,
                })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("monthlyLimit") || "Monthly Limit"}</label>
            <input
              type="number"
              value={statusFormData.monthly_limit}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  monthly_limit: e.target.value,
                })
              }
            />
          </div>

          <div className="flex gap-3 items-center mt-3">
            <button
              className="bg-green-800 text-white p-2 rounded-sm"
              onClick={handleSaveStatus}
            >
              {t("saveBtn")}
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-sm"
              onClick={() => setStatusModalVisible(false)}
            >
              {t("cancelText")}
            </button>
          </div>
        </div>
      </Modal>

      <input
        type="text"
        onChange={(e) => setAccountSearch(e.target.value)}
        value={accountSearch}
        placeholder={t("searchText")}
        className="w-full rounded-md p-3 border border-gray-300 outline-hidden my-4"
      />
      <Table
        columns={columns}
        dataSource={originalAccountRequests}
        rowKey="form_id"
      />

      <div className="mt-5">
        <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("complaintsText")}
        </h3>
        <input
          value={complainSearch}
          onChange={(e) => setComplainSearch(e.target.value)}
          type="text"
          placeholder={t("searchText")}
          className="w-full rounded-md p-3 border border-gray-300 outline-hidden my-4"
        />
        <Table
          columns={ComplaintsColumns}
          dataSource={originalAccountComplain}
          rowKey="form_id"
        />
      </div>
      <div className="mt-5">
        <div className="flex justify-between items-center p-4">
          <h3 className="font-semibold text-[25px] text-[#0d6efd]">
            ملاحظات الموظفين
          </h3>
          <button
            onClick={() => setAddModal(true)}
            className="bg-[#0d6efd] text-white p-[5px_15px] rounded-md flex justify-center items-center cursor-pointer"
          >
            إضافة ملاحظة
          </button>
        </div>

        <Table columns={commentsColumns} dataSource={[]} rowKey="form_id" />
      </div>

      <Modal
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        title="إضافة ملاحظة"
      >
        <div className="flex flex-col gap-3">
          <div className="input-group">
            <label>التعليق</label>
            <textarea rows={4} />
          </div>

          <div className="flex gap-3 items-center mt-3">
            <button className="bg-[#0d6efd] text-white p-[5px_15px] rounded-md flex justify-center items-center cursor-pointer">
              حفظ
            </button>
            <button
              className="bg-red-500 text-white p-[5px_15px] rounded-md flex justify-center items-center cursor-pointer"
              onClick={() => setAddModal(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
