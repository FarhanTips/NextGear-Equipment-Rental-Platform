

"use client";

import { Heart } from "lucide-react";
import { EquipmentType } from "@/lib/types/equipmentType";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { createFavorite } from "@/lib/actions/favorites";

interface FavoriteButtonProps {
  equipment: EquipmentType;
};

export default function FavoriteButton({ equipment }: FavoriteButtonProps) {
  const { data: session } = authClient.useSession();

  const handleFavoriteButton = async () => {
    if (session?.user.userRole !== "customer") {
      toast.add({
        type: "error",
        description: "Wishlist is available for CUSTOMERS only!",
      });
      return;
    }
    const newFav = {
      equipmentId: equipment._id,
      customerId: session?.user.id,
      createdAt: new Date(),
    }
    const postFavResult = await createFavorite(newFav);
    console.log("postFavResult", postFavResult);
    if (postFavResult.insertedId) {
      toast.add({
        type: "success",
        description: "Added to your favorites!",
      });
    }
    else if (postFavResult.msg) {
      toast.add({
        type: "info",
        description: postFavResult.msg,
      });
    }
    else {
      toast.add({
        type: "error",
        description: "Something went wrong. Try Again Later!",
      });
    }
  }

  return (
    <Button
      variant="outline" onClick={handleFavoriteButton}
      className="h-12 w-full rounded-xl border-stone-200 bg-white px-5 text-stone-600 transition-all duration-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-[0.97] active:bg-orange-100 active:text-orange-700 focus-visible:ring-2 focus-visible:ring-orange-300 cursor-pointer"
    >
      <Heart className="size-4" aria-hidden="true" />
      Add to Wishlist
    </Button>
  );
}
