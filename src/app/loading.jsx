"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t md:bg-gradient-to-r from-blue-600 to-gray-50">
      {/* العنوان */}
      <div className="flex flex-col justify-center items-center mb-10">
        <h1 className="text-6xl font-extrabold text-blue-700 drop-shadow-md tracking-wide">
          Laserjet
        </h1>
        <p className="text-gray-600 mt-2 text-4xl font-bold">Store</p>
      </div>

      {/* اللودر */}
      <motion.div
        className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* النص */}
      <motion.p
        className="text-blue-700 font-medium text-lg mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        جارٍ التحميل...
      </motion.p>
    </div>
  );
}
