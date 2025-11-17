// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button"; // عدّل الباث حسب مشروعك

// const AddToCartButton = ({ product, onAddToCart }) => {
//   const [loading, setLoading] = useState(false);
//   const [added, setAdded] = useState(false);

//   const handleClick = async () => {
//     if (!onAddToCart || loading) return;

//     try {
//       setLoading(true);
//       await onAddToCart(product); // هنا تستدعي اللوجيك بتاعك (كونتكست / ريدكس / API)
//       setAdded(true);

//       // لو حابب يرجع تاني للنص الأصلي بعد ثانيتين مثلاً
//       setTimeout(() => setAdded(false), 2000);
//     } catch (err) {
//       console.error("Error adding to cart:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button
//       size="sm"
//       onClick={handleClick}
//       disabled={loading}
//       className="rounded-full cursor-pointer bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
//     >
//       {loading ? "جاري الإضافة..." : added ? "تمت الإضافة ✅" : "اضف للسلة"}
//     </Button>
//   );
// };

// export default AddToCartButton;


// components/AddToCartButton.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddToCart from "@/CartAction/AddToCart";
import GetMytoken from "@/lib/GetuserToken";

export default function AddToCartButton({ product }) {

  console.log(product);

  // الحالة بتبدأ حسب الداتا اللي جاية من الـ API
  const [inCart, setInCart] = useState(product.isInCart === 1);
  const [qty, setQty] = useState(product.quantity || 1);
  const [loading, setLoading] = useState(false);

  const increase = () => setQty(prev => prev + 1);

  const decrease = () => {
    if (qty > 1) {
      setQty(prev => prev - 1);
    }
  };

  const addToCart = () => {
    setLoading(true);

    console.log("إضافة للسلة:", {
      productId: product.product_id,
      quantity: qty,
    });

    // لما تتم الإضافة يظهر + - ويختفي زرار الإضافة
    setTimeout(() => {
      setInCart(true);
      setLoading(false);
    }, 600);
  };


async function addtocartfirstacton(productId){
  const data = await AddToCart(productId)
  console.log(data);
  // const token = await GetMytoken()
  // console.log(token);
}



  return (
    <div className="flex items-center justify-between gap-2 w-full">

      {/* 🔹 لو المنتج مش موجود → زرار إضافة فقط */}
      {!inCart && (
        <Button
          onClick={() => addtocartfirstacton(product.product_id)}
          disabled={loading}
          className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl px-4 py-2"
        >
          {loading ? "جاري الإضافة..." : "أضف إلى الكارت"}
        </Button>
      )}

      {/* 🔹 لو المنتج موجود → + - والعدد فقط */}
      {inCart && (
        <>
          <button
            onClick={decrease}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-200"
          >
            -
          </button>

          <span className="w-8 text-center font-semibold">{qty}</span>

          <button
            onClick={increase}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-200"
          >
            +
          </button>
        </>
      )}
    </div>
  );
}

