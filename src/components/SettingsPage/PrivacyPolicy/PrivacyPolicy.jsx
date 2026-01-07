import { Switch } from "antd";
import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import { getSettings, updateSettings } from "../../../features/settingsSlice"; // Import update action
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"; // Ensure toast is used for notifications

export default function PrivacyPolicy() {
  const editor = useRef(null);
  const dispatch = useDispatch();

  const [content, setContent] = useState({
    arabic: "",
    isActive: false, // Correct default state
  });

  const { data, loading, editLoading } = useSelector((state) => state?.settings);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data?.data?.privacy_policy) {
      setContent({
        arabic: data.data.privacy_policy || "",
        isActive: !!data.data.privacy_policy_status, // Ensure it's a boolean
      });
    }
  }, [data]);

  function handleEdit() {
    const formData = new FormData();
    formData.append("privacy_policy[ar]", content.arabic);
    formData.append("privacy_policy_status", content.isActive); // Convert boolean to 1/0

    dispatch(updateSettings(formData))
      .then((res) => {
        if (res?.payload?.success) {
          toast.success(res?.payload?.message);
          dispatch(getSettings()); // Refresh settings after update
        } else {
          toast.error(res?.payload);
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <div>
      <h4 className="font-bold text-[4vh] my-[5vh] text-[#3f4254]">
        محتوى صفحة سياسة الخصوصية
      </h4>

      <div>
        <div className="flex gap-[2vh]">
          <Switch
            checked={content.isActive}
            onChange={(e) => setContent({ ...content, isActive: e })}
          />
          <label>الصفحه نشطه</label>
        </div>

        <JoditEditor
          className="my-[3vh]"
          ref={editor}
          value={content.arabic}
          tabIndex={1}
          onBlur={(newContent) => setContent({ ...content, arabic: newContent })}
        />

        <button
          className="bg-[#0d6efd] my-[3vh] text-white px-[2vh] py-[2vh]"
          onClick={handleEdit}
          disabled={editLoading} 
        >
          {editLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}
