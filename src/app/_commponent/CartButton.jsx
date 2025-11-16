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

import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";



export default function AddToCartButton({ product }) {
  console.log(product);




  const [loading, setLoading] = useState(false);



  function handleClick() {
    setLoading(true);
    try {
      addToCart(product); // إضافة المنتج للكارت
    } catch (error) {
      console.error("خطأ في إضافة المنتج للكارت:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className= "cursor-pointer w-1/2 mx-auto bg-green-600 hover:bg-green-700 text-white rounded-2xl px-4 py-2"
    >
      {loading ? "جاري الإضافة..." : "أضف إلى الكارت"}
    </Button>
  );
}
