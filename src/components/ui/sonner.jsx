"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      closeButton={false}
      duration={3200}
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast:
            // Base
            "group pointer-events-auto relative w-[360px] max-w-[92vw] overflow-hidden " +
            "rounded-2xl border shadow-[0_18px_45px_-25px_rgba(0,0,0,.45)] " +
            "backdrop-blur-xl " +
            // Light/Dark
            "bg-white/70 text-slate-900 border-slate-200/70 " +
            "dark:bg-slate-950/55 dark:text-slate-50 dark:border-slate-800/70 " +
            // Animation-friendly
            "will-change-transform",
          content:
            "flex items-start gap-3 px-4 py-3",
          icon:
            "mt-0.5 shrink-0",
          title:
            "text-[13px] font-semibold leading-5 tracking-[-0.01em]",
          description:
            "text-[12px] leading-5 text-slate-600 dark:text-slate-300 mt-0.5",
          // Buttons
          actionButton:
            "rounded-xl px-3 py-1.5 text-[12px] font-semibold " +
            "bg-slate-900 text-white hover:opacity-90 " +
            "dark:bg-slate-50 dark:text-slate-900",
          cancelButton:
            "rounded-xl px-3 py-1.5 text-[12px] font-semibold " +
            "bg-slate-100 text-slate-900 hover:bg-slate-200 " +
            "dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800",
        },
      }}
      icons={{
        success: (
          <div className="flex items-center justify-center rounded-xl size-9 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <CircleCheckIcon className="size-4" />
          </div>
        ),
        info: (
          <div className="flex items-center justify-center rounded-xl size-9 bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            <InfoIcon className="size-4" />
          </div>
        ),
        warning: (
          <div className="flex items-center justify-center rounded-xl size-9 bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
            <TriangleAlertIcon className="size-4" />
          </div>
        ),
        error: (
          <div className="flex items-center justify-center rounded-xl size-9 bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
            <OctagonXIcon className="size-4" />
          </div>
        ),
        loading: (
          <div className="flex items-center justify-center rounded-xl size-9 bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200">
            <Loader2Icon className="size-4 animate-spin" />
          </div>
        ),
      }}
      style={{
        // Sonner vars (keep subtle)
        "--border-radius": "16px",
        "--normal-bg": "rgba(255,255,255,0.72)",
        "--normal-text": "rgb(15 23 42)",
        "--normal-border": "rgba(226,232,240,0.75)",
      }}
      {...props}
    />
  );
};

export { Toaster };
