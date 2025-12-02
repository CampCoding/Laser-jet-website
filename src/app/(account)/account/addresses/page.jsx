
"use client";

import axios from "axios";
import { ChevronLeft, LocateFixed, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input, Modal, Select } from "antd";
import AddAddressModal from "../../../components/AddAddressModal";


function AddressSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-4"></div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function AddressListApp() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [selectedAddressEdit, setSelectedAddressEdit] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [governorate, setGovernorate] = useState([]);
  const [addressType, setAddressType] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const getAddresses = async () => {
    if (!session) return;

    try {
      const res = await axios.get(
        "https://lesarjet.camp-coding.site/api/address/list",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      setAddresses(res.data.data.addresses);
      toast.success("تم تحميل العناوين بنجاح" || res.data.message);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteAddress = async (id) => {
    if (!session) return;

    try {
      const response = await axios.delete(`https://lesarjet.camp-coding.site/api/address/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },

      });

      toast.success("تم حذف العنوان بنجاح");
      getAddresses(); // تحديث القائمة
    } catch (error) {
      console.error("Error deleting address:", error.response?.data || error);
      toast.error("حدث خطاء اثناء الحذف");
    }
  };

 const handleUpdateAddress = async () => {
  if (!session || !selectedAddressEdit) return;

  try {
    const response = await axios.put(
      "https://lesarjet.camp-coding.site/api/address/update",
      {
        id: selectedAddressEdit.id,
        alias: selectedAddressEdit.alias,
        details: selectedAddressEdit.details,
        region_id: selectedAddressEdit.region_id,
        latitude: selectedAddressEdit.latitude,
        longitude: selectedAddressEdit.longitude,
        is_primary: selectedAddressEdit.is_primary ? true : false,
      },
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    toast.success("تم تحديث العنوان بنجاح");
    getAddresses();
    setEditModalOpen(false);
  } catch (error) {
    console.error("UPDATE ERROR:", error.response?.data || error);
    toast.error("حدث خطأ أثناء تحديث العنوان");
  }
};

const handleAddAddress = async () => {
  if (!session) return;
  try{
    const response = await axios.post(
        "https://lesarjet.camp-coding.site/api/address/create",
        {
          alias: addressType,
          details: newAddress,
          longitude: longitude,
          latitude: latitude,
          region_id: governorate,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
    );

    toast.success(response.data.message);
    getAddresses();
  } catch (error) {
    console.error("Error adding address:", error.response?.data || error);
    toast.error("حدث خطاء اثناء اضافة العنوان");
  }finally{
      setAddModalOpen(false);
      setAddressType("");
      setGovernorate("");
      setNewAddress("");
  }
}
  

  useEffect(() => {
    getAddresses();
  }, [session]);

  return (
   
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6 lg:space-y-8" dir="rtl">
        
        {/* Header */}
        <header className="flex flex-col gap-3 border-b border-gray-100 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-3 px-6">
            <button onClick={() => window.history.back()} className="p-2 cursor-pointer hover:bg-blue-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 transform rotate-180" />
            </button>
            <h1 className="text-xl font-bold">عناويني</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 pb-24">
          <div className="space-y-4">

            {/* 🔄 Skeleton أثناء التحميل */}
            {loading &&
              [...Array(3)].map((_, i) => <AddressSkeleton key={i} />)}

              {/* ❌ لو مفيش عناوين */}
{!loading && addresses.length === 0 && (
  <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
    <p className="text-gray-500 text-lg font-medium">
      لا يوجد عناوين حتى الان 
    </p>
  </div>
)}


            {/* ✔️ البيانات بعد التحميل + Motion */}
            {!loading &&
              addresses.map((address) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-sm p-5"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <LocateFixed className="w-6 h-6 text-blue-800" />
                      <h2 className="text-lg font-bold text-gray-800">{address.alias}</h2>
                    </div>

                    <p className="text-gray-400 text-sm text-right mb-4">
                      {address.details}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                      setDeleteModalOpen(true)
                      setAddressToDelete(address.id) }}
                      className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-sm font-medium">حذف</span>
                    </button>

                    <button 
                    onClick={()=>{
                      console.log(address)
                      setEditModalOpen(true)
                      setSelectedAddressEdit(address)
                    }}
                     className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <SquarePen className="w-5 h-5" />
                      <span className="text-sm font-medium">تعديل</span>
                    </button>
                  </div>
                </motion.div>
              ))}

            <div className="flex justify-center">
              <button onClick={()=>{
                
                
                setAddModalOpen(true)
              }} className="w-sm bg-blue-800 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-colors">
                إضافة عنوان جديد
              </button>
              <AddAddressModal
                            isModalOpen={addModalOpen}
                            setIsModalOpen={setAddModalOpen}
                            addressType={addressType}
                            setAddressType={setAddressType}
                            governorate={governorate}
                            setGovernorate={setGovernorate}
                            newAddress={newAddress}
                            setNewAddress={setNewAddress}
                            handleAddAddress={handleAddAddress}
                            latitude={latitude}
                            setLatitude={setLatitude}
                            longitude={longitude}
                            setLongitude={setLongitude}
                          />
            </div>
          </div>
        </main>
        {/* Delete Modal */}

         <Modal
          open={deleteModalOpen}
          title="تأكيد الحذف"
          onCancel={() => setDeleteModalOpen(false)}
          okText="حذف"
          cancelText="إلغاء"
          okButtonProps={{ danger: true }}
          onOk={() => {
            deleteAddress(addressToDelete);
            setDeleteModalOpen(false);
          }}
        >
          <p>هل أنت متأكد أنك تريد حذف هذا العنوان؟</p>
        </Modal>

        {/* Edit Modal */}
        <Modal
 loading={loading}
  title="تحديث العنوان"
  open={editModalOpen}
  onCancel={() => setEditModalOpen(false)}
  okText="حفظ التعديلات"
  cancelText="إلغاء"
  width={720}
  onOk={handleUpdateAddress}
>

  {
    selectedAddressEdit && (
      <>
      <label className="font-medium text-sm">نوع العنوان</label>
      <Select
        className="w-full mb-3 mt-1"
        value={selectedAddressEdit.alias}
        onChange={(v) =>
          setSelectedAddressEdit((prev) => ({ ...prev, alias: v }))
        }
        options={[
          { label: "المنزل", value: "المنزل" },
          { label: "العمل", value: "العمل" },
          { label: "آخر", value: "آخر" }
        ]}
      />

      <label className="font-medium text-sm">العنوان بالتفصيل</label>
      <Input.TextArea
        rows={3}
        value={selectedAddressEdit.details}
        onChange={(e) =>
          setSelectedAddressEdit((prev) => ({
            ...prev,
            details: e.target.value,
          }))
        }
      />
    </>
    )
  }
</Modal>
        
      </main>

  );
}
