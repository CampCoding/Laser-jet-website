"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Heart, Star, Search } from "lucide-react";
import "aos/dist/aos.css";
import AOS from "aos";
import Container from "../../_commponent/utils/Container";
import AddToCartButton from "../../_commponent/CartButton";
import SpasificCatg from "@/CallApi/SpasificCath";
import AddToWishList from "@/CartAction/AddToWishList";
import ShowWishList from "@/CartAction/ShowWishList"; // جلب الويش ليست الحقيقية
import { toast } from "sonner";
import ProductCard from "../../_commponent/Card/ProductCard";

export default function Page() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});

  // ⭐ تحميل الويش ليست الحقيقية من backend
  async function syncFavorites(productList) {
    try {
      const wishData = await ShowWishList();
      const wishItems = wishData?.data || [];
      const newFavorites = {};
      productList.forEach((p) => {
        newFavorites[p.product_id] = wishItems.some(
          (w) => w.product_id === p.product_id
        );
      });
      setFavorites(newFavorites);
    } catch (err) {
      console.error("Error syncing wishlist:", err);
    }
  }

  async function HandleTowishlist(product_id) {
    try {
      const data = await AddToWishList(product_id);
      if (data.success) {
        toast.success(data.message, { duration: 4000, position: "top-center" });
        // إعادة مزامنة favorites بعد الإضافة/الحذف
        syncFavorites(products);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function GetSpasificCag(id) {
    try {
      const res = await SpasificCatg(id);
      if (res.success && res.data?.products) {
        setProducts(res.data.products);
        syncFavorites(res.data.products); // مزامنة القلوب عند تحميل المنتجات
      }
    } catch (err) {
      console.error("حدث خطأ أثناء جلب المنتجات:", err);
    }
  }

  useEffect(() => {
    if (id) GetSpasificCag(id);
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, [id]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const q = searchTerm.toLowerCase();
    return products.filter((product) => {
      const title = product.title.toLowerCase();
      const desc = product.description.toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [searchTerm, products]);

  return (
    <Container>
      {/* Header + search */}
      <div className="flex flex-col gap-4 my-10 md:my-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-600 animate-underline">
            {name}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            عدد المنتجات:{" "}
            <span className="font-semibold">{filteredProducts.length}</span>
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن منتج بالاسم أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-9 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* المنتجات */}
      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-500 text-sm md:text-base">
            لا توجد منتجات مطابقة لبحثك حاليًا.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              isFavorite={favorites[product.product_id]}
              onToggleFavorite={HandleTowishlist}
              AddToCartButton={AddToCartButton}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
