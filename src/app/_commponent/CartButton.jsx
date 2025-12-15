"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AddToCart from "@/CartAction/AddToCart";
import DecrementProduct from "@/CartAction/DecrementProduct";
import { toast } from "sonner";

import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { getCartThunk } from "../../store/cartSlice"; // ✅ عدّل المسار لو مختلف

export default function AddToCartButton({ product, inCart: inCartProp }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  // ✅ حالة السلة الأولية
  const [inCart, setInCart] = useState(
    typeof inCartProp === "boolean"
      ? inCartProp
      : product?.isInCart === 1 || product?.isInCart === true
  );

  // ✅ الكمية الافتراضية
  const getInitialQty = () => {
    if (product?.cart_quantity && product.cart_quantity > 0) {
      return product.cart_quantity;
    }
    if (product?.quantity && product.quantity > 0) {
      return product.quantity;
    }
    return inCart ? 1 : 0;
  };

  const [qty, setQty] = useState(getInitialQty);
  const [loading, setLoading] = useState(false);

  // ✅ وظيفة مساعده لتحديث السلة من الـ Redux بعد أي تغيير
  const refreshCart = () => {
    if (!accessToken) return;
    dispatch(getCartThunk({ token: accessToken }));
  };

  // لو الـ props اتغيرت (مثلاً رجعت من API جديد)
  useEffect(() => {
    const nextInCart =
      typeof inCartProp === "boolean"
        ? inCartProp
        : product?.isInCart === 1 || product?.isInCart === true;

    setInCart(nextInCart);
    setQty(() => {
      if (product?.cart_quantity && product.cart_quantity > 0) {
        return product.cart_quantity;
      }
      return nextInCart ? 1 : 0;
    });
  }, [inCartProp, product]);

  // 🔵 أول إضافة للكارت
  const handleFirstAdd = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await AddToCart(product.product_id);
      console.log("AddToCart response (first):", data);

      if (data.success) {
        setInCart(true);

        setQty((prev) => {
          if (product?.cart_quantity && product.cart_quantity > 0) {
            return product.cart_quantity;
          }
          if (!prev || prev <= 0) return 1;
          return prev;
        });

        toast.success("تم إضافة المنتج للكارت بنجاح", {
          duration: 4000,
          position: "top",
        });

        refreshCart();

        if (
          data?.message ===
          "لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون"
        ) {
          toast.error(
            "لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون",
            { duration: 5000, position: "top-right" }
          );
        }
      } else {
        toast.error(
          data.message == "Invalid token"
            ? "الرجاء تسجيل الدخول"
            : "حدث خطأ أثناء الإضافة",
          {
            duration: 5000,
            position: "bottom-center",
          }
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setLoading(false);
    }
  };

  // 🔼 زيادة الكمية
  const handleIncrease = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await AddToCart(product.product_id);
      console.log("AddToCart response (+):", data);

      if (data.success) {
        // ✅ تحديث السلة في الـ Redux
        refreshCart();
        if (data.message == "تم تحديث المنتج بنجاح") {
          setInCart(true);
          setQty((prev) => prev + 1);
        toast.success("تم اضافة المنتج للسلة بنجاح");

          return;
        }
        if (
          data?.message ===
          "لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون"
        ) {
          toast.error(
            "لا يمكن إضافة المزيد من العناصر - تم الوصول للحد الأقصى للمخزون",
            { duration: 5000, position: "top-right" }
          );
        }
      } else {
        toast.error(data.message || "حدث خطأ أثناء التحديث");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التحديث");
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

      const newQty = Math.max(qty - 1, 0);
      setQty(newQty);

      // ✅ تحديث السلة في الـ Redux
      refreshCart();

      if (newQty === 0) {
        setInCart(false);
        toast.success("تم حذف المنتج من الكارت بنجاح", {
          duration: 4000,
          position: "top",
        });
      } else {
        toast.success("تم تقليل الكمية بنجاح", {
          duration: 4000,
          position: "top",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تقليل الكمية");
    } finally {
      setLoading(false);
    }
  };

  const showCounter = inCart && qty > 0;

  return (
    <div className="flex w-full items-center justify-between gap-2">
      {/* زر أضف إلى السلة */}
      {!showCounter && (
        <Button
          onClick={handleFirstAdd}
          disabled={loading}
          className="w-full cursor-pointer! rounded-٢xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:from-green-600 hover:to-green-800"
        >
          {loading ? "جاري الإضافة..." : "أضف إلى السلة"}
        </Button>
      )}

      {/* عداد الكمية */}
      {showCounter && (
        <div className="flex w-full items-center justify-between rounded-full bg-gradient-to-r from-green-600 to-green-700 px-3 py-1 text-white">
          <button
            onClick={handleDecrease}
            disabled={loading}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-2xl font-bold transition-all hover:scale-105 disabled:opacity-60"
          >
            -
          </button>

          <span className="w-8 text-center text-sm font-semibold">{qty}</span>

          <button
            onClick={handleIncrease}
            disabled={loading}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-2xl font-bold transition-all hover:scale-105 disabled:opacity-60"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
