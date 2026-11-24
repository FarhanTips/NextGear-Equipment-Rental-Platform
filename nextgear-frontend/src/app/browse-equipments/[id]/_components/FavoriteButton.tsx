

"use client";

import { Heart } from "lucide-react";
import { EquipmentType } from "@/lib/types/equipmentType";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  equipment: EquipmentType;
};

export default function FavoriteButton({ equipment }: FavoriteButtonProps) {

  return (
<Button
  variant="outline"
  className="h-12 w-full rounded-xl border-stone-200 bg-white px-5 text-stone-600 transition-all duration-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-[0.97] active:bg-orange-100 active:text-orange-700 focus-visible:ring-2 focus-visible:ring-orange-300"
>
  <Heart className="size-4" aria-hidden="true" />
  Add to Wishlist
</Button>
  );
}
