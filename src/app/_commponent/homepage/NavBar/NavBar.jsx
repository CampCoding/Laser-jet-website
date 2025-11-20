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
} from "lucide-react";
import Link from "next/link";
import Container from "../../utils/Container";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();
  const [activeLink, setActiveLink] = useState("الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const links = [
    { name: "الرئيسية", icon: <Home size={20} />, path: "/" },
    { name: "طلباتي", icon: <ShoppingCart size={20} />, path: "/orders" },
    { name: "العروض", icon: <Tag size={20} />, path: "/offers" },
    { name: "السلة", icon: <ShoppingCart size={20} />, path: "/cart" },
    { name: "المفضلة", icon: <Heart size={20} />, path: "/wishlist" },
  ];

  useEffect(() => {
    const current = links.find((link) => link.path === pathname);
    if (current) setActiveLink(current.name);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <header className="sticky top-0 z-40">
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

            {/* Desktop Right */}
            <div className="hidden items-center gap-3 lg:flex">
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

              <div className="flex items-center gap-2">
                {session?.data ? (
                  <>
                    <Link href="/account">
                      <button className="flex items-center gap-1 rounded-full border border-blue-600 px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50">
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
                  <Link href="/login">
                    <button className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
                      <LogIn size={18} />
                      تسجيل الدخول
                    </button>
                  </Link>
                )}
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
            {links.map((link) => (
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
