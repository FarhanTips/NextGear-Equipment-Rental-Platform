


import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Pencil } from "lucide-react";
import { EquipmentType } from "@/lib/types/equipmentType";
import EditEquipmentForm from "./editEquipmentForm";

interface EditEquipmentDialogProps {
    equipment: EquipmentType;
}

const EditEquipmentDialog = ({ equipment }: EditEquipmentDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button
                            className={` border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-300 hover:bg-orange-100 text-xs font-semibold cursor-pointer`}
                        >
                            <Pencil className="size-3.5" aria-hidden="true" />
                            Update
                    </Button>

                }
            />
            <DialogContent className="sm:min-w-xl min-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Equipment</DialogTitle>
                    <DialogDescription>
                        Make changes here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <EditEquipmentForm equipment={equipment}></EditEquipmentForm>
            </DialogContent>
        </Dialog>
    );
};

export default EditEquipmentDialog;

