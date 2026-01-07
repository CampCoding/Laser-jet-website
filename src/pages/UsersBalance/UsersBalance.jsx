import { Table } from "antd";
import { useTranslation } from "react-i18next";

const data= [
    {
        id:20202678        ,
        full_name:"موناز لبيب جرجس عبدالمسيح",
        phone:"01204708330",
        available_balance:"-50621.93"
    },
    {
        id:54531502,
        full_name:"محمد رزق محمد غانم",
        phone:"01150105635",
        available_balance:"-50550.26"
    },
]

export default function UsersBalance() {
  const {t} = useTranslation();
    const columns = [
        {
            dataIndex:"id",
            key:"id",
            title:"#"
        },
        {
            dataIndex: "available_balance",
            key: "available_balance",
            title: t("availableBalanceText"),
            render: (balance) => {
              return (
                <p className={+balance < 0 ? "text-red-700 font-medium" : +balance > 0 ? "text-green-700 font-medium" : "text-gray-600 font-medium"}>
                  {balance}
                </p>
              );
            },
          }
,          
        {
            dataIndex:"phone",
            key:"phone",
            title:t("phone")
        },
        {
            dataIndex:"full_name",
            key:"full_name",
            title:t("fullName")
        },
    ]
  return (
    <div>
                <h3 className="font-semibold text-[25px] text-[#0d6efd]">{t("userBalanceText")}</h3>

        <input className="border border-gray-300 outlinn-hidden w-full rounded-md outline-hidden p-3 my-3" placeholder={t("searchText")}/>
        <Table columns={columns} dataSource={data}/>
    </div>
  )
}
