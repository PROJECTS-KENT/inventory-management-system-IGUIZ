
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-white/[0.08] bg-[#11121C]/90 p-5 text-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-colors duration-200 hover:border-violet-400/20 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
