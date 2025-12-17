"use client";

import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
  TelegramIcon,
} from "react-share";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareDropdown({ url, title , buttonTitle }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Close on outside click
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full md:w-auto share-dropdown inline-block text-left "
    >
      {/* Trigger button */}
      {  <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ scale: 0.95 }}
        className={`cursor-pointer w-full md:w-auto inline-flex items-center gap-2 bg-white rounded-full border border-slate-200 ${buttonTitle ? "px-4" : "px-2"} py-2 text-sm font-medium text-blue-700 hover:border-blue-400 hover:bg-rose-50 transition-colors`}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Share2 className="w-5 h-5" />
        </motion.span>
        {buttonTitle || ""}
      </motion.button>}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="share-menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-blue-200 bg-white shadow-lg z-30"
          >
            <div className="py-2 px-2 flex flex-col gap-2.5">
              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                <FacebookShareButton
                  url={url}
                  quote={title}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <FacebookIcon size={28} round />
                  <span className="text-sm text-slate-700">فيسبوك</span>
                </FacebookShareButton>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                <WhatsappShareButton
                  url={url}
                  title={title}
                  separator=" - "
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <WhatsappIcon size={28} round />
                  <span className="text-sm text-slate-700">واتساب</span>
                </WhatsappShareButton>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                <LinkedinShareButton
                  url={url}
                  title={title}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LinkedinIcon size={28} round />
                  <span className="text-sm text-slate-700">لينكدإن</span>
                </LinkedinShareButton>
              </motion.div>

              <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                <TelegramShareButton
                  url={url}
                  title={title}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <TelegramIcon size={28} round />
                  <span className="text-sm text-slate-700">تيليجرام</span>
                </TelegramShareButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
