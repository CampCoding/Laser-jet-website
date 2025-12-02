"use client";
import React, { useState } from "react";
import MiniMoneyDetailsScreen from "../../../_commponent/account/more-about-mini-money";
import MiniMoneyForm from "../../../_commponent/account/mini-money-form";

export default function MiniMoneyScreen() {
  const [moreMode, setMoreMode] = useState(false);
  const [formMode, setFormMode] = useState(false);

  if(formMode) return <MiniMoneyForm />


  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white flex flex-col font-sans  mx-auto shadow-sm"
    >
      {/* App header row */}
      <div className="bg-white flex items-center justify-between px-4 py-3 border-b">
        {moreMode && (
          <span
            onClick={() => setMoreMode(false)}
            className=" cursor-pointer inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/5"
          >
            {/* سهم لليسار كونه RTL */}
            <span className="border-r-2 border-t-2 border-black rotate-45 w-2.5 h-2.5" />
          </span>
        )}
        <span className="text-lg font-semibold">خدمة ميني ماني</span>
        <span></span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pt-10 px-6 gap-10">
        {moreMode ? (
          <>
            <MiniMoneyDetailsScreen />
          </>
        ) : (
          <>
            <img
              src="/image-removebg-preview.png"
              className="w-[230px] h-[230px]"
              alt=""
            />

            {/* Text blocks */}
            <div className="w-full space-y-8  leading-relaxed text-2xl font-medium">
              <p className="text-center text-black">
                تود التعرف اكثر علي خدمة ميني ماني ؟{" "}
                <button
                  onClick={() => setMoreMode(true)}
                  className=" cursor-pointer text-blue-700 font-medium"
                >
                  هيا بنا
                </button>
              </p>

              <p className="text-center text-black">
                تود التقديم علي خدمة ميني ماني ؟{" "}
                <button
                  onClick={() => setFormMode(true)}
                  className="text-blue-700 font-medium"
                >
                  هيا بنا
                </button>
              </p>
            </div>
          </>
        )}

        {/* Logo circle */}
      </div>
    </div>
  );
}
