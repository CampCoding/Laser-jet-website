"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Home,
  ShoppingCart,
  Tag,
  MoreHorizontal,
  Search,
  User,
  LogIn,
  LogOut,
  Heart,
  Youtube,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Container from "../../utils/Container";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import GetMytoken from "@/lib/GetuserToken";
import { Whatsapp } from "../../icons";

export default function Navbar() {
  const session = useSession();
console.log("Session from navbar:", session);


  async function fetchToken() {
    const token = await GetMytoken();
    console.log("User Token:", token);
  }
  const [activeLink, setActiveLink] = useState("الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <header className="sticky top-0 z-40">
 <header className="w-full bg-[#0648af] pr-4  gap-2 flex flex-col lg:flex-row">
  {/* Left Section */}
  <div className= "gap-1 container lg:gap-3 ml-auto items-start lg:items-center flex-row w-auto lg:w-[400px] flex items-center text-white font-semibold cursor-pointer pt-2 pb-2">
    <Link key={"Offers"} href={"/offers"}>
      <button
        type="button"
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-bold transition pt-2 pb-2 border-r-white border-l-1 text-white hover:bg-blue-50 hover:text-blue-600 cursor-pointer hover:rounded-full transition-3 text-[12px] lg:text-sm`}
      >
        <Tag size={20} />
        <span>{"عروضنا"}</span>
      </button>
    </Link>
    <div className="flex gap-4 border-r-white pl-4 items-center">
      <span className="text-white text-[12px] lg:text-sm">تواصل معنا على : </span>
      <Link href="#" className="p-2 bg-white rounded-full shadow hover:scale-110 transition">
        <Whatsapp />
      </Link>
    </div>
  </div>

  {/* Right Section */}
  <div className= "gap-1 container lg:gap-3 mr-auto w-auto lg:w-[400px] flex text-white font-semibold cursor-pointer pt-2 pb-2 items-start lg:items-center flex-row">
    <Link key={"Orders"} href={"/orders"}>
      <button
        type="button"
        className= { `flex items-center gap-1 px-3 py-1.5 text-sm font-bold transition pt-2 pb-2 border-r-white border-l-1 text-white hover:bg-blue-50 hover:text-blue-600 cursor-pointer hover:rounded-full transition-3 text-[12px] lg:text-sm`}
      >
        <ShoppingCart size={20} />
        <span className="text-[12px]">{"طلباتي"}</span>
      </button>
    </Link>
    <div className="flex gap-1 lg:gap-3 border-r-white pl-4 items-center text-[12px] lg:text-sm">
      <span className="text-white text-[12px] lg:text-sm">تابعنا على : </span>
      <Link href="#" className="p-2 bg-white rounded-full shadow hover:scale-110 transition text-[12px] lg:text-sm">
        <Facebook className="w-5 h-5 text-blue-700" />
      </Link>
      <Link href="#" className="p-2 bg-white rounded-full shadow hover:scale-110 transition">
        <Instagram className="w-5 h-5 text-pink-600" />
      </Link>
      <Link href="#" className="p-2 bg-white rounded-full shadow hover:scale-110 transition">
        <Youtube className="w-5 h-5 text-pink-600" />
      </Link>
    </div>
  </div>
</header>

      <nav
        className={`w-full border-b transition-all duration-300 ${
          scrolled ? "bg-blue-50/80 backdrop-blur-sm shadow-md" : "bg-white/95"
        }`}
      >
        <Container className="mx-auto">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-12 w-28 sm:h-14 sm:w-32 cursor-pointer">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 768px) 120px, 160px"
                />
              </div>
              <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
                {/* {links.map((link) => (
                  <Link key={link.name} href={link.path}>
                    <button
                      type="button"
                      onClick={() => setActiveLink(link.name)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold transition ${
                        activeLink === link.name
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </button>
                  </Link>
                ))} */}
              </div>
            </Link>

            {/* Desktop Middle Links */}
            <div className="flex items-center gap-2 hidden lg:flex">
              <input
                type="text"
                placeholder="ابحث في LASER..."
                className="w-120 rounded-md border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                <Search size={16} />
                ابحث
              </button>
            </div>

            {/* Desktop Right */}
            <div className="hidden items-center gap-3 lg:flex">
              <div className="flex items-center gap-2">
                {session?.data ? (
                  <>
                    <Link href="/account">
                      <button
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition
                          ${pathname === "/account"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-blue-600 text-blue-600 hover:bg-blue-50"}
                        `}
                      >
                        <User size={18} />
                        حسابي
                      </button>
                    </Link>

                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      <LogOut size={16} />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <button className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
                        <LogIn size={18} />
                        تسجيل الدخول
                      </button>
                    </Link>
                  </>
                )}
                <Link key={"cart"} href={"/cart"}>
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-bold transition pt-2 pb-2 text-[blue] hover:bg-blue-50  hover:text-blue-600 cursor-pointer hover:rounded-full transition-3 `}
                  >
                    <ShoppingCart size={20} />
                    <span>{"السلة"}</span>
                  </button>
                </Link>
                <Link key={"Wishlist"} href={"/wishlist"}>
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-bold transition pt-2 pb-2 text-[blue] hover:bg-blue-50  hover:text-blue-600 cursor-pointer hover:rounded-full transition-3 `}
                  >
                    <Heart size={20} />
                    <span>{"المفضلة"}</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Mobile Right */}
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/cart">
                <button className="rounded-full border border-gray-200 p-2 hover:border-blue-500 hover:text-blue-600">
                  <ShoppingCart size={20} />
                </button>
              </Link>

              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="cursor-pointer rounded-full border border-gray-200 p-2 text-gray-700 hover:border-blue-500 hover:text-blue-600"
              >
                <MoreHorizontal size={22} />
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="space-y-2 border-t bg-white px-3 pb-4 pt-3 shadow-md md:hidden">
            {mobileLinks.map((link) => (
              <Link key={link.name} href={link.path}>
                <button
                  onClick={() => {
                    setActiveLink(link.name);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                    activeLink === link.name
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    {link.name}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
