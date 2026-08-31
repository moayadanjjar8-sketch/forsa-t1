import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "native" | "amber";
  size?: "default" | "sm" | "lg" | "icon" | "pill";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    
    const variants: Record<string, string> = {
      default: "bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-xs",
      destructive: "bg-rose-600 text-slate-50 hover:bg-rose-700 shadow-xs",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 text-slate-700",
      link: "text-amber-600 underline-offset-4 hover:underline",
      native: "bg-slate-950 text-amber-400 hover:bg-slate-900 shadow-md border border-slate-800",
      amber: "bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold shadow-xs",
    };

    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-[11px]",
      lg: "h-12 rounded-2xl px-6 text-sm",
      icon: "h-9 w-9 p-0",
      pill: "h-9 px-4 rounded-full",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
