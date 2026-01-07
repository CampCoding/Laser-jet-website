import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleFetcOrders } from "../../features/ordersSlice";
import InvoiceCard from "../InvoiceCard/InvoiceCard";
import { Pagination, Spin } from "antd";
import { fetchUserProfile } from "../../features/loginSlice";

export default function Invoices({ item, isLoading }) {
  const { data, loading } = useSelector((state) => state?.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = item?.slice(startIndex, endIndex);
  const totalItems = item?.length;
  const dispatch = useDispatch();
  const { userProfileData } = useSelector((state) => state?.login);
  const [permissions, setPermissions] = useState([]);

  const canExportReport = permissions?.some(
    (item) => item?.permission_id == 31
  );
  const canShowAllReports = permissions?.some(
    (item) => item?.permission_id == 29
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(handleFetcOrders());
  }, [dispatch]);

  useEffect(() => {
    setPermissions(userProfileData?.permissions);
  }, [userProfileData]);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Current Page:", page);
  };

  if ( isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="mt-5">
      {paginatedData?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {paginatedData?.map((item) => (
            <InvoiceCard
              canExportReport={canExportReport}
              canShowAllReports={canShowAllReports}
              key={item?.order_id}
              data={item}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">لا توجد فواتير متاحة</p>
      )}

      <Pagination
        className="!my-4"
        align="center"
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </div>
  );
}
