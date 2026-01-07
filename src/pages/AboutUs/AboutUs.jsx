import React, { useEffect, useRef, useState } from "react";
import { languages } from "../../utils/languages";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { getSettings, updateSettings } from "../../features/settingsSlice";
import { toast } from "react-toastify";

export default function AboutUs() {
  const [tabs, setTabs] = useState(1);
  const aboutRef = useRef();
  const dispatch = useDispatch();
  const { data, loading, editLoading } = useSelector(
    (state) => state?.settings
  );
  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [content, setContent] = useState({
    ar: "",
    en: "",
  });
  const [image, setImage] = useState({
    file:null,
    url:""
  });

  useEffect(() => {
    setSelectedLanguage(languages.find((item) => item?.id == tabs)?.value);
  }, [tabs]);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch, tabs]);

  useEffect(() => {
    if (data?.data?.aboutus) {
      setContent({
        ...content,
        [selectedLanguage]: data?.data?.aboutus[selectedLanguage] || "",
      });
    }

    if (data?.data?.aboutusimage) {
      setImage({...image , url :data?.data?.aboutusimage || null});
    }
  }, [data]);

  useEffect(() => {
    console.log(image);
  }, [image]);

  function handleEdit() {
    const formData = new FormData();
    formData.append("aboutusimage", image);
    formData.append(`aboutus[${selectedLanguage}]`,content[selectedLanguage])
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
    <div className="border-[0.5vh] border-[#ddd] p-[3vh]">
      <div className="flex flex-col">
        <h4 className="text-[5vh] font-bold text-[#3f4254]">
          محتوى قسم من نحن
        </h4>
        <p className="font-bold">
          أدخل بيانات حول شركتك وما تقدمه لعملائك وزوار موقعك
        </p>
      </div>

      <div>
        <div className="my-[3vh] items-center border border-[#ddd] p-[3vh]">
          <div className="flex items-center gap-[6vh] w-[75%] mx-auto">
          <img src={image?.url} className="w-[40vh] h-[40vh] ms-[6vh] object-cover" />
          <label htmlFor="image" className="mx-[7vh] font-medium text-blue-400 hover:text-blue-600">
            اضغط للرفع
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage({...image , file:e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])})}
            className="hidden"
          />
          </div>
        </div>

        <div className="flex flex-col gap-[1vh]">
          <div className="flex justify-between items-center">
            <p>
              أدخل محتوى قسم (من نحن) الخاصة بموقعك باللغة{" "}
              {languages.find((item) => item?.id == tabs)?.label}
            </p>
            <div className="tabs-container  flex gap-[2vh] items-center my-[3vh]">
              {languages.map((item, key) => (
                <div
                  onClick={() => setTabs(item?.id)}
                  className={`cursor-pointer px-[3vh] py-[0.8vh] flex justify-center items-center  ${
                    tabs == item?.id
                      ? "bg-[#0d6dfd32] text-[#0d6efd] border-b-[0.5vh] border-b-[#0d6efd]"
                      : "bg-gray-300 text-black"
                  }`}
                  key={item?.id}
                >
                  {item?.label}
                </div>
              ))}
            </div>
          </div>

          <JoditEditor
            tabIndex={1}
            ref={aboutRef}
            value={content[selectedLanguage]}
            onChange={(e) => setContent({ ...content, [selectedLanguage]: e })}
          />
        </div>

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
