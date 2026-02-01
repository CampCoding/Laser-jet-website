"use client";

import React from "react";
import OffersClient from "./offersClient";
import Pagination from "../_commponent/utils/Pagination";
import { useSearchParams } from "next/navigation";
import useGetOffers from "../../../hooks/useGetOffers";
const Offers = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const per_page = 10;

  const { offers, pagination, loading, error } = useGetOffers({
    page,
    per_page,
  });

  const last_page = pagination.totalPages || 1;
  const current_page = pagination.current_page || page;

  if (loading)
    return (
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              {/* image */}
              <div className="h-44 w-full rounded-xl bg-gray-200 animate-pulse" />

              {/* title */}
              <div className="mt-4 h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 animate-pulse" />

              {/* price + badge */}
              <div className="mt-4 flex items-center justify-between">
                <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
                <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse" />
              </div>

              {/* button */}
              <div className="mt-4 h-10 w-full rounded-xl bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <p className="text-center py-10 text-red-600">حدث خطأ أثناء جلب العروض</p>
    );

  return (
    <div>
      <OffersClient offers={offers} />
      <Pagination page={current_page} last_page={last_page} />
    </div>
  );
};

export default Offers;
