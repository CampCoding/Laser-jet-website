
"use client";
import { createContext, useContext, useState } from "react";

// إنشاء الكونتكست
export const MyContext = createContext();

// الـ Provider
export function MyContextProvider({ children }) {
  const [value, setValue] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <MyContext.Provider value={{ value, setValue , phone, setPhone}}>
      {children}
    </MyContext.Provider>
  );
}

