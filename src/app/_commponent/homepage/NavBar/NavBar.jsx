"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Home, ShoppingCart, Tag, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import Container from "../../utils/Container";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "الرئيسية", icon: <Home size={20} />, path: "/" },
    { name: "طلباتي", icon: <ShoppingCart size={20} />, path: "/orders" },
    { name: "العروض", icon: <Tag size={20} />, path: "/offers" }, // ✅ تم تصحيح path
    { name: "السلة", icon: <ShoppingCart size={20} />, path: "/cart" },
    { name: "المزيد", icon: <MoreHorizontal size={20} />, path: "/more" },
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

  return (
    <div className={"sticky top-0 z-40"}>
      <nav
        className={` z-50 mx-auto w-full transition-all duration-300 ${
          scrolled
            ? "bg-blue-50/80 backdrop-blur-sm shadow-md py-3"
            : "bg-white py-2"
        }`}
      >
        <Container className="mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="relative h-16 w-32 cursor-pointer">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden items-center gap-4 md:flex">
              {links.map((link) => (
                <Link key={link.name} href={link.path}>
                  <button
                    type="button"
                    onClick={() => setActiveLink(link.name)}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 font-bold text-gray-700 transition hover:text-blue-600 ${
                      activeLink === link.name
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </button>
                </Link>
              ))}

              {/* Search */}
              <div className="ml-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ابحث في LASER..."
                  className="rounded-md border px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                  <Search size={16} />
                  ابحث
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="cursor-pointer text-gray-700 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
                type="button"
              >
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="space-y-1 bg-white px-2 pb-3 pt-2 shadow-md md:hidden">
            {links.map((link) => (
              <Link key={link.name} href={link.path}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLink(link.name);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-right text-gray-700 transition hover:text-blue-600 ${
                    activeLink === link.name
                      ? "font-semibold text-blue-600"
                      : ""
                  }`}
                >
                  {link.icon}
                  {link.name}
                </button>
              </Link>
            ))}

            {/* Search */}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="ابحث في LASER..."
                className="flex-1 rounded-md border px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                <Search size={16} />
                ابحث
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
