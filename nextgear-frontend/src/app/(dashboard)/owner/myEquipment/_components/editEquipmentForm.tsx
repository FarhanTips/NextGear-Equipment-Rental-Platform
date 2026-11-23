"use client";

import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ImagePlus, MapPin, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { EquipmentType } from "@/lib/types/equipmentType";
import { UpdateEquipment } from "@/lib/actions/equipments";
import { useRouter } from "next/navigation";

interface EditEquipmentFormProps {
    equipment: EquipmentType;
}

const categories = [
    "Cameras & Photography",
    "Audio & Sound",
    "Lighting & Studio",
    "Drones & Aerial",
    "Computers & Tablets",
    "Tools & Machinery",
    "Events & Party",
    "Sports & Outdoor",
    "Other",
];

const rentalTypes = ["Daily", "Weekly", "Monthly"];

const conditions = ["Brand New", "Excellent", "Good", "Fair"];

const inputClass =
    "h-11 rounded-xl border-stone-200 bg-stone-50/60 px-3.5 text-base text-stone-900 transition-colors focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-100 sm:text-sm";

const selectClass =
    "h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 pr-10 text-base text-stone-900 transition-colors outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:text-sm";

const textareaClass =
    "w-full resize-y rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-3 text-base leading-relaxed text-stone-900 transition-colors outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:text-sm";

const labelClass = "text-xs font-semibold text-stone-700 sm:text-sm";

const SectionTitle = ({ children }: { children: string }) => (
    <h3 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-stone-500 uppercase sm:text-[11px]">
        <span
            className="h-3.5 w-1 rounded-full bg-linear-to-b from-orange-500 to-amber-400"
            aria-hidden="true"
        />
        {children}
    </h3>
);

