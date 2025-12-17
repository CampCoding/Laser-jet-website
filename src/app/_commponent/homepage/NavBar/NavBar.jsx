"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Home,
  ShoppingCart,
  Tag,
  Search,
  User,
  LogIn,
  LogOut,
  Heart,
  Youtube,
  Instagram,
  Facebook,
  Menu,
  X,
  ChevronDown,
  Link2,
} from "lucide-react";
import Link from "next/link";
import Container from "../../utils/Container";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import GetMytoken from "@/lib/GetuserToken";
import { Whatsapp } from "../../icons";
import SearchOverlay from "../../SearchMobileOverlay";
import DesktopSearch from "./../../DesktopSearch";
import { useDispatch, useSelector } from "react-redux";
import { getCartThunk } from "../../../../store/cartSlice";
import { Spinner } from "../../../../components/ui/spinner";

import { Dropdown } from "antd";
import useGetServices from "../../../../../hooks/useGetServices";

export default function Navbar() {
  const { data: sessionData, status } = useSession();
  const accessToken = sessionData?.user?.accessToken;
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!accessToken) return;

    dispatch(getCartThunk({ token: accessToken }));
  }, [dispatch, accessToken, status]);

  // ✅ Cart count from Redux
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0
  );

  async function fetchToken() {
    const token = await GetMytoken();
    console.log("User Token:", token);
  }

  const [activeLink, setActiveLink] = useState("الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "الرئيسية", icon: <Home size={20} />, path: "/" },
    { name: "العروض", icon: <Tag size={20} />, path: "/offers" },
  ];

  const mobileLinks = [
    { name: "الرئيسية", icon: <Home size={20} />, path: "/" },
    { name: "طلباتي", icon: <ShoppingCart size={20} />, path: "/orders" },
    { name: "العروض", icon: <Tag size={20} />, path: "/offers" },
    { name: "السلة", icon: <ShoppingCart size={20} />, path: "/cart" },
    { name: "المفضلة", icon: <Heart size={20} />, path: "/wishlist" },
  ];

  useEffect(() => {
    if (pathname === "/account") {
      setActiveLink("حسابي");
    } else {
      const current = links.find((link) => link.path === pathname);
      if (current) setActiveLink(current.name);
    }
  }, [pathname]);

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ منع سكرول البودي لما الدروير يفتح
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const { services } = useGetServices({ onlyActive: true });



  const otherServicesItems = services.map((service) => ({
    key:service.name,
    label: <a href={service.link} target="_blank" className="font-bold hover:text-blue-600!">{service.name}</a>,

  }))
  ;
 

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/95 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/* 🔵 Top blue strip */}
      {true && (
        <div className="w-full bg-[#0648af] text-white">
          <div className="container mx-auto flex gap-2 px-4 py-2 md:flex-row justify-between">
            {/* Left: Offers + WhatsApp */}
            <div className=" flex-wrap items-center justify-between gap-2 md:w-auto md:justify-end hidden md:flex">
              <Link key={"Offers"} href={"/offers"} className="hidden md:block">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-white/60 px-3 py-1.5 text-[12px] font-bold transition hover:bg-white hover:text-blue-700 md:text-sm"
                >
                  <Tag size={18} />
                  <span>عروضنا</span>
                </button>
              </Link>
              <Link key={"Orders"} href={"/orders"} className="hidden md:block">
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 rounded-full border border-white/60 px-3 py-1.5 text-[12px] font-bold transition hover:bg-white hover:text-blue-700 md:text-sm"
                >
                  <ShoppingCart size={18} />
                  <span>طلباتي</span>
                </button>
              </Link>
              <div className="hidden md:block">
                <Dropdown
                  menu={{ items: otherServicesItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-white/60 px-3 py-1.5 text-[12px] font-bold transition hover:bg-white hover:text-blue-700 md:text-sm"
                  >
                    <span>خدمات أخرى</span>
                    <ChevronDown size={16} />
                  </button>
                </Dropdown>
              </div>
            </div>

            {/* Right: Social links */}
            <div className="flex  flex-wrap items-center justify-between gap-2 md:w-auto md:justify-start w-full">
              <div className="flex items-center gap-2 md:border-r md:border-white/40 md:pr-4">
                <span className="text-[11px] md:text-sm">تواصل معنا على:</span>
                <Link
                  href="https://api.whatsapp.com/send/?phone=%2B201004331113&text&type=phone_number&app_absent=0"
                  target="_blank"
                  className="rounded-full bg-white! p-2 shadow transition hover:scale-110"
                >
                  <Whatsapp />
                </Link>
              </div>
              <div className="flex items-center gap-2 md:border-r md:border-white/40 md:pr-4">
                <span className="text-[11px] md:text-sm">تابعنا على:</span>
                <Link
                  href="https://www.facebook.com/laserjet.com.eg"
                  target="_blank"
                  className="rounded-full bg-white! p-2 shadow transition hover:scale-110"
                >
                  <Facebook className="h-4 w-4 text-blue-700" />
                </Link>
                <Link
                  href="https://www.instagram.com/laserjet.com.eg/"
                  target="_blank"
                  className="rounded-full bg-white! p-2 shadow transition hover:scale-110"
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                </Link>
                <a
                  href="https://www.youtube.com/@laserjet2458"
                  target="_blank"
                  className="rounded-full bg-white! p-2 shadow transition hover:scale-110"
                >
                  <Youtube className="h-4 w-4 text-red-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🧭 Main navbar (الهيدر كله sticky الآن) */}
      <nav
        className={`w-full border-b transition-all duration-300 ${
          scrolled ? "bg-blue-50/80 " : "bg-white/95"
        }`}
      >
        <Container className="mx-auto">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-24 cursor-pointer sm:h-12 sm:w-28 md:h-14 md:w-32">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
                />
              </div>
            </Link>

            {/* Desktop search */}
            <DesktopSearch />

            {/* Desktop right (account + cart + wishlist) */}
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2">
                {/* ✅ Desktop Cart with badge */}
                <Link key={"cart"} href={"/cart"}>
                  <button
                    type="button"
                    className="relative flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 hover:text-blue-800"
                  >
                    <ShoppingCart size={20} />
                    <span>السلة</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -left-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>

                <Link key={"Wishlist"} href={"/wishlist"}>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50 hover:text-blue-800"
                  >
                    <Heart size={20} />
                    <span>المفضلة</span>
                  </button>
                </Link>

                {status === "loading" ? (
                  <Spinner />
                ) : sessionData ? (
                  <Link href="/account">
                    <button
                      className={`flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                        pathname === "/account"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <User size={18} />
                      حسابي
                    </button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <button className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
                      <LogIn size={18} />
                      تسجيل الدخول
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile right (cart + search + menu) */}
            <div className="flex items-center gap-2 md:hidden">
              {status === "loading" ? (
                <Spinner />
              ) : sessionData ? (
                <Link href="/cart">
                  <button className="relative cursor-pointer rounded-full border border-gray-200 p-2 hover:border-blue-500 hover:text-blue-600">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -left-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-[5px] text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 md:text-sm">
                    <LogIn size={18} />
                    تسجيل الدخول
                  </button>
                </Link>
              )}

              <SearchOverlay />

              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="cursor-pointer rounded-full border border-gray-200 p-2 text-gray-700 hover:border-blue-500 hover:text-blue-600"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </Container>

        {/* 📱 Mobile Drawer Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <div className="absolute inset-y-0 right-0 flex h-full w-72 max-w-[80%] flex-col bg-white shadow-2xl transition-transform duration-300 translate-x-0">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-20">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full p-1 text-gray-600 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                {mobileLinks.map((link) => (
                  <Link key={link.name} href={link.path}>
                    <button
                      onClick={() => {
                        setActiveLink(link.name);
                        setMenuOpen(false);
                      }}
                      className={`mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                        activeLink === link.name
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {link.icon}
                        {link.name}
                      </span>
                      {/* Badge داخل قائمة الموبايل لسطر السلة فقط */}
                      {link.path === "/cart" && cartCount > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </Link>
                ))}
                <hr />
                <h6 className="font-semibold text-blue-600 text-sm! mt-5">خدمات أخرى</h6>
                <div className="flex flex-col gap-1 text-sm">

                {
                  otherServicesItems.map((item) =>{
                    return <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600"> <Link2  className="text-[5px]" /> {item.label}</div>
                  })
                }
                </div>
              </div>

              {/* Account / Auth actions */}
              <div className="border-t px-3 py-3 flex flex-col">
                {sessionData ? (
                  <>
                    <Link href="/account" className="mb-2.5!">
                      <button
                        onClick={() => setMenuOpen(false)}
                        className={`flex w-full items-center justify-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                          pathname === "/account"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <User size={18} />
                        حسابي
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="flex w-full items-center justify-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      <LogOut size={16} />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <LogIn size={18} />
                      تسجيل الدخول
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
