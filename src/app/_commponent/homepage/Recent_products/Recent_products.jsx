"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HomeApi from "@/CallApi/HomaApi";
import Link from "next/link";
import Container from "../../utils/Container";
import AddToWishList from "@/CartAction/AddToWishList";
import ShowWishList from "@/CartAction/ShowWishList"; // جلب الويش ليست الحقيقية من backend
import { toast } from "sonner";
import AddToCartButton from "../../CartButton";
import ProductCard from "../../Card/ProductCard";

export default function Recent_products() {
  const [Productdata, setData] = useState([]);
  const [favorites, setFavorites] = useState({});

  // 🟦 تحميل المنتجات + مزامنة favorites مع قائمة الأمنيات الحقيقية
  async function GetRecentProduct() {
    try {
      const data = await HomeApi();
      if (data.message === "تم جلب البيانات بنجاح") {
        setData(data?.data?.recent_products);

        // جلب قائمة الأمنيات الحقيقية من backend
        const wishData = await ShowWishList();
        const wishItems = wishData?.data || [];

        const initialFavorites = {};
        data.data.recent_products.forEach((p) => {
          initialFavorites[p.product_id] = wishItems.some(w => w.product_id === p.product_id);
        });
        setFavorites(initialFavorites);
      }
    } catch (err) {
      console.error("Error fetching products or wishlist:", err);
    }
  }

  // 🟦 إدارة القلب لكل منتج
  async function HandleTowishlist(product_id) {
    try {
      const data = await AddToWishList(product_id);
      if (data.success) {
        // بعد أي تعديل، نعيد جلب قائمة الأمنيات الحقيقية لتحديث حالة القلب بدقة
        const wishData = await ShowWishList();
        const wishItems = wishData?.data || [];
        setFavorites((prev) => ({
          ...prev,
          [product_id]: wishItems.some(w => w.product_id === product_id),
        }));

        toast.success(data.message, { duration: 5000, position: "top-center" });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    GetRecentProduct();
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <Container>
      <section className="py-16 bg-linear-to-b from-white via-gray-50 to-gray-100">
        <div className="container">
          <h2 className="text-3xl font-extrabold mb-10 text-center text-blue-600" data-aos="fade-down">
            أخر الوصول
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Productdata.map((product) => (
  <ProductCard
    key={product.product_id}
    product={product}
    isFavorite={favorites[product.product_id]}
    onToggleFavorite={HandleTowishlist}
    AddToCartButton={AddToCartButton}
  />
))}

          </div>
        </div>
      </section>
    </Container>
  );
}
