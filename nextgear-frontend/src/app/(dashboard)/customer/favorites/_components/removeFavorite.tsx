

"use client"
import { BookmarkX, Trash2Icon } from "lucide-react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { deleteFavEquip } from "@/lib/actions/favorites";

interface RemoveFavoriteDialogProps {
    favEquipId: string
}

export function RemoveFavoriteDialog({ favEquipId }: RemoveFavoriteDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleRemoveButton = async () => {
        setOpen(false);

        const result = await deleteFavEquip(favEquipId);
        console.log("delete favEquip result", result);
        if (result.deletedCount > 0) {
            toast.add({
                title: "Removed Successfully!",
                description: "The equipment has been removed from your favorites.",
            });
            router.refresh();
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={
                    <Button
                        aria-label="Remove from favorites"
                        className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-[11px] font-semibold whitespace-nowrap text-rose-600 transition-colors hover:border-rose-300 hover:bg-rose-100 sm:text-xs"
                    >
                        <BookmarkX className="size-3.5" aria-hidden="true" />
                        <span className="sm:hidden">Remove</span>
                        <span className="hidden sm:inline">Remove Favorite</span>
                    </Button>}
            />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Favorite Equipment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove this Equipment from your Favorites.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveButton} variant="destructive">Remove</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
