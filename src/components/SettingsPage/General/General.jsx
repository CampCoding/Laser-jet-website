import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getSettings, updateSettings } from "../../../features/settingsSlice";
import { toast } from "react-toastify";

export default function General() {
  const dispatch = useDispatch();
  const {data, loading , editLoading} = useSelector(state => state?.settings)
  const [copyRightData , setCopyRightData] = useState({
    arabic:""
  })
  useEffect(() => {
    dispatch(getSettings())
  } ,[dispatch])
   
  useEffect(() => {
    if(data?.data?.copy_rights) {
        setCopyRightData({ arabic: data.data.copy_rights || "" });
    }
  } , [data])

  function handleEdit() {
    const formData = new FormData();
    formData.append("copy_rights[ar]",copyRightData.arabic )
    dispatch(updateSettings(formData)).then(res => {
        if(res?.payload?.success) {
            toast.success(res?.payload?.message);
            dispatch(getSettings())
        }else {
            toast.error(res?.payload);
        }
    }).catch(e => console.log(e))
  }
  return(
    <div>
        <h4 className="font-bold text-[4vh] my-[5vh] text-[#3f4254]">الإعدادات العامة لتذيييل الموقع
        </h4>

        <div>
            <div className="input-group">
                <label>نص حقوق الملكيه باللغه العربيه*</label>
                <input onChange={(e) => setCopyRightData({...copyRightData , arabic:e.target.value})} value={copyRightData.arabic} />
            </div>

            <button className="bg-[#0d6efd] my-[3vh] text-white px-[2vh] py-[2vh]" onClick={handleEdit}>حفظ التغييرات</button>
        </div>
    </div>
  )
}
