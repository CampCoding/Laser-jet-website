import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  handleEditInstallmentCategory,
} from "../../../features/categoriesSlice";
import { toast } from "react-toastify";

export default function EditInstallmentCategoryModal({
  editInstallmentCategoryModal,
  installmentRowData,
  setEditInstallmentCategoryModal,
  rowData,
  setRowData,
  setInstallmentRowData,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { updateCategoryInstallmentLoading , deleteInstallmentLoading, data } = useSelector(
    (state) => state?.categories
  );

  function handleEdit() {
    console.log(rowData, installmentRowData);
    const data_send = {
      category_id: rowData?.category_id,
      data: [
        {
          installment_id: installmentRowData?.installment_id,
          value: installmentRowData.installment_gain,
        },
      ],
    };
    console.log(data_send);

    dispatch(handleEditInstallmentCategory(data_send))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.success) {
          toast.success(res?.message);
          dispatch(fetchCategories({ page: 1, per_page: 2000 }))
            .unwrap()
            .then((res) => {
              if (res?.success) {
                const newRowData = res?.data?.categories?.find((category) =>
                  category?.installments?.find(
                    (item) =>
                      item?.installment_id == installmentRowData?.installment_id
                  )
                );
                setRowData(newRowData);
                setEditInstallmentCategoryModal(false);
              }
            });
        } else {
          toast.error(res);
        }
      })
      .catch((e) => console.log(e));
  }
   
  return (
    <Modal
      open={editInstallmentCategoryModal}
      onCancel={() => setEditInstallmentCategoryModal(false)}
      onClose={() => setEditInstallmentCategoryModal(false)}
      title={t("editInstallmentText")}
      onOk={handleEdit}
      okText={
        updateCategoryInstallmentLoading ? t("loadingText") : t("addText")
      }
      cancelText={t("cancelText")}
    >
      <div className="input-group">
        <label>{t("installmentValue")}</label>
        <input
          value={installmentRowData?.installment_gain}
          onChange={(e) =>
            setInstallmentRowData({
              ...installmentRowData,
              installment_gain: e.target.value,
            })
          }
        />
      </div>
    </Modal>
  );
}


