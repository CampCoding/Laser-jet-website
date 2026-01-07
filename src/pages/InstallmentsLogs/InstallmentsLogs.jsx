import { Table } from "antd";
import { useTranslation } from "react-i18next";

export default function InstallmentsLogs() {
    const {t} = useTranslation();
    const columns = [
        {
            dataIndex:"id",
            key:"id",
            title:"#",
        },
        {
            dataIndex:"date",
            key:"date",
            title:t("dateText"),
        },
        {
            dataIndex:"balance_before",
            key:"balance_before",
            title:t("BalanceBefore")
        },
        {
            dataIndex:"balance_after",
            key:"balance_after",
            title:t("BalanceAfter")
        },
    ]
  return (
    <div>
       <h3 className="font-semibold text-[25px] text-[#0d6efd]">
          {t("viewLogsText")}
        </h3>

        <Table columns={columns} className="mt-3"/>
    </div>
  )
}
