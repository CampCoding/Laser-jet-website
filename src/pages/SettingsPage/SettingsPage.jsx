import { lazy, Suspense, useEffect, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getSettings } from "../../features/settingsSlice";
import General from "../../components/SettingsPage/General/General";
import Impressium from "../../components/SettingsPage/Impressium/Impressium";
import PrivacyPolicy from "../../components/SettingsPage/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "../../components/SettingsPage/TermsAndConditions/TermsAndConditions";
// import CallUs from "../CallUs/CallUs";
// import SocialLinks from "../../components/SettingsPage/SocialLinks/SocialLinks";

const TABS = [
  {
    id:1,
    title:"عام"
  },
  {
    id:3,
    title:"الأحكام والشروط"
  },
  {
    id:4,
    title:"سياسة الخصوصية"
  },
    {
        id:5,
        title:"اتصل بنا"
    },
    {
        id:6,
        title:"روابط التواصل الاجتماعي",
    },
]

const CallUs = lazy(() => import("../CallUs/CallUs"));
const SocialLinks = lazy(() => import("../../components/SettingsPage/SocialLinks/SocialLinks"));

export default function SettingsPage() {
    const [tabs, setTabs] = useState(1);
    const dispatch = useDispatch();
    const {data , loading , error} = useSelector(state => state?.settings)
    useEffect(() => {
      dispatch(getSettings()).then(res => console.log(res))
    } ,[dispatch])
  return (
    <div className="border-[0.5vh] border-[#ddd] p-[3vh]">
       <div className="flex flex-col">
       <h4 className="text-[3vh] font-bold text-[#3f4254]">محتوى الصفحات في تذييل الموقع</h4>
       <p className="font-bold">قم بتعديل محتويات صفحات موقع الويب الخاص بك</p>
       </div>

       <div className="tabs-container flex gap-[2vh] items-center my-[3vh]">
          {TABS.map((item,key) => <div onClick={() => setTabs(item?.id)} className={`cursor-pointer p-[3vh] flex justify-center items-center  ${tabs==item?.id ? "bg-[#0d6dfd32] text-[#0d6efd] border-b-[0.5vh] border-b-[#0d6efd]":"bg-gray-300 text-black"}`} key={item?.id}>{item?.title}</div>)}
       </div>

        <Spinner/>
      
      {tabs==1 && <General />}
      {/* {tabs==2 && <Impressium />} */}
      {tabs == 3 && <TermsAndConditions/>}
      {tabs==4 && <PrivacyPolicy/>}
       
       {tabs==5 && 
       <Suspense fallback={<div>Loading....</div>}>
         <CallUs />
       </Suspense>
       }
       {tabs == 6 && 
       <Suspense fallback={<div>Loading....</div>}>
         <SocialLinks/>
        </Suspense>}
    </div>
  );
}
