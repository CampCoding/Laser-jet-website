import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { deleteCategories, fetchCategories, handleDeleteInstallmentCategory } from "../../../features/categoriesSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

export default function DeleteInstallmentCategoryModal({deleteInstallmentModal , setDeleteInstallmentModal , rowData , setRowData,setInstallmentRowData , installmentRowData}) {
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const {deleteCategoryInstallmentLoading} = useSelector(state => state?.categories);
     function handleDelete() {
      const data_send = {
        category_id : rowData?.category_id,
        data: [
            {
                installment_id : installmentRowData?.installment_id
            }
        ]
      }
      dispatch(handleDeleteInstallmentCategory(data_send)).then(res => {
        if(res?.payload?.success) {
            dispatch(fetchCategories({page:1,per_page:700}))
            .unwrap().then(res => {
                if(res.success) {
                    const installments = res?.data?.categories?.find(category => category?.category_id == rowData?.category_id)?.installments;
                    setRowData(prev => ({...prev , installments}))
                    setInstallmentRowData(installments)
                }
            })
            toast.success(res?.payload.message)
          setDeleteInstallmentModal(false);
        }else {
          toast.error(res?.payload)
        }
      }).catch(e => console.log(e))
      .finally(() => {
        setDeleteInstallmentModal(false)
      })
     }

  return (
    <Modal open={deleteInstallmentModal}  onOk={handleDelete} onCancel={() => setDeleteInstallmentModal(false)} onClose={() => setDeleteInstallmentModal(false)} okText={deleteCategoryInstallmentLoading ? t("loadingText") : t("deleteText")} cancelText={t("cancelText")}>
        <h2>{t("deleteInstallmentText")}</h2>
    </Modal>
  )
}
