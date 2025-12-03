"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, Card, Input, Modal, Radio, Select, Spin } from "antd";

import GetCartData from "@/CartAction/GetCartData";
import DeletePtoductitem from "@/CartAction/DeleteProduct";
import AddAddressModal, { governoratesData } from "../components/AddAddressModal";
import axios from "axios";
import { toast } from "sonner";
import { SquarePen, Trash } from "lucide-react";
import dynamic from "next/dynamic";
const MapSelector = dynamic(() => import("../components/MapSelector"), { ssr: false });


const formatPrice = (value) =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(
    value
  );

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [installmentOptions, setInstallmentOptions] = useState({});
  const [subPayment, setSubPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [selectedAddressEdit , setSelectedAddressEdit] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  const [selectedInstallment, setSelectedInstallment] = useState({});

  const handleSelect = (productId, installmentId) => {
    setSelectedInstallment((prev) => ({
      ...prev,
      [productId]: installmentId,
    }));
  };

  const getAddresses = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://lesarjet.camp-coding.site/api/address/list",
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      const list = response.data?.data?.addresses ?? [];

      setAddresses(list || []); // ← ← ← أهم خطوة

      console.log("ADDRESSES FROM API:", list);
    } catch (error) {
      console.error("Error fetching addresses:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(session?.user.name);
    console.log(session?.user.phone);
    
    if (session) {
      getAddresses();
    }
  }, [session]);

  useEffect(() => {
    async function fetchCart() {
      const data = await GetCartData();
      setCart(data?.success ? data : { data: [] });
    }
    fetchCart();
  }, []);



  if (loading) {
    return (
      <p className="flex justify-center items-center my-4 ">
        <Spin />
      </p>
    );
  }


  async function deleteProduct(product_id) {
    const data = await DeletePtoductitem(product_id);
    if (data.success) {
      const updatedCart = await GetCartData();
      setCart(updatedCart);
    }
  }

  const handleAddAddress = async () => {
    if (!session) return;

    try {
      const response = await axios.post(
        "https://lesarjet.camp-coding.site/api/address/create",
        {
          alias: addressType,
          details: newAddress,
          longitude: longitude,
          latitude: latitude,
          region_id: governorate, // ← هنا أصلحنا الخطأ
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      toast.success(response.data.message);

      // تحديث العناوين
      getAddresses();
    } catch (error) {
      console.error("Error adding address:", error.response?.data || error);
    } finally {
      setIsModalOpen(false);
      setAddressType("");
      setGovernorate("");
      setNewAddress("");
    }
  };

  const deleteAddress = async (id) => {
    if (!session) return;

    try {
      const response = await axios.delete(
        `https://lesarjet.camp-coding.site/api/address/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      toast.success("تم حذف العنوان بنجاح");

      getAddresses(); // تحديث القائمة
    } catch (error) {
      console.error("Error deleting address:", error.response?.data || error);
      toast.error("حدث خطأ أثناء الحذف");
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
const handleCreateOrder = async () => {

  if (!session) return;
  if (!selectedAddress) {
  toast.error("من فضلك اختر عنوان التوصيل");
  return;
}


  let payment_type = "";
  let payment_method = "";

  //1-Type=>cash - method=>cash on delivery
  if(paymentMethod === "cash" && subPayment === "عند الاستلام"){
    payment_type = "cash";
    payment_method = "cash_on_delivery";
    return createOrder(payment_type,payment_method);
  }

  //2- Type=>cash - method=>credit
  if(paymentMethod === "cash" && subPayment === "بطاقة ائتمان"){
    payment_type="cash";
    payment_method="credit";
    return createOrder(payment_type,payment_method);

  }
 
    //3- Type=>wallet - method=>wallet
  if(paymentMethod ==="wallet" && subPayment === "محفظتك"){
   payment_type="wallet";
   payment_method="wallet";
   return createOrder(payment_type,payment_method);
  }

// قبل PaymentType الخاصة بالـ miniMoney
if (paymentMethod === "miniMoney" && subPayment === "ميني موني") {

  // 🔍 تحقق إن المستخدم اختار قسط لكل منتج
  if (Object.keys(selectedInstallment).length !== cart?.data?.length) {
    toast.error("من فضلك اختر قسط لكل منتج");
    return;
  }

  // 🟦 تجهيز بيانات الأقساط
  const installmentsPayload = Object.entries(selectedInstallment).map(
    ([productId, installmentId]) => ({
      installment_id: installmentId,
      product_id: Number(productId),
    })
  );

  payment_type = "installment";
  payment_method = "mini money";

  return createOrder(payment_type, payment_method, installmentsPayload);
}


}
const createOrder = async (payment_type, payment_method ,installments = []) => {
  try {
    const response = await axios.post(
      "https://lesarjet.camp-coding.site/api/order/create",
      {
        payment_type,
        payment_method,
        name: session?.user.name,
        phone: session?.user.phone,
        installments,
       
      },
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

   toast.success("تم انشاء الطلب بنجاح");

// تحويل المستخدم
router.push('/');
    // لو الدفع كريديت — افتح الليينك
     if (payment_method === "credit") {
       const paymentUrl = response.data?.data?.message?.data?.url;
       if (paymentUrl) {
        if (typeof window !== "undefined") {
         window.open(paymentUrl, "_blank");
        }
        return;
       }
     }
    
    // تفريغ السلة
setCart({ data: [] });

// تفريغ اختيارات المستخدم
setPaymentMethod("");
setSubPayment("");
setInstallmentOptions({});
setSelectedAddress(null);



  } catch (error) {
    toast.error(error.response?.data?.message || "حدث خطأ");
  }
};





  if (status === "loading" || !cart)
    return <p className="text-center text-xl mt-10">...جاري التحميل</p>;
  if (!session)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          الرجاء تسجيل الدخول أولًا
        </h1>
        <p className="text-gray-600 mb-6">
          للوصول إلى سلة التسوق الخاصة بك، يجب أن تقوم بتسجيل الدخول.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
        >
          تسجيل الدخول
        </Link>
      </div>
    );

  const items = cart.data || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.sell_price * item.quantity,
    0
  );
  const totalWithOffers = items.reduce(
    (sum, item) =>
      sum + (item.offer?.sell_value ?? item.sell_price) * item.quantity,
    0
  );
  const totalDiscount = subtotal - totalWithOffers;


  return (
    <main
      dir="rtl"
      className="mx-auto flex flex-col justify-between max-w-6xl gap-8 px-4 py-8"
    >
      <div className="grid grid-cols-2 gap-5">
        {/* عمود المنتجات */}
        <section className="flex-1">
        <div className="flex justify-between items-start">
           <div>
           <h1 className="mb-4 text-2xl font-bold text-gray-900">سلة التسوق</h1>
          <p className="mb-6 text-sm text-gray-500">
            {items.length === 0
              ? "سلة التسوق الخاصة بك فارغة."
              : `لديك ${items.length} منتج في السلة.`}
          </p>
         </div>
         <div>
          <h2> اسم المستخدم: {session?.user.name}</h2>
          <h3>  رقم الهاتف: {session?.user.phone}</h3>
         </div>
        </div>

          <div className="space-y-4">
            {items.map((item) => {
              const unitPrice = item.sell_price;
              const offerPrice = item.offer?.sell_value ?? null;
              const lineTotal = (offerPrice ?? unitPrice) * item.quantity;

              return (
                <div
                  key={item.product_id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
                >
                  <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
                    <Image
                      src={item.images}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-2">
                    <div>
                      <h2 className="mb-1 text-sm font-semibold text-gray-900">
                        {item.title}
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-baseline gap-2">
                          {offerPrice && (
                            <span className="text-base font-bold text-emerald-600">
                              {formatPrice(offerPrice)}
                            </span>
                          )}
                          <span
                            className={
                              offerPrice
                                ? "text-xs text-gray-400 line-through"
                                : "text-base font-semibold text-gray-900"
                            }
                          >
                            {formatPrice(unitPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          الكمية:{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          إجمالي المنتج: {formatPrice(lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
                لا توجد منتجات في سلتك حاليًا.
                <br />
                <Link
                  href="/"
                  className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  تصفح المنتجات
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* عمود العنوان وطرق الدفع */}
        <div className="!space-y-4 ">
          <Card
            className="w-full"
            style={{ borderRadius: 12 }}
            dir="rtl"
            title="عنوان التسليم"
          >
            <Radio.Group
              onChange={(e) => setSelectedAddress(e.target.value)}
              value={selectedAddress}
              className="w-full flex flex-col !space-y-1"
            >
              {addresses.map((address) => (
                <Card
                  key={address.id}
                  size="small"
                  className={`cursor-pointer ${
                    selectedAddress === address.id
                      ? "!border-blue-600 !bg-blue-50"
                      : "!border-gray-300"
                  }`}
                  style={{ borderRadius: 12, borderWidth: 1.5 }}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <div className="flex justify-between items-center">
                    <Radio value={address.id}>{address.alias} - <span>{address.details}</span></Radio>

                    <div className="flex gap-2">
                      {/* زر التعديل */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAddressEdit(address)
                          setEditModalOpen(true)
                        }}
                        className="w-8 h-8 rounded-full bg-green-100 text-green-600 
             hover:bg-green-200 flex items-center justify-center
             transition-all shadow-sm cursor-pointer"
                      >
                        <SquarePen size={16} />
                      </button>
                      {/* زر الحذف */} 
                     <button
                     loading={loading}
  danger
  size="small"
  onClick={(e) => {
    e.stopPropagation();
    setAddressToDelete(address.id);
    setDeleteModalOpen(true);
  }}
  className="w-8 h-8 rounded-full bg-red-100 text-red-600 
             hover:bg-red-200 flex items-center justify-center
             transition-all shadow-sm"
>
  <Trash size={16} />
</button>



                    </div>
                  </div>
                </Card>
              ))}
            </Radio.Group>

            <Button
              type="primary"
              block
              size="large"
              className="mt-4 !w-1/3 bg-blue-500 !rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              إضافة عنوان جديد
            </Button>

            <AddAddressModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
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


{/* //modal for edit address */}
 <Modal
 loading={loading}
  title="تعديل العنوان"
  open={editModalOpen}
  onCancel={() => setEditModalOpen(false)}
  okText="حفظ التعديلات"
  cancelText="إلغاء"
  width={720}
  onOk={handleUpdateAddress}
>
  {selectedAddressEdit && (
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

      <label className="font-medium text-sm">المحافظة</label>
      <Select
        className="w-full mb-3"
        value={selectedAddressEdit.region_id}
        onChange={(v) => {
          const gov = governoratesData.find((g) => g.id === v);
          setSelectedAddressEdit((prev) => ({
            ...prev,
            region_id: v,
            latitude: gov?.lat,
            longitude: gov?.lng,
          }));
        }}
        options={governoratesData.map((g) => ({
          label: g.name,
          value: g.id,
        }))}
        showSearch
      />

      <label className="font-medium text-sm">اختر موقعك على الخريطة</label>
      <div className="mt-2 mb-4" style={{ height: "320px", width: "100%" }}>
        <MapSelector
          latitude={selectedAddressEdit.latitude}
          longitude={selectedAddressEdit.longitude}
          setLatitude={(lat) =>
            setSelectedAddressEdit((prev) => ({ ...prev, latitude: lat }))
          }
          setLongitude={(lng) =>
            setSelectedAddressEdit((prev) => ({ ...prev, longitude: lng }))
          }
        />
      </div>

      <div className="bg-gray-50 p-3 rounded-lg text-sm mb-3">
        <p><b>Latitude:</b> {selectedAddressEdit.latitude}</p>
        <p><b>Longitude:</b> {selectedAddressEdit.longitude}</p>
      </div>

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
  )}
</Modal>


          </Card>

          <Card
            title="طريقة الدفع"
            className="w-full"
            style={{ borderRadius: 12 }}
          >
        <Select
  id="paymentMethod"
  value={paymentMethod || undefined}
  onChange={(value) => {

    // 🔍 أول ما يضغط على قسط
    if (value === "miniMoney") {

      // ❗ هات المنتجات اللي مفيهاش أقساط
      const productsWithoutInstallments = cart?.data
        ?.filter(
          (item) =>
            !Array.isArray(item.installments) ||
            item.installments.length === 0
        )
        ?.map((item) => item.product?.title || item.title);

      if (productsWithoutInstallments.length > 0) {

        toast.error(
          `لا يمكن اختيار التقسيط، المنتج التالي لا يحتوي على أقساط:\n${productsWithoutInstallments.join(" - ")}`
        );

        return; // ❗ امنع تغيير طريقة الدفع
      }
    }

    // ✔ لو مفيش مشكلة — غير الطريقة عادي
    setPaymentMethod(value);
    setSubPayment("");
  }}
  placeholder="اختر طريقة الدفع"
  className="w-full"
  size="large"
  options={[
    { value: "wallet", label: "محفظة" },
    { value: "miniMoney", label: "قسط" },
    { value: "cash", label: "كاش" },
  ]}
/>


            {/* خيارات تحت كل طريقة دفع */}
            <div className="mt-4 space-y-2 text-sm text-gray-700 w-full flex flex-col">
              {/* الدفع عند الاستلام */}
              {paymentMethod === "cash" && (
                <Radio.Group
                  value={subPayment}
                  onChange={(e) => setSubPayment(e.target.value)}
                  className="w-full flex flex-col gap-3 !space-y-1"
                >
                  <div className="border rounded-lg p-3 w-full">
                    <Radio value="بطاقة ائتمان">بطاقة ائتمان</Radio>
                  </div>

                  <div className="border rounded-lg p-3 w-full">
                    <Radio value="عند الاستلام">الدفع عند الاستلام</Radio>
                  </div>
                </Radio.Group>
              )}

              {/* محفظتك */}
              {paymentMethod === "wallet" && (
                <Radio.Group
                  value={subPayment}
                  onChange={(e) => setSubPayment(e.target.value)}
                  className="w-full flex flex-col gap-3"
                >
                  <div className="border rounded-lg p-3 w-full">
                    <Radio value="محفظتك">محفظتك</Radio>
                  </div>
                </Radio.Group>
              )}

              {/* ميني موني */}
              {paymentMethod === "miniMoney" && (
                <>
                  <Radio.Group
                    value={subPayment}
                    onChange={(e) => setSubPayment(e.target.value)}
                    className="w-full flex flex-col gap-3"
                  >
                    <div className="border rounded-lg p-3 w-full">
                      <Radio value="ميني موني">ميني موني</Radio>
                    </div>
                  </Radio.Group>

{subPayment === "ميني موني" && (
        <div className="installments-container p-4 space-y-6">

          {cart?.data?.map((item) => (
            <div
              key={item.product_id}
              className="product-installments border p-4 rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold mb-4">
                الأقساط المتاحة لمنتج: {item.title}
              </h3>

              <div className="space-y-3">
                {item.installments?.map((inst) => (
                  <div
                    key={inst.installment_id}
                    className="installment-option border p-3 rounded-md hover:bg-gray-50"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">

                      <input
                        type="radio"
                        name={`installment_${item.product_id}`}

                        checked={
                          selectedInstallment[item.product_id] ===
                          inst.installment_id
                        }
                        onChange={() =>
                          handleSelect(item.product_id, inst.installment_id)
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-md font-medium">
                        {inst.installment_title} شهر — 
                        <span className="text-green-600 font-semibold">
                          {inst.full_price.toFixed(2)} ج.م
                        </span>
                      </span>
                    </label>

                    {/* عرض تفاصيل القسط لو هو المختار */}
                    {selectedInstallment[item.product_id] ===
                      inst.installment_id && (
                      <div className="mt-3 bg-gray-100 p-3 rounded-md">
                        <h4 className="font-semibold mb-2">تفاصيل القسط:</h4>

                        {inst.parts?.map((p, index) => (
                          <div
                            key={index}
                            className="border-b py-1 text-sm flex justify-between"
                          >
                            <span>قسط رقم {index + 1}</span>
                            <span>{p.part_value} ج.م</span>
                            <span>{p.part_date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      )}

                    
              
                </>
              )}
            </div>
          </Card>

          <aside className="w-full self-start rounded-2xl bg-white p-5 shadow-md flex-1">
            <h2 className="mb-4 text-lg font-bold text-gray-900">ملخص الطلب</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>الإجمالي قبل الخصم</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>إجمالي الخصم</span>
                  <span>- {formatPrice(totalDiscount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-base font-bold text-gray-900">
                <span>الإجمالي المستحق</span>
                <span>{formatPrice(totalWithOffers)}</span>
              </div>
            </div>
            <button disabled={loading} onClick={handleCreateOrder} className="mt-5 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
             {loading ? "جار التحميل..." : " إتمام الشراء"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
