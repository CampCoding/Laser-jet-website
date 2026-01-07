import React, { useState } from "react";
import { FaCalendarDays } from "react-icons/fa6";

export default function InstallmentSelect({
  cartData,
  setSelectedPaymentMethod,
  selectedPaymentMethod,
}) {
  const [selectItem, setSelectItem] = useState({}); 
  return (
    <>
      {cartData?.data?.map((item) => {
        return (
          <div
            key={item?.product_id}
            className="flex flex-col gap-2 bg-gray-100 p-3 rounded-md shadow-sm"
          >
            <p className="font-bold text-lg text-gray-800">{item?.title}</p>

            {item?.installments?.map((installment) => {
              const isSelected = selectItem[item?.product_id] == installment?.installment_id;
              console.log(isSelected)
              return (
                <div key={installment?.installment_id}>
                  <div
                    onClick={() => {
                      setSelectItem((prev) => ({
                        ...prev,
                        
                        [item?.product_id]: isSelected ? null : installment?.installment_id,
                        id : installment?.installment_id
                      }));

                      setSelectedPaymentMethod((prev) => {
                        const updatedInstallments =
                          prev?.installments?.filter(
                            (inst) => inst.product_id !== item?.product_id
                          ) || [];
                        return {
                          ...prev,
                          installments: [
                            ...updatedInstallments,
                            {
                              installment_id: installment?.installment_id,
                              product_id: item?.product_id,
                            },
                          ],
                        };
                      });
                    }}
                    className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all 
                      ${
                      isSelected
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }
                    `}
                  >
                    <input
                      type="radio"
                      value={installment?.installment_id}
                      name={`payment_method_${item?.product_id}`} 
                      checked={
                        installment?.installment_id == selectItem?.id
                        // selectItem[item?.product_id] ===
                        // installment?.installment_id
                      }
                      readOnly 
                      className="!w-fit !h-[20px] focus:outline-none focus:!shadow-none text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-gray-700 whitespace-nowrap">
                      {installment?.installment_title}
                    </label>
                  </div>

                  {/* عرض تفاصيل القسط المختار فقط */}
                  {selectItem[item?.product_id] ===
                    installment?.installment_id &&
                    installment?.parts?.length > 0 &&
                    installment?.parts?.map((part, index) => (
                      <div
                        key={index}
                        className="flex gap-5 items-center bg-gray-200 p-2 rounded-md mt-2"
                      >
                        <div>
                          <p className="font-bold text-md">قسط {index + 1} </p>
                          <p className="flex gap-2 items-center">
                            <FaCalendarDays />
                            <span>{part?.part_date}</span>
                          </p>
                        </div>
                        <p className="font-bold text-lg text-blue-600">
                          {part?.part_value}
                        </p>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
