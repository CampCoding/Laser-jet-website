import { Modal } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux';
import { handleCreateUserPermission, handleFetchRoles } from '../../../features/permissionsSlice';
import { toast } from 'react-toastify';

export default function AddPermissionsModal({open , setOpen}) {
    const {t} = useTranslation();
    const [employeeData , setEmployeeData] = useState({
        name:"",
        description :""
    })
    const dispatch = useDispatch();
    const {create_role_loading} = useSelector(state => state?.permissions); 

    function handleCreate(e) {
      e.preventDefault();
      const data_send ={
        ...employeeData,
      }
  
      dispatch(handleCreateUserPermission({body:data_send}))
      .unwrap()
      .then(res => {
        console.log(res)
        if(res?.success) {
          toast.success(res?.message);
          setEmployeeData({
            name:"",
            description:"",
          })
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
              value={employeeData.name}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>{t("description")}</label>
            <textarea
              value={employeeData?.description}
              onChange={(e) =>
                setEmployeeData({ ...employeeData, description: e.target.value })
              }
            ></textarea>
          </div>

          <button className="mt-3 bg-[#0d6efd] hover:bg-[#104ba3]  p-2 rounded-md text-white flex justify-center items-center">
            { create_role_loading ? t("loadingText") :t("saveBtn")}
          </button>
        </form>
    </Modal>
  )
}
