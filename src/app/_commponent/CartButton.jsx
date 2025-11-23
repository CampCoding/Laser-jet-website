
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddToCart from "@/CartAction/AddToCart";
import { toast } from "sonner";
import DecrementProduct from "@/CartAction/DecrementProduct";

export default function AddToCartButton({ product }) {
  const [inCart, setInCart] = useState(product.isInCart === 1);
  const [qty, setQty] = useState(product.quantity || 1);
  const [loading, setLoading] = useState(false);

  const increase = async () => {
    setLoading(true);
    const data = await AddToCart(product.product_id);
    setLoading(false);
    if (data.success) {
      setQty(prev => prev + 1);
    
    } else {
      toast.error(data.message || "حدث خطأ أثناء التحديث");
    }
  };

  const decrease = async () => {
    if (qty > 1) {
      setLoading(true);
      const data = await AddToCart(product.product_id);
      setLoading(false);
      if (data.success) {
        setQty(prev => prev - 1);
        toast.success("تم تقليل الكمية بنجاح");
      } else {
        toast.error(data.message || "حدث خطأ أثناء التحديث");
      }
    }
  };

  const addtocartfirstaction = async (productId) => {
    setLoading(true);
    const data = await AddToCart(productId);
    console.log("AddToCart response:", data);
    setLoading(false);

    if (data.success) {
      setInCart(true); // تحويل الزرار إلى + و -
      setQty(1);       // بداية الكمية 1
      toast.success("تم إضافة المنتج للكارت بنجاح" , { duration: 5000 , position: "top-right"});
      if(data?.message==="لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون"){
        toast.error( "لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون", { duration: 5000 , position: "top-right"});
      }
    } else {
      toast.error(data.message || "حدث خطأ أثناء الإضافة");
    }
  };


async function GetDecrementProduct(product_id) {
  const data= await DecrementProduct(product_id)
  console.log("DecrementProduct response emaaaaaaaaad", data);
  if (data?.data?.message=="تم حذف المنتج بنجاح"){
    toast.success("تم حذف المنتج من الكارت بنجاح" , { duration: 5000 , position: "top-right"});
setInCart(!inCart);

  }




}



  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {!inCart && (
        <Button
          onClick={() => addtocartfirstaction(product.product_id)}
          disabled={loading}
          className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl px-4 py-2"
        >
          {loading ? "جاري الإضافة..." : "أضف إلى الكارت"}
        </Button>
      )}

      {inCart && (
        <>
          <button
            onClick={() =>{
decrease();
GetDecrementProduct(product.product_id);
            }
              }
            disabled={loading}
            className="w-8 h-8 cursor-pointer rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-200"
          >
            -
          </button>

          <span className="w-8 text-center font-semibold">{qty}</span>

      <button
  onClick={() => {
    increase(); // زيادة الكمية
    addtocartfirstaction(product.product_id); // إضافة أولية للكارت
  }}
  disabled={loading}
  className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-200"
>
  +
</button>

        </>
      )}
    </div>
  );
}