const EditEquipmentForm = ({ equipment }: EditEquipmentFormProps) => {
    const router = useRouter();
    // Remembers the form so we can clear all fields at once
    const formRef = useRef<HTMLFormElement>(null);

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(equipment.image ?? "");
    const [submitting, setSubmitting] = useState(false);

    // Free the temporary preview URL when it is replaced or the form closes
    useEffect(() => {
        return () => {
            if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Keep the current category selectable even if it is not in the default list
    const categoryOptions =
        equipment.category && !categories.includes(equipment.category)
            ? [equipment.category, ...categories]
            : categories;

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImage(file);
        setPreview(file ? URL.createObjectURL(file) : equipment.image ?? "");
    };

    async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const editedEquipment: Record<string, string | number> = {};

        formData.forEach((value, key) => {
            editedEquipment[key] = value.toString();
        });
        editedEquipment.rentalPrice = Number(editedEquipment.rentalPrice);
        editedEquipment.availableQuantity = Number(editedEquipment.availableQuantity);

        setSubmitting(true);

        try {
            let imageUrl = equipment.image;

            // Upload a newly picked photo to ImgBB, otherwise keep the current image
            if (image) {
                const imageData = new FormData();
                imageData.append("image", image);

                const response = await fetch(
                    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                    { method: "POST", body: imageData }
                );
                const result = await response.json();

                if (!response.ok || !result.success) {
                    toast.add({
                        type: "error",
                        description: "Image upload failed! Please try again.",
                    });
                    return;
                }

                imageUrl = result.data.url;
            }

            editedEquipment.image = imageUrl;

            console.log("Data from form", editedEquipment);

            const updateResult = await UpdateEquipment(equipment._id, editedEquipment);
            console.log("updateResult", updateResult);
            if (updateResult.modifiedCount > 0) {
                toast.add({
                    type: "success",
                    description: "Update Successful!",
                });
                router.refresh();
            }
            else {
                toast.add({
                    type: "error",
                    description: "Update Failed. Try Again Later!",
                });
            }
        } catch {
            toast.add({
                type: "error",
                description: "Something went wrong. Try Again Later!",
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="-mr-1.5 flex max-h-[calc(100dvh-13rem)] flex-col gap-5 overflow-y-auto overscroll-contain pr-1.5 sm:max-h-[min(calc(100dvh-14rem),34rem)]">
                {/* Basic details */}
                <section className="flex flex-col gap-4">
                    <SectionTitle>Basic Details</SectionTitle>

                    <Field>
                        <FieldLabel htmlFor="name" className={labelClass}>
                            Equipment Name
                        </FieldLabel>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={equipment.name}
                            className={inputClass}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="description" className={labelClass}>
                            Description
                        </FieldLabel>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            defaultValue={equipment.description}
                            className={`${textareaClass} min-h-24`}
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="category" className={labelClass}>
                                Category
                            </FieldLabel>
                            <div className="relative">
                                <select
                                    id="category"
                                    name="category"
                                    defaultValue={equipment.category}
                                    className={selectClass}
                                >
                                    {categoryOptions.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-stone-400"
                                    aria-hidden="true"
                                />
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="location" className={labelClass}>
                                Location
                            </FieldLabel>
                            <div className="relative">
                                <MapPin
                                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="location"
                                    name="location"
                                    type="text"
                                    defaultValue={equipment.location}
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </Field>
                    </div>
                </section>

                <div className="h-px bg-stone-100" />

                {/* Pricing & availability */}
                <section className="flex flex-col gap-4">
                    <SectionTitle>Pricing &amp; Availability</SectionTitle>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field>
                            <FieldLabel htmlFor="rentalPrice" className={labelClass}>
                                Rental Price
                            </FieldLabel>
                            <div className="relative">
                                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-stone-400">
                                    $
                                </span>
                                <Input
                                    id="rentalPrice"
                                    name="rentalPrice"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    defaultValue={equipment.rentalPrice}
                                    className={`${inputClass} pl-8`}
                                />
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="rentalType" className={labelClass}>
                                Rental Type
                            </FieldLabel>
                            <div className="relative">
                                <select
                                    id="rentalType"
                                    name="rentalType"
                                    defaultValue={equipment.rentalType}
                                    className={selectClass}
                                >
                                    {rentalTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-stone-400"
                                    aria-hidden="true"
                                />
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="availableQuantity" className={labelClass}>
                                Available Quantity
                            </FieldLabel>
                            <Input
                                id="availableQuantity"
                                name="availableQuantity"
                                type="number"
                                min={1}
                                defaultValue={equipment.availableQuantity}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </section>

                <div className="h-px bg-stone-100" />

                {/* Equipment details */}
                <section className="flex flex-col gap-4">
                    <SectionTitle>Equipment Details</SectionTitle>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field>
                            <FieldLabel htmlFor="condition" className={labelClass}>
                                Condition
                            </FieldLabel>
                            <div className="relative">
                                <select
                                    id="condition"
                                    name="condition"
                                    defaultValue={equipment.condition}
                                    className={selectClass}
                                >
                                    {conditions.map((condition) => (
                                        <option key={condition} value={condition}>
                                            {condition}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-stone-400"
                                    aria-hidden="true"
                                />
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="brand" className={labelClass}>
                                Brand
                            </FieldLabel>
                            <Input
                                id="brand"
                                name="brand"
                                type="text"
                                defaultValue={equipment.brand}
                                className={inputClass}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="model" className={labelClass}>
                                Model
                            </FieldLabel>
                            <Input
                                id="model"
                                name="model"
                                type="text"
                                defaultValue={equipment.model}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </section>

                <div className="h-px bg-stone-100" />

                {/* Image */}
                <section className="flex flex-col gap-3">
                    <SectionTitle>Equipment Image</SectionTitle>

                    {preview ? (
                        <div className="flex flex-col gap-3 rounded-xl border-2 border-orange-300 bg-orange-50/70 p-3 sm:flex-row sm:items-center sm:p-3.5">
                            <div
                                className="h-24 w-full shrink-0 rounded-lg bg-stone-200 bg-cover bg-center sm:h-16 sm:w-20"
                                style={{ backgroundImage: `url(${preview})` }}
                                role="img"
                                aria-label="Equipment image preview"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 sm:text-sm">
                                    <Check className="size-4 shrink-0 text-orange-600" aria-hidden="true" />
                                    {image ? "New image selected" : "Current image"}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] text-stone-500 sm:text-xs">
                                    {image ? image.name : "Upload a new photo to replace it."}
                                </p>
                            </div>

                            <label
                                htmlFor="equipmentImage"
                                className="shrink-0 cursor-pointer rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-center text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-50"
                            >
                                {image ? "Change" : "Replace"}
                            </label>

                            <Input
                                id="equipmentImage"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                                disabled={submitting}
                            />
                        </div>
                    ) : (
                        <label
                            htmlFor="equipmentImage"
                            className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/40 p-3.5 transition-colors hover:border-orange-300 hover:bg-orange-50/70"
                        >
                            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-orange-600 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                                <Upload className="size-5" aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 sm:text-sm">
                                    <ImagePlus className="size-4 shrink-0 text-orange-500" aria-hidden="true" />
                                    Click to upload an image
                                </span>
                                <span className="mt-0.5 block text-[11px] text-stone-500 sm:text-xs">
                                    PNG or JPG · Max 32 MB
                                </span>
                            </span>

                            <Input
                                id="equipmentImage"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                                disabled={submitting}
                            />
                        </label>
                    )}
                </section>

                <div className="h-px bg-stone-100" />

                {/* Rental terms */}
                <Field>
                    <FieldLabel htmlFor="rentalTerms" className={labelClass}>
                        Rental Terms and Conditions
                    </FieldLabel>
                    <textarea
                        id="rentalTerms"
                        name="rentalTerms"
                        rows={3}
                        defaultValue={equipment.rentalTerms}
                        className={`${textareaClass} min-h-20`}
                    />
                </Field>
            </div>

            {/* Actions */}
            <DialogFooter className="rounded-b-xl border-stone-200 bg-stone-50/80 p-3.5 sm:p-4">
                <DialogClose
                    render={
                        <Button
                            variant="outline"
                            disabled={submitting}
                            className="h-10 w-full cursor-pointer rounded-xl border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 hover:text-slate-900 sm:h-11 sm:w-auto sm:text-sm"
                        />
                    }
                >
                    Cancel
                </DialogClose>

                <DialogClose
                    render={
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="h-10 w-full cursor-pointer gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-5 text-xs font-bold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 disabled:cursor-not-allowed sm:h-11 sm:w-auto sm:text-sm"
                        />
                    }
                >
                    <Check className="size-4" aria-hidden="true" />
                    Save Changes
                </DialogClose>
            </DialogFooter>
        </form>
    );
};

export default EditEquipmentForm;
