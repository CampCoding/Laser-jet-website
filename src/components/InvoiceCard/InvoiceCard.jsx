import moment from 'moment/moment';
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';

export default function InvoiceCard({data , canShowAllReports}) {
    const {t} = useTranslation();
    const navigate = useNavigate();
     
    useEffect(() => {
        console.log(data)
    } , [data])
  return (
    <div className='bg-white shadow-md p-3 flex flex-col gap-2 rounded-md'>
        <div className='flex gap-2 items-center'>
            <strong>{t("invoiceIdText")}</strong>:
            <p>{data?.installment_id}</p> 
        </div>

        {/* <div className='flex gap-2 items-center'>
            <strong>{t("dateText")}</strong>:
            <p>{moment(data?.created_at).format('MMMM Do YYYY, h:mm:ss a')}</p> 
        </div>

        <div className='flex gap-2 items-center'>
            <strong>{t("StatusText")}</strong>:
            <p>{data?.order_status}</p> 
        </div> */}
   
        <div className='flex gap-2 items-center'>
            <strong>{t("productTitle")}</strong>:
            <p>{data?.product}</p> 
        </div>

        <div className='flex gap-2 items-center'>
            <strong>{t("totalText")}</strong>:
            <p>{data?.value}</p> 
        </div>

       {canShowAllReports && <button onClick={() => navigate(`/invoices_details?order_number=${data?.order_number}&product_id=${data?.product_id}&user_id=${data?.user?.user_id}`)} className='bg-blue-500 mt-auto text-white p-2 rounded-md flex justify-center items-center'>{t("detailsText")}</button> }
    </div>
  )
}
