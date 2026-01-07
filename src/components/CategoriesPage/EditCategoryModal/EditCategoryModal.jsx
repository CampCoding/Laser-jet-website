import { Dropdown, Menu, Modal, Spin, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEdit, FaEllipsisV, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  editCategories,
  fetchCategories,
  handleDeleteInstallment,
  handleDeleteInstallmentCategory,
  handleEditInstallment,
} from "../../../features/categoriesSlice";
import { toast } from "react-toastify";
import { handleFetchInstallment } from "../../../features/installemntsSlice";

export default function EditCategoryModal({
  editModal,
  setEditModal,
  rowData,
  setRowData,
  imgs,
  setImgs,
  selectedInputs,
  setSelectedInputs,
  setOpenInstallmentsModal,
  installmentData,
  setInstallmentData
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { editLoading , deleteInstallmentLoading  } = useSelector((state) => state.categories);
  const { data: installments, editInstallment , loading: installmentLoading } = useSelector(
    (state) => state?.installments
  );
    const [editInstallModal, setEditInstallModal] = useState(false);
    const [deleteModal , setDeleteModal]= useState(false)

  useEffect(() => {
    if (rowData) {
      setSelectedInputs(rowData.installments || []);
    }
  }, [rowData, setSelectedInputs]);

  function handleInstallmentChange(id) {
    if (!rowData.installments.some((item) => item.installment_id === id)) {
      const installment = installments?.data?.installmentTitles?.find(
        (item) => item?.installment_id == id
      );
      if (installment) {
        setRowData((prev) => ({
          ...prev,
          installments: [
            ...prev.installments,
            {
              installment_id: id,
              installment_gain: "",
              installment_title: installment?.installment_title,
            },
          ],
        }));
      }
    }
  }

  
  function handleInputChange(e, key) {
    const value = e.target.value;
    setRowData((prev) => ({
      ...prev,
      installments: prev.installments.map((item) =>
        item?.installment_id == key
          ? { ...item, installment_gain: value }
          : item
      ),
    }));
  }

  function handleDelete(id) {
    setRowData((prev) => ({
      ...prev,
      installments: prev.installments?.filter(
        (item) => item?.installment_id !== id
      ),
    }));
  }

  //  function handleEdit() {
  //     const data_send = {
  //       installment_number: installmentData?.installment_number,
  //       installment_id: installmentData?.installment_id,
  //       installment_title: installmentData?.installment_title,
  //     };
  
  //     dispatch(handleEditInstallment(data_send))
  //       .unwrap()
  //       .then((res) => {
  //         console.log(res);
  //         if (res?.success) {
  //           toast.success(res?.message);
  //           setEditInstallModal(false);
  //           dispatch(handleFetchInstallment());
  //         } else {
  //           toast.error(res);
  //         }
  //       })
  //       .catch((e) => console.log(e));
  //   }

  function handleEdit() {
    const data_send = {
      installment_number: installmentData?.installment_number,
      installment_id: installmentData?.installment_id,
      installment_title: installmentData?.installment_title,

    };
  
    dispatch(handleEditInstallment(data_send))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message);
          
          // تحديث القسط في القائمة بعد التعديل مباشرةً
          setRowData((prev) => ({
            ...prev,
            installments: prev.installments.map((item) =>
              item.installment_id === installmentData?.installment_id
                ? { ...item, installment_title: installmentData?.installment_title, installment_number: installmentData?.installment_number }
                : item
            ),
          }));
  
          // جلب الأقساط المحدثة بعد التعديل
          dispatch(handleFetchInstallment());
  
          setEditInstallModal(false);
        } else {
          toast.error(res?.message || "حدث خطأ أثناء تعديل القسط");
        }
      })
      .catch((e) => console.log(e));
  }
  
  function handleDeleteInstall() {
      const data_send = {
        installment_id: installmentData?.installment_id,
      };
  
      dispatch(handleDeleteInstallment(data_send))
        .unwrap()
        .then((res) => {
          console.log(res)
          if (res?.success) {
            toast.success(res?.message);
            setDeleteModal(false);
            dispatch(handleFetchInstallment());
          } else {
            toast.error(res);
          }
        })
        .catch((e) => console.log(e));
    }
  

  function handleSubmit(e) {
    e.preventDefault();
    console.log(rowData?.gain)
    const formData = new FormData();
    formData.append("category_id", rowData.category_id);
    formData.append("title", rowData?.title);
    formData.append("description", rowData?.description);
    formData.append("is_active", rowData?.is_active);
    formData.append("gain",rowData?.gain)
    if (imgs?.file) formData.append("image", imgs?.file);

    rowData?.installments?.forEach((item, key) => {
      formData.append(`data[${key}][installment_id]`, item?.installment_id);
      formData.append(`data[${key}][value]`, item?.installment_gain);
    });

    dispatch(editCategories(formData))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(fetchCategories({ page: 1, per_page: 2000 }));
          setEditModal(false);
          setRowData({});
          setImgs({ file: null, url: "" });
          setInstallmentData({installment_number:"",installment_title:""})
        } else {
          toast.error(res?.payload || "حدثت مشكلة في تعديل الفئة");
        }
      })
      .catch((e) => console.log(e));
  }


  return (

    <>
     <Modal
                  open={editInstallModal}
                  onOk={handleEdit}
                  onCancel={() => setEditInstallModal(false)}
                  onClose={() => setEditInstallModal(false)}
                  okText={editInstallment ? t("loadingText") : t("editText")}
                  cancelText={t("cancelText")}
                >
                  <div className="input-group">
                    <label>{t("installmentTitle")}</label>
                    <input
                      type="text"
                      value={installmentData?.installment_title}
                      onChange={(e) =>
                        setInstallmentData({
                          ...installmentData,
                          installment_title: e.target.value,
                        })
                      }
                    />
                  </div>
    
                  <div className="input-group">
                    <label>{t("installment_number")}</label>
                    <input
                      type="text"
                      value={installmentData?.installment_number}
                      onChange={(e) =>
                        setInstallmentData({
                          ...installmentData,
                          installment_number: +e.target.value,
                        })
                      }
                    />
                  </div>
                </Modal>

                <Modal
                              open={deleteModal}
                              onOk={handleDeleteInstall}
                              onCancel={() => setDeleteModal(false)}
                              onClose={() => setDeleteModal(false)}
                              okText={
                                deleteInstallmentLoading ? t("loadingText") : t("deleteText")
                              }
                              cancelText={t("cancelText")}
                            >
                              <h2>{t("deleteInstallmentText")}</h2>
                            </Modal>
    
    <Modal open={editModal} onCancel={() => setEditModal(false)} footer={null} title={t("editCategory")}>
      <div className="flex flex-col gap-3">
        <div className="input-group">
          <label>{t("nameText")}</label>
          <input
            value={rowData?.title}
            onChange={(e) => setRowData({ ...rowData, title: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>{t("profitPercentage")}</label>
          <input
            type="number"
            onChange={(e) => setRowData({ ...rowData, gain: +e.target.value })}
            value={rowData?.gain}
          />
        </div>

        <div className="input-group">
          <label>{t("description")}</label>
          <textarea
            onChange={(e) => setRowData({ ...rowData, description: e.target.value })}
            value={rowData?.description}
          ></textarea>
        </div>
         
        <div className="input-group">
              <div className="flex justify-between items-center">
                <label>{t("PercentageIncreaseInPremium")}</label>
                <button
                  onClick={() => setOpenInstallmentsModal(true)}
                  className="w-fit bg-blue-500 p-2 text-white cursor-pointer rounded-md"
                >
                  {t("createInstallment")}
                </button>
              </div>
            </div>
        {/* قائمة اختيار الأقساط */}
        <Dropdown
          overlay={
            <Menu>
                              {installmentLoading ? (
                                <Spin size="md" />
                              ) : (
                                installments?.data?.installmentTitles?.map((item) => (
                                  <Menu.Item key={item.installment_id}>
                                    <div
                                      
                                      className="flex justify-between items-center w-full"
                                    >
                                      <span onClick={() =>
                                        handleInstallmentChange(item.installment_id)
                                      }>{item.installment_title}</span>
                                      <div className="flex gap-2">
                                        <FaEdit
                                          className="text-blue-500 cursor-pointer"
                                          onClick={() => {
                                            setEditInstallModal(true);
                                            setInstallmentData(item);
                                          }}
                                        />
                                        <FaTrash
                                          className="text-red-500 cursor-pointer"
                                          onClick={() => {
                                            setDeleteModal(true);
                                            setInstallmentData(item);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </Menu.Item>
                                ))
                              )}
                            </Menu>
          }
          trigger={["click"]}
        >
          <button className="p-2 bg-gray-200 rounded-md w-full flex justify-between">
            {t("chooseInstallmentText")}
            <FaEllipsisV />
          </button>
        </Dropdown>

        {selectedInputs?.map((item) => (
          <div key={item?.installment_id} className="flex gap-3 items-center">
            <div className="input-group flex justify-between w-full">
              <label>{t("ValueForText")} {item?.installment_title}:</label>
              <input
                type="text"
                value={item?.installment_gain}
                onChange={(e) => handleInputChange(e, item?.installment_id)}
                className="p-2 border rounded-md"
              />
            </div>
            <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(item?.installment_id)} />
          </div>
        ))}

        <div className="input-group">
          <label>{t("imagesText")}</label>
          <input
            onChange={(e) => setImgs({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })}
            type="file"
            accept="image/*"
          />
        </div>

        {imgs?.url && (
          <div className="flex items-center gap-3">
            <img className="w-20 h-20 rounded-md" src={imgs?.url} />
            <FaTrash className="text-red-700 cursor-pointer" onClick={() => setImgs({ file: null, url: "" })} />
          </div>
        )}

        <button onClick={handleSubmit} className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3] p-2 rounded-md text-white flex justify-center items-center">
          {editLoading ? t("loadingText") : t("saveBtn")}
        </button>
      </div>
    </Modal>

    </>
  );
}
