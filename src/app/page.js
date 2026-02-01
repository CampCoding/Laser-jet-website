import Image from "next/image";
import PanerPage from "./_commponent/homepage/PanerPage/PanerPage";
import CategoriesSwiper from "./_commponent/homepage/Categoriespage/Categoriespage";
import Recent_products from "./_commponent/homepage/Recent_products/Recent_products";
import Footer from "./_commponent/homepage/Footer/Footer";

export default function Home() {
  return (
    <>
      <div className=" ">
        <PanerPage />
        <CategoriesSwiper />
        <Recent_products />
      </div>
    </>
  );
}
