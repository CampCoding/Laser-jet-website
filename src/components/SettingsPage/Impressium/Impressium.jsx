import { Switch } from "antd";
import JoditEditor from 'jodit-react';
import { useEffect, useMemo, useRef, useState } from "react";
import { getSettings } from "../../../features/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaClosedCaptioning } from "react-icons/fa6";



export default function Impressium() {
    const editor = useRef(null);
    const dispatch= useDispatch();
	const [content, setContent] = useState({
        arabic:"",
        isActive:FaClosedCaptioning
    });

    const {data, loading , editLoading} = useSelector(state => state?.settings)
    useEffect(() => {
      dispatch(getSettings())
    } ,[dispatch])
     
    useEffect(() => {
      if(data?.data?.impressium) {
          setContent({ arabic: data.data.impressium || "" , isActive : data.data.impressium_status});
      }
    } , [data])
  
    function handleEdit() {
      const formData = new FormData();
      formData.append("impressium[ar]",content.arabic )
      dispatch(updateSettings(formData)).then(res => {
          if(res?.payload?.success) {
              toast.success(res?.payload?.message);
              dispatch(getSettings())
          }else {
              toast.error(res?.payload);
          }
      }).catch(e => console.log(e))
    }
  return (
    <div>
         <h4 className="font-bold text-[4vh] my-[5vh] text-[#3f4254]">
         محتوى صفحة الإعلان القانوني   
         </h4>

         <div>
            <div className="flex gap-[2vh]">
                 <Switch defaultChecked={content?.isActive} onChange={(e) => setContent({...content , isActive :e})}/>
                 <label>الصفحه نشطه</label>
            </div>

            <div className=""></div>
            <JoditEditor
            className="my-[3vh]"
			ref={editor}
			value={content}
			config={config}
			tabIndex={1} // tabIndex of textarea
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={e => setContent({...content , arabic :e})}
		/>
         </div>
    </div>
  )
}
