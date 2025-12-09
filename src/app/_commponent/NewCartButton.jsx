"use client";

import { useState } from "react";
import AddToCart from "@/CartAction/AddToCart";
import DecrementProduct from "@/CartAction/DecrementProduct";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { getCartThunk } from "../../store/cartSlice";

export default function NewAddToCartButton({ product }) {
  // الكمية الحالية في الـ UI (نبدأ باللي جاية من الـ product أو 1)
  const [qty, setQty] = useState(product.quantity || 1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.user?.accessToken;

  // 🔼 زيادة الكمية
  const handleIncrease = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await AddToCart(product.product_id);
      console.log("AddToCart response:", data);

      if (data?.success) {
        // حالة الوصول للحد الأقصى من المخزون
        if (
          data?.message ===
          "لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون"
        ) {
          toast.error(
            "لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون",
            { duration: 5000, position: "top-right" }
          );
        } else {
          setQty((prev) => prev + 1);
          dispatch(getCartThunk({ token: accessToken }));

          // اختياري: تقدر تضيف Toast هنا لو حابب
          // toast.success("تم زيادة الكمية", { duration: 2000, position: "top-right" });
        }
      } else {
        toast.error(data?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (err) {
      console.error("AddToCart error:", err);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    } finally {
      setLoading(false);
    }
  };

  // 🔽 تقليل الكمية
  const handleDecrease = async () => {
    if (loading) return;
    if (qty <= 0) return;

    setLoading(true);
    try {
      const data = await DecrementProduct(product.product_id);
      console.log("DecrementProduct response:", data);

      if (data?.success) {
        const newQty = Math.max(qty - 1, 0);
        setQty(newQty);

        // لو الـ API قال المنتج اتحذف من الكارت
        if (data?.data?.message === "تم حذف المنتج بنجاح") {
          toast.success("تم حذف المنتج من الكارت بنجاح", {
            duration: 5000,
            position: "top-right",
          });
        } else {
          toast.success("تم تقليل الكمية بنجاح", {
            duration: 3000,
            position: "top-right",
          });
        }
      } else {
        toast.error(data?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (err) {
      console.error("DecrementProduct error:", err);
      toast.error("حدث خطأ أثناء تقليل الكمية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      {/* زرار - */}
      <button
        onClick={handleDecrease}
        disabled={loading || qty <= 0}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-lg font-bold hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        -
      </button>

      {/* الكمية */}
      <span className="w-8 text-center font-semibold">{qty}</span>

      {/* زرار + */}
      <button
        onClick={handleIncrease}
        disabled={loading}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-lg font-bold hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        +
      </button>
    </div>
  );
}
