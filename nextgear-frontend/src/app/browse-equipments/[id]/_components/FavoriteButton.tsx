"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

type Props = {
  isFavorite?: boolean;
  className?: string;
};

export default function FavoriteButton({ isFavorite = false, className = "" }: Props) {
  const [saved, setSaved] = useState(isFavorite);

  return (
    <button
      type="button"
      onClick={() => setSaved(!saved)}
      aria-pressed={saved}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition-all duration-200 ${
        saved
          ? "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100"
          : "border-stone-200 bg-white text-stone-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
      } ${className}`}
    >
      <Heart
        className={`size-4 ${saved ? "fill-orange-500 text-orange-500" : ""}`}
        aria-hidden="true"
      />
      {saved ? "Saved to Favorites" : "Add to Favorites"}
    </button>
  );
}
