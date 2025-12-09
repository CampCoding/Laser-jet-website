
"use client";
import { createContext, useContext, useState } from "react";

// إنشاء الكونتكست
export const MyContext = createContext();

// الـ Provider
export function MyContextProvider({ children }) {
  const [value, setValue] = useState("");

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

