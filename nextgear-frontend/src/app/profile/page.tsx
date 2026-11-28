

"use client"

import { ChangeEvent, SyntheticEvent, useState } from "react"
import { Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"


export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    console.log("session from profile page", session);
    const user = session?.user

    const [preview, setPreview] = useState("");
    const image = preview || (user?.image?.startsWith("http") ? user.image : "")

    if (isPending) return null
    if (!user) return <p className="p-8 text-center text-sm text-stone-500">Please sign in to view your profile.</p>

    const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setPreview(file ? URL.createObjectURL(file) : "")
    }


    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        let imageUrl = user.image ?? "";

        const file = formData.get("profilePhoto")

        // Upload image to ImgBB
        if (file instanceof File && file.size > 0) {
            const imageData = new FormData()
            imageData.append("image", file)

            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                { method: "POST", body: imageData }
            )
            const result = await res.json()

            if (!result.success) {
                toast.add({ type: "error", description: "Image upload failed!" })
                return
            }

            imageUrl = result.data.url
        }

        const { error } = await authClient.updateUser({
            name: String(formData.get("name") ?? ""),
            image: imageUrl,
        })

        if (error) {
            toast.add({ type: "error", description: error.message ?? "Failed to update profile!" })
            return
        }

        toast.add({ type: "success", description: "Profile updated successfully!" })
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                    <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                    Account Settings
                </span>

                <h1 className="mt-2.5 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-3 sm:text-2xl lg:text-3xl">
                    My Profile
                </h1>
                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                    Manage how your name and photo appear across NextGear.
                </p>
            </div>

            <div className="grid gap-5 sm:gap-6 lg:grid-cols-5">
                {/* Profile picture */}
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-2">
                    <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                    <div className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
                        <div className="relative">
                            <Avatar className="size-24 ring-4 ring-white shadow-lg sm:size-28">
                                {image ? (
                                    <AvatarImage src={image} alt={user.name || "Profile photo"} className="object-cover" />
                                ) : (
                                    <AvatarFallback className="bg-linear-to-br from-orange-500 to-amber-500 text-2xl font-bold text-white sm:text-3xl">
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <label
                                htmlFor="profilePhoto"
                                className="absolute -right-1 -bottom-1 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-white bg-orange-600 text-white shadow-md hover:bg-orange-500 sm:size-9"
                                title="Change photo"
                            >
                                <Camera className="size-4" aria-hidden="true" />
                            </label>
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-bold tracking-tight text-slate-900">
                                {user.name || "Unnamed user"}
                            </h2>
                            <p className="mt-0.5 truncate text-xs text-stone-500 sm:text-sm">{user.email}</p>
                        </div>

                        <p className="text-[11px] text-stone-400 sm:text-xs">
                            Click the camera to change your photo
                        </p>

                        <div className="mt-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold tracking-wide text-orange-700">
                                <span className="size-1.5 rounded-full bg-orange-500" />
                                {session?.user.userRole?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit form */}
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:col-span-3">
                    <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 sm:p-8">
                        <div>
                            <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                                Edit profile
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-stone-500 sm:text-sm">
                                Update your display name and profile picture.
                            </p>
                        </div>

                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-xs font-semibold text-stone-700 sm:text-sm">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.name}
                                required
                                className="h-10 rounded-xl border-stone-200 bg-stone-50/60 px-3.5 text-sm sm:h-11"
                            />
                        </div>

                        {/* Photo */}
                        <div className="flex flex-col gap-1.5">
                            <p className="text-xs font-semibold text-stone-700 sm:text-sm">Profile Photo</p>

                            <label
                                htmlFor="profilePhoto"
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-stone-200 bg-stone-50/60 p-3 transition-colors hover:border-orange-200 hover:bg-orange-50/50 sm:p-4"
                            >
                                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-orange-600 shadow-sm ring-1 ring-stone-200">
                                    <Upload className="size-4" aria-hidden="true" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-xs font-semibold text-stone-700 sm:text-sm">
                                        Choose a photo
                                    </span>
                                    <span className="block text-[11px] text-stone-400">PNG or JPG · optional</span>
                                </span>
                            </label>

                            <Input
                                id="profilePhoto"
                                name="profilePhoto"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhoto}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="h-10 w-full rounded-xl bg-linear-to-r from-orange-600 to-amber-500 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 sm:h-11"
                        >
                            Save changes
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
