import { Modal, Table } from "antd";
import { useState } from "react"
import { useTranslation } from "react-i18next";
import { FcFile } from "react-icons/fc";
import { useParams } from "react-router-dom";

const data = [
    {
        id:1,
        name:"paper 1",
        
    }
]

export default function UserDocs() {
    const {t} = useTranslation();
    const [addOpenModal , setAddOpenModal] = useState(false);
    const [docsData , setDocsData] = useState({
        name:"",
        file:null,
    })
    const {userId} = useParams();
    const columns = [
        {
            dataIndex:"id",
            key:"id",
            title:"#"
        },
        {
            dataIndex:"paper_name",
            key:"paper_name",
            title:t("paperNameText")
        },
        {
            dataIndex:"",
            key:"",
            title:t("pdfText"),
            render:(row , text) => <a href={`${row?.pdf}`} target="_blank"><FcFile /></a>
        }
    ]
  return (
    <div><div className="flex gap-3 justify-between my-4">
    <h3 className="font-semibold text-[25px] text-[#0d6efd]">{t("userPageTitle")}</h3>
    <button
      onClick={() => setAddOpenModal(true)}
      className="bg-[#0d6efd] text-white rounded-md p-3 flex justify-center items-center"
    >
      {t("addText")}
    </button>
  </div>

  <Modal open={addOpenModal} onClose={() => setAddOpenModal(false)} onCancel={() => setAddOpenModal(false)} title="Add Docs" footer={null}>
    <form className="flex flex-col gap-3">
        <div className='input-group'>
            <label>{t("paperNameText")}</label>
            <input value={docsData?.name} onChange={(e) => setDocsData({...docsData,name:e.target.value})} type="text"/>
        </div>

        <div className="input-group">
            <label>{t("paperFileText")}</label>
            <input type="file" onChange={(e) => setDocsData({...docsData, file:e.target.files[0]})}/>
        </div>

        <button className="bg-[#0d6efd] mt-3 w-full hover:bg-[#104ba3]  text-white p-2 rounded-sm">{t("saveBtn")}</button>
    </form>
  </Modal>

  <Table />
  
  </div>
  )
}
