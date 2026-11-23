"use client";

import { CalendarDays } from "lucide-react";

type Props = {
  className?: string;
};

export default function BookingButton({ className = "" }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 ${className}`}
    >
      <CalendarDays className="size-4" aria-hidden="true" />
      Book Now
    </button>
  );
}