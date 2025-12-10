"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      {/* العنوان */}
      <div className="flex flex-col justify-center items-center mb-10">
        <img src="/logo.png" alt="" />
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
