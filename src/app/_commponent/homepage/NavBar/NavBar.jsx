
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
} from "lucide-react";
import Link from "next/link";
import Container from "../../utils/Container";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {

const session= useSession();
console.log(session);

  const [activeLink, setActiveLink] = useState("الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // ✅ استبدل الحالة دي بنظام الـ Auth الحقيقي عندك (مثال فقط)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const links = [
    { name: "الرئيسية", icon: <Home size={20} />, path: "/" },
    { name: "طلباتي", icon: <ShoppingCart size={20} />, path: "/orders" },
    { name: "العروض", icon: <Tag size={20} />, path: "/offers" },
    { name: "السلة", icon: <ShoppingCart size={20} />, path: "/cart" },
   
  ];

  // sync active link مع مسار الصفحة
  useEffect(() => {
    const current = links.find((link) => link.path === pathname);
    if (current) {
      setActiveLink(current.name);
    }
  }, [pathname]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // أمثلة دوال login/logout – اربطهم بالباك إند عندك
  const handleLogin = () => {
    // هنا هتحوّل المستخدم لصفحة تسجيل الدخول أو تفتح مودال
    // مثال فقط:
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // هنا هتعمل clear للـ token/ session
    setIsAuthenticated(false);
  };

  return (
    <header className="sticky top-0 z-40">
      <nav
        className={`w-full border-b transition-all duration-300 ${
          scrolled
            ? "bg-blue-50/80 backdrop-blur-sm shadow-md"
            : "bg-white/95"
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
            </Link>

            {/* Desktop Middle Links */}
            <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
              {links.map((link) => (
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
              ))}
            </div>

            {/* Desktop Right: Search + Auth Buttons */}
            <div className="hidden items-center gap-3 lg:flex">
              {/* Search */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ابحث في LASER..."
                  className="w-52 rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                  <Search size={16} />
                  ابحث
                </button>
              </div>

              {/* Auth buttons */}
              <div className="flex items-center gap-2">
                {session?.data ? (
                  <>
                    <Link href="/account">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-full border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        <User size={18} />
                        حسابي
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={()=>signOut({callbackUrl:"/login"})}
                      className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      <LogOut size={16} />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <LogIn size={18} />
                      تسجيل الدخول
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Tablet: Search icon + Auth compact */}
            <div className="hidden items-center gap-3 md:flex lg:hidden">
              <button
                type="button"
                className="rounded-full border border-gray-200 p-2 hover:border-blue-500 hover:text-blue-600"
              >
                <Search size={18} />
              </button>

              {isAuthenticated ? (
                <Link href="/account">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    <User size={16} />
                    حسابي
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="flex items-center gap-1 rounded-full border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    <LogIn size={16} />
                    دخول
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Cart shortcut on mobile */}
              <Link href="/cart">
                <button
                  type="button"
                  className="rounded-full border border-gray-200 p-2 hover:border-blue-500 hover:text-blue-600"
                >
                  <ShoppingCart size={20} />
                </button>
              </Link>

              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="cursor-pointer rounded-full border border-gray-200 p-2 text-gray-700 hover:border-blue-500 hover:text-blue-600 focus:outline-none"
                type="button"
              >
                <MoreHorizontal size={22} />
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="space-y-2 border-t bg-white px-3 pb-4 pt-3 shadow-md md:hidden">
            {/* Search on mobile */}
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder="ابحث في LASER..."
                className="flex-1 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                <Search size={16} />
                بحث
              </button>
            </div>

            {/* Links */}
            <div className="space-y-1">
              {links.map((link) => (
                <Link key={link.name} href={link.path}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLink(link.name);
                      setMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 ${
                      activeLink === link.name
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon}
                      {link.name}
                    </span>
                    {pathname === link.path && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                </Link>
              ))}
            </div>

            {/* Auth on mobile */}
            <div className="mt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/account">
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <User size={18} />
                      حسابي
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    <LogOut size={18} />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button
                    type="button"
                    onClick={() => {
                      handleLogin();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <LogIn size={18} />
                    تسجيل الدخول
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}


