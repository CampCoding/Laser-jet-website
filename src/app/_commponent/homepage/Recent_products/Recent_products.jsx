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
import { toast } from "sonner";

export default function Recent_products() {
  const [Productdata, setData] = useState([]);
  const [favorites, setFavorites] = useState({}); // ❤️ لكل منتج لوحده

  // 🟦 تحميل المفضلة من localStorage لما الصفحة تفتح
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  async function GetRecentProduct() {
    const data = await HomeApi();

    if (data.message === "تم جلب البيانات بنجاح") {
      setData(data?.data?.recent_products);
    }
  }

  async function HandleTowishlist(product_id) {
    try {
      const data = await AddToWishList(product_id);

      if (data.success === true) {
        // قلب المنتج ده بس
        setFavorites((prev) => {
          const newState = {
            ...prev,
            [product_id]: !prev[product_id],
          };

          // 🟥 حفظ التغيير داخل localStorage
          localStorage.setItem("wishlist", JSON.stringify(newState));

          return newState;
        });

        toast.success(data.message, {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetRecentProduct();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <Container>
      <section className="py-16 bg-linear-to-b from-white via-gray-50 to-gray-100">
        <div className="container">
          <h2
            className="text-3xl font-extrabold mb-10 text-center text-blue-600"
            data-aos="fade-down"
          >
            أخر الوصول
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Productdata.map((product, index) => (
              <Link
                key={index}
                href={`/spasific-product/${product?.product_id}`}
              >
                <Card
                  className="relative group overflow-hidden border border-gray-100 shadow-md rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all h-[500px]"
                  data-aos="zoom-in-up"
                >
                  {/* زرار القلب */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      HandleTowishlist(product?.product_id);
                    }}
                    className={`
                      cursor-pointer absolute top-4 right-4 z-10 
                      p-2 rounded-full transition-all duration-300
                      ${
                        favorites[product.product_id]
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-white/70 hover:bg-red-100"
                      }
                    `}
                  >
                    <Heart
                      className={`
                        w-5 h-5 transition-transform duration-300
                        ${
                          favorites[product.product_id]
                            ? "text-white scale-125"
                            : "text-red-500 group-hover:scale-125"
                        }
                      `}
                    />
                  </button>

                  <CardHeader className="p-4 flex flex-col w-full items-center">
                    <CardTitle>
                      <div className="relative w-full h-[220px] mb-4 rounded-xl shadow-inner transition-all">
                        <Image
                          src={product.images[0].image_url}
                          fill
                          alt={product.description}
                          className="object-cover group-hover:scale-110 transition-all"
                        />
                      </div>
                    </CardTitle>

                    <h1 className="font-bold line-clamp-1 text-lg text-gray-800 text-center mb-2 group-hover:text-orange-600 transition-colors">
                      {product.product_title}
                    </h1>

                    <CardDescription className="text-gray-500 text-center line-clamp-2 font-medium">
                      {product.product_description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 flex justify-between items-center border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <span className="text-gray-700">0.0</span>
                    </div>

                    <p className="text-lg font-semibold text-orange-600">
                      {product.price} <span className="text-sm text-gray-600">جنيه</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
}
