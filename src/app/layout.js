import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "./_commponent/homepage/NavBar/NavBar";
import "aos/dist/aos.css";
import Footer from "./_commponent/homepage/Footer/Footer";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { MyContextProvider } from "@/providers/OtpContext";
import { Toaster } from "@/components/ui/sonner";
import "leaflet/dist/leaflet.css";
import Providers from "../providers/StoreProvider";
import GlobalOfflineGate from "./_commponent/GlobalOfflineGate";

// app/layout.jsx
export const metadata = {
  title: "LASERJET | متجر الإلكترونيات • أجهزة ذكية، شاشات، أدوات منزلية",
  description:
    "LASERJET منصة تجارة إلكترونية متخصصة في الإلكترونيات، الأجهزة الذكية، الأدوات المنزلية، اللابتوبات، والإكسسوارات مع عروض حصرية، دفع آمن، وتوصيل سريع.",
  keywords: [
    "ليزر جت",
    "LASERJET",
    "متجر إلكترونيات",
    "شراء إلكترونيات أونلاين",
    "أجهزة ذكية",
    "أدوات منزلية",
    "شاشات",
    "لابتوبات",
    "هواتف محمولة",
    "إكسسوارات موبايل",
    "سماعات",
    "ساعات ذكية",
    "عروض إلكترونيات",
    "تسوق أونلاين",
  ],
  metadataBase: new URL("https://laserjet.com"), // عدّلها للدومين الحقيقي

  openGraph: {
    type: "website",
    url: "https://laserjet.com",
    siteName: "LASERJET",
    title: "LASERJET — متجر الإلكترونيات والأجهزة الذكية",
    description:
      "تسوق الجوالات والشاشات واللابتوبات والأجهزة المنزلية بأفضل الأسعار مع توصيل سريع ودفع آمن.",
    images: [
      {
        url: "https://laserjet.com/og-image.jpg", // ضع رابط صورة OG حقيقية
        width: 1200,
        height: 630,
        alt: "LASERJET متجر إلكترونيات",
      },
    ],
    locale: "ar_EG", // أو ar_SA حسب السوق المستهدف
  },

  twitter: {
    card: "summary_large_image",
    title: "LASERJET — متجر الإلكترونيات",
    description:
      "أحدث الأجهزة الذكية، اللابتوبات، الشاشات، والإلكترونيات بأسعار منافسة.",
    images: ["https://laserjet.com/og-image.jpg"],
  },
};

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"], // pick what you need
  variable: "--font-noto-kufi-arabic", // optional but great with Tailwind
});

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body dir="rtl" className={`antialiased ${notoKufiArabic.className}`}>
        <GlobalOfflineGate>
          <Providers>
            <NextAuthProvider>
              <MyContextProvider>
                <Navbar />
                <main className="p- min-h-screen">{children}</main>
                <Toaster />
                <Footer />
              </MyContextProvider>
            </NextAuthProvider>
          </Providers>
        </GlobalOfflineGate>
      </body>
    </html>
  );
}
