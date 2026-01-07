import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux';
import { handleCreateUserPermission, handleEditRole, handleFetchRoles } from '../../../features/permissionsSlice';
import { toast } from 'react-toastify';

export default function EditPermissionsModal({open , setOpen , rowData , setRowData}) {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {edit_role_loading} = useSelector(state => state?.permissions); 
     
    useEffect(() => {
        console.log(rowData)
    } , [rowData])

    function handleCreate(e) {
      e.preventDefault();
      const data_send ={
        ...rowData,
      }
  
      dispatch(handleEditRole({body:data_send}))
      .unwrap()
      .then(res => {
        console.log(res)
        if(res?.success) {
          toast.success(res?.message);
          dispatch(handleFetchRoles())
          setOpen(false)
        }else {
          toast.error(res || res?.message)
        }
      }).catch(e => console.log(e))
    }
  return (
    <Modal  footer={null} open={open} title={t("addPermissions")} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
         <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="input-group">
            <label>{t("nameText")}</label>
            <input
              type="text"
              value={rowData.name}
              onChange={(e) =>
                setRowData({ ...rowData, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("desctiptionText")}</label>
            <textarea
              value={rowData?.description}
              onChange={(e) =>
                setRowData({ ...rowData, description: e.target.value })
              }
            ></textarea>
          </div>

          <button className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3]  p-2 rounded-md text-white flex justify-center items-center">
            { edit_role_loading ? t("loadingText") :t("saveBtn")}
          </button>
        </form>
    </Modal>
  )
}
