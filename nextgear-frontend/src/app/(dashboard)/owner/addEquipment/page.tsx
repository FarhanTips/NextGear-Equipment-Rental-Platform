"use client";

import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Clock3, ImagePlus, Loader2, MapPin, PlusCircle, Upload, } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { createEquipment } from "@/lib/actions/equipments";

const inputClass =
    "h-11 rounded-xl border-stone-200 bg-stone-50/60 px-3.5 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-100";

const selectClass =
    "h-11 w-full appearance-none rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 pr-10 text-sm text-stone-900 transition-colors outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

const textareaClass =
    "min-h-24 w-full resize-y rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-3 text-sm text-stone-900 transition-colors placeholder:text-stone-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

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

const AddEquipmentPage = () => {
    const { data: session } = authClient.useSession();

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImage(file);
        setPreview(file ? URL.createObjectURL(file) : "");
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (!image) {
            toast.add({
                type: "error",
                description: "Please upload an equipment image.",
            });
            return;
        }

        setSubmitting(true);

        try {
            // Upload the image to ImgBB first
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

            const formData = new FormData(form);
            const newEquip: Record<string, string | number | Date> = {};

            formData.forEach((value, key) => {
                newEquip[key] = value.toString();
            });

            newEquip.status = "Pending";
            newEquip.ownerId = session?.user.id as string;
            newEquip.image = result.data.url;
            newEquip.rentalPrice = Number(newEquip.rentalPrice);
            newEquip.availableQuantity = Number(newEquip.availableQuantity);
            newEquip.createdAt = new Date();

            console.log("New equipment from form:", newEquip);
            const postResult = await createEquipment(newEquip);
            console.log("postResult", postResult);
            if (postResult.insertedId) {
                toast.add({
                    type: "success",
                    description: "Equipment submitted for approval.",
                });

                form.reset();
                setImage(null);
                setPreview("");
            }


        } catch {
            toast.add({
                type: "error",
                description: "Something went wrong. Try Again Later!",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
            {/* Page heading */}
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-orange-700 uppercase ring-1 ring-orange-100">
                        <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                        Owner Dashboard
                    </span>

                    <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Add New Equipment
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
                        List your gear for rent. Fill in the details below and submit it for admin approval.
                    </p>
                </div>

            </div>

            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                <div className="p-5 sm:p-7 lg:p-8">
                    <FieldGroup className="gap-6">
                        {/* Basic details */}
                        <section className="grid gap-4 sm:grid-cols-2">
                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="name" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                    Equipment Name
                                </FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Sony A7 III Camera Kit"
                                    required
                                    className={inputClass}
                                />
                            </Field>

                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="description" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                    Description
                                </FieldLabel>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the equipment, what's included, and anything renters should know..."
                                    required
                                    className={textareaClass}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="category" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                    Category
                                </FieldLabel>
                                <div className="relative">
                                    <select id="category" name="category" required defaultValue="" className={selectClass}>
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-stone-400" />
                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="location" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                    Location
                                </FieldLabel>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" />
                                    <Input
                                        id="location"
                                        name="location"
                                        type="text"
                                        placeholder="e.g. Dhanmondi, Dhaka"
                                        required
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </Field>
                        </section>

                        <div className="h-px bg-stone-100" />

                        {/* Pricing & availability */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-900">Pricing & Availability</h2>
                            <p className="mt-1 mb-4 text-xs text-stone-500">
                                Set your rental price, period, and how many units are available.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <Field>
                                    <FieldLabel htmlFor="rentalPrice" className="text-xs font-semibold text-stone-700 sm:text-sm">
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
                                            placeholder="0.00"
                                            required
                                            className={`${inputClass} pl-8`}
                                        />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="rentalType" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                        Rental Type
                                    </FieldLabel>
                                    <div className="relative">
                                        <select id="rentalType" name="rentalType" required defaultValue="Daily" className={selectClass}>
                                            {rentalTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-stone-400" />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="availableQuantity" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                        Available Quantity
                                    </FieldLabel>
                                    <Input
                                        id="availableQuantity"
                                        name="availableQuantity"
                                        type="number"
                                        min={1}
                                        placeholder="1"
                                        required
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        </section>

                        <div className="h-px bg-stone-100" />

                        {/* Equipment details */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-900">Equipment Details</h2>
                            <p className="mt-1 mb-4 text-xs text-stone-500">
                                Help renters know exactly what they are getting.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <Field>
                                    <FieldLabel htmlFor="condition" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                        Equipment Condition
                                    </FieldLabel>
                                    <div className="relative">
                                        <select id="condition" name="condition" required defaultValue="" className={selectClass}>
                                            <option value="" disabled>
                                                Select condition
                                            </option>
                                            {conditions.map((condition) => (
                                                <option key={condition} value={condition}>
                                                    {condition}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-stone-400" />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="brand" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                        Brand
                                    </FieldLabel>
                                    <Input
                                        id="brand"
                                        name="brand"
                                        type="text"
                                        placeholder="e.g. Sony"
                                        required
                                        className={inputClass}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="model" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                        Model
                                    </FieldLabel>
                                    <Input
                                        id="model"
                                        name="model"
                                        type="text"
                                        placeholder="e.g. A7 III"
                                        required
                                        className={inputClass}
                                    />
                                </Field>
                            </div>
                        </section>

                        <div className="h-px bg-stone-100" />

                        {/* Image upload */}
                        <section>
                            <h2 className="text-sm font-bold text-slate-900">Equipment Image</h2>
                            <p className="mt-1 mb-4 text-xs text-stone-500">
                                Upload a clear photo. A good image helps your listing stand out.
                            </p>

                            {preview ? (
                                <div className="flex flex-col gap-3 rounded-xl border-2 border-orange-300 bg-orange-50/70 p-3 sm:flex-row sm:items-center sm:p-4">
                                    <div
                                        className="h-20 w-full shrink-0 rounded-lg bg-stone-200 bg-cover bg-center sm:w-24"
                                        style={{ backgroundImage: `url(${preview})` }}
                                        role="img"
                                        aria-label="Equipment preview"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="flex items-center gap-1.5 text-sm font-semibold text-stone-700">
                                            <Check className="size-4 text-orange-600" aria-hidden="true" />
                                            Image selected
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-stone-500">{image?.name}</p>
                                    </div>

                                    <label
                                        htmlFor="equipmentImage"
                                        className="shrink-0 cursor-pointer rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-50"
                                    >
                                        Change
                                    </label>

                                    <Input
                                        id="equipmentImage"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            ) : (
                                <label
                                    htmlFor="equipmentImage"
                                    className="group flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/40 p-4 transition-colors hover:border-orange-300 hover:bg-orange-50/70"
                                >
                                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-orange-600 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <Upload className="size-5" aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="flex items-center gap-1.5 text-sm font-semibold text-stone-700">
                                            <ImagePlus className="size-4 text-orange-500" aria-hidden="true" />
                                            Click to upload an image
                                        </span>
                                        <span className="mt-0.5 block text-xs text-stone-500">PNG or JPG · Max 32 MB</span>
                                    </span>

                                    <Input
                                        id="equipmentImage"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </section>

                        <div className="h-px bg-stone-100" />

                        {/* Terms */}
                        <Field>
                            <FieldLabel htmlFor="rentalTerms" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                Rental Terms and Conditions
                            </FieldLabel>
                            <textarea
                                id="rentalTerms"
                                name="rentalTerms"
                                placeholder="e.g. A valid ID is required. The renter is responsible for any damage..."
                                required
                                className={`${textareaClass} min-h-28`}
                            />
                            <FieldDescription className="text-xs text-stone-500">
                                These terms will be shown to renters before they book.
                            </FieldDescription>
                        </Field>

                        {/* Status */}
                        <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-amber-600 shadow-sm">
                                    <Clock3 className="size-4" aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-stone-800">Pending Review</p>
                                    <p className="text-xs text-stone-500">
                                        New listings go live after an admin approves them.
                                    </p>
                                </div>
                            </div>

                            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                                Pending
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                href="/owner"
                                className="text-center text-sm font-semibold text-stone-500 transition-colors hover:text-stone-800"
                            >
                                Cancel
                            </Link>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="h-11 w-full cursor-pointer gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 disabled:cursor-not-allowed sm:w-auto"
                            >
                                {submitting ? (
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <PlusCircle className="size-4" aria-hidden="true" />
                                )}
                                {submitting ? "Submitting..." : "Submit Equipment"}
                            </Button>
                        </div>
                    </FieldGroup>
                </div>
            </form>
        </div>
    );
};

export default AddEquipmentPage;
