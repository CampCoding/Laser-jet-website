function Pagination({ page, last_page }) {

    console.log(page , last_page)
  return (
    <div className="mt-8 flex justify-center gap-3 text-sm font-bold">

      {/* Previous */}
   

      {/* Next */}
      <a
        href={`?page=${+page < +last_page ? +page + 1 : +last_page}`}
        className={`px-4 py-2 rounded-lg border ${
          +page === +last_page
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50"
        }`}
      >
        التالي
      </a>
      {/* Page Number */}
      <span className="px-4 py-2 rounded-lg bg-blue-600 text-white">
        {+page} / {+last_page}
      </span>



         <a
        href={`?page=${+page > 1 ? +page - 1 : 1}`}
        className={`px-4 py-2 rounded-lg border ${
          page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50"
        }`}
      >
        السابق
      </a>
    </div>
  );
}

export default Pagination;