"use client";

import { Image } from "antd";
import {
  Facebook,
  Instagram,
  Whatsapp,
  Phone,
  MapPin,
  Mail,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo + Description */}
        <div>
          <div className="mb-4">
            <img
              src="/logo.png"
              alt="LaserJet Logo"
              className="w-[150px] h-auto object-contain"
            />
          </div>

          <p className="text-sm leading-relaxed">
            أفضل متجر لبيع الموبايلات والإلكترونيات مع ضمان وجودة عالية.
          </p>

          <div className="flex gap-4 mt-4">
            <Link
              href="#"
              className="p-2 bg-white rounded-full shadow hover:scale-110 transition"
            >
              <Facebook className="w-5 h-5 text-blue-700" />
            </Link>
            <Link
              href="#"
              className="p-2 bg-white rounded-full shadow hover:scale-110 transition"
            >
              <Instagram className="w-5 h-5 text-pink-600" />
            </Link>
            <Link
              href="#"
              className="p-2 bg-white rounded-full shadow hover:scale-110 transition"
            >
              <Youtube className="w-5 h-5 text-pink-600" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b-2 border-blue-200 pb-1">
            روابط سريعة
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:text-blue-600 transition">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-blue-600 transition">
                المنتجات
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-blue-600 transition">
                العروض
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 transition">
                تواصل معنا
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b-2 border-blue-200 pb-1">
            خدمة العملاء
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/policy" className="hover:text-blue-600 transition">
                سياسة الاستبدال
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-blue-600 transition">
                الأسئلة الشائعة
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-blue-600 transition">
                الشحن والدفع
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b-2 border-blue-200 pb-1">
            تواصل معنا
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>01000000000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <a
                href="mailto:info@laserjet.com.eg"
                className="hover:text-blue-600 transition"
              >
                info@laserjet.com.eg
              </a>
            </li>

            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>القاهرة – مصر</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center py-4 text-sm text-gray-500 border-t border-gray-200">
        © 2025 LaserJet. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
