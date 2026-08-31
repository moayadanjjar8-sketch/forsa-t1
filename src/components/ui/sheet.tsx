import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  side?: "bottom" | "top" | "right" | "left";
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
  side = "bottom",
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Native Bottom Drawer */}
          <motion.div
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "relative z-10 w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]",
              className
            )}
          >
            {/* Grab Handle for Native iOS feel */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4 shrink-0" />

            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between mb-4">
                <div>
                  {title && <h3 className="text-base font-bold font-heading text-slate-900">{title}</h3>}
                  {description && <p className="text-xs text-slate-500">{description}</p>}
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
