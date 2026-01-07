import { Modal, Table } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const data = [
    {
        id:1,
        sub_total:"8809 EGP",
        total:"8844 EGP",
        username:"LASERJET",
        phone:"01004331113",
        nationalId:"602013372",
        city:"القاهرة",
        street:"chc",
        house_number:"288",
    }
]

export default function ProductRequestDetails() {
    const [viewModal , setViewModal] = useState(false);
    const navigate = useNavigate();
  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "#",
    },
    {
      dataIndex: "sub_total",
      key: "sub_total",
      title: "Sub Total",
    },
    {
      dataIndex: "total",
      key: "total",
      title: "Total",
    },
    {
      dataIndex: "username",
      key: "username",
      title: "User Name",
    },
    {
      dataIndex: "phone",
      key: "phone",
      title: "Phone Number",
    },
    {
      dataIndex: "nationalId",
      key: "nationalId",
      title: "National ID / Passport",
    },
    {
      dataIndex: "city",
      key: "city",
      title: "City",
    },
    {
      dataIndex: "street",
      key: "street",
      title: "Street",
    },
    {
      dataIndex: "house_number",
      key: "house_number",
      title: "House Number",
    },
    {
      dataIndex: "",
      key: "",
      title: "Location Label",
      render: (row) => (
        <div className="flex gap-3 items-center">
            <button onClick={() => {
            setViewModal(true)
        }} className=" bg-[#0d6efd] text-white rounded-md p-2 flex justify-center items-center">
          View on map
        </button>

        <button className=" bg-[#0d6efd] text-white rounded-md p-2 flex justify-center items-center" onClick={() => navigate(`/product_orders/1`)}>Products</button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <h3 className="font-semibold text-[25px] text-[#0d6efd]">View Order</h3>
      <Modal open={viewModal} onCancel={()=>setViewModal(false)} onClose={()=> setViewModal(false)} footer={null} >
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d30103.463774877226!2d30.987022144716835!3d30.80853506574194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1738585647533!5m2!1sen!2seg" height="450" className="w-full" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </Modal>
      <Table className="mt-3" columns={columns} dataSource={data}/>
    </div>
  );
}
