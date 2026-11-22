

"use client"
import { Trash2, Trash2Icon } from "lucide-react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { deleteEquipment } from "@/lib/actions/equipments";

interface DeleteEquipmentDialogProps {
    equipId: string
}

export function DeleteEquipmentDialog({ equipId }: DeleteEquipmentDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleDeleteButton = async () => {
        setOpen(false);

        const result = await deleteEquipment(equipId);
        console.log("delete result", result);
        if (result.deletedCount > 0) {
            toast.add({
                title: "Delete Successful!",
                description: "The equipment has been deleted successfully.",
            });
            router.refresh();
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={<Button variant="destructive"><Trash2 className="size-3.5" /></Button>}
            />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this Equipment from the DataBase.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteButton} variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
