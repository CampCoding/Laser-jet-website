"use client";

import React, { useEffect, useState } from "react";
import OffersClient from "./offersClient";
import Pagination from "../_commponent/utils/Pagination";
import { useSearchParams } from "next/navigation";
import getOffers from "@/CallApi/Offers";

const Offers = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const per_page = 10;

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      const res = await getOffers({ page, per_page });
      setData(res?.data);
    };

    fetchOffers();
  }, [page]);

  const offers = data?.offers || [];
  const pagination = data?.pagination || {};
  const last_page = pagination.totalPages || 1;
  const current_page = pagination.current_page || page;

  return (
    <div>
      <OffersClient offers={offers} />
      <Pagination page={current_page} last_page={last_page} />
    </div>
  );
};

export default Offers;
