import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Boxes, CalendarDays, ChevronRight, FileText, Gauge, Layers, MapPin, Package, ShieldCheck, Tag } from "lucide-react";

import { getEquipmentById } from "@/lib/api/equipments";
import { EquipmentType } from "@/lib/types/equipmentType";
import BookingSection from "./_components/BookingSection";
import FavoriteButton from "./_components/FavoriteButton";
import { getUserById } from "@/lib/api/users";
import { UserType } from "@/lib/types/userType";
import Image from "next/image";

interface EquipmentDetailsPageProps { params: Promise<{ id: string }> };

export default async function EquipmentDetailsPage({ params }: EquipmentDetailsPageProps) {
  const { id } = await params;
  const equipment: EquipmentType = await getEquipmentById(id);

  if (!equipment) notFound();

  const quantity = Number(equipment.availableQuantity) || 0;
  const isAvailable = quantity > 0;

  const owner: UserType = await getUserById(equipment.ownerId);

  const specs = [
    { label: "Category", value: equipment.category, icon: Layers },
    { label: "Rental type", value: equipment.rentalType, icon: CalendarDays },
    { label: "Condition", value: equipment.condition, icon: Gauge },
    { label: "Available", value: `${quantity} unit${quantity === 1 ? "" : "s"}`, icon: Boxes },
  ];

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 sm:text-sm">
          <Link href="/" className="transition hover:text-orange-600">Home</Link>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
          <Link href="/browse-equipments" className="transition hover:text-orange-600">Browse Equipments</Link>
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="max-w-32.5 truncate font-medium text-stone-700 sm:max-w-xs">{equipment.name}</span>
        </nav>

        <Link href="/browse-equipments" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-orange-600">
          <ArrowLeft className="size-4" aria-hidden="true" />Back to equipments
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] xl:gap-8">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="relative aspect-4/3 w-full bg-stone-100 sm:aspect-video">
                {equipment.image ? (
                  <div role="img" aria-label={equipment.name} className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${equipment.image})` }} />
                ) : (
                  <div className="grid h-full place-items-center text-stone-300"><Package className="size-16" aria-hidden="true" /></div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-stone-700 shadow-sm backdrop-blur sm:text-xs">{equipment.category}</span>
                  <span className="rounded-full bg-orange-600/95 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur sm:text-xs">{equipment.condition}</span>
                </div>
                <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="mt-1 text-2xl leading-tight font-extrabold text-white sm:text-3xl lg:text-4xl">{equipment.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/90 sm:text-sm">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-orange-300" aria-hidden="true" />{equipment.location}</span>
                      <span className="inline-flex items-center gap-1.5"><Tag className="size-3.5 text-orange-300" aria-hidden="true" />{equipment.brand} {equipment.model}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${isAvailable ? "bg-emerald-50/95 text-emerald-700" : "bg-rose-50/95 text-rose-700"}`}>
                    <span className={`size-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} aria-hidden="true" />{isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
                <span className="grid size-8 place-items-center rounded-xl bg-orange-50 text-orange-600"><FileText className="size-4" aria-hidden="true" /></span>
                Description
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">{equipment.description || "No description provided."}</p>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
                <span className="grid size-8 place-items-center rounded-xl bg-orange-50 text-orange-600"><Boxes className="size-4" aria-hidden="true" /></span>
                Equipment details
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {specs.map(s => (
                  <div key={s.label} className="rounded-2xl bg-stone-50 p-3.5">
                    <s.icon className="size-4 text-orange-500" aria-hidden="true" />
                    <p className="mt-2 text-[10px] font-semibold tracking-wide text-stone-400 uppercase sm:text-[11px]">{s.label}</p>
                    <p className="mt-0.5 truncate text-xs font-bold text-slate-900 sm:text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
                <span className="grid size-8 place-items-center rounded-xl bg-orange-50 text-orange-600"><ShieldCheck className="size-4" aria-hidden="true" /></span>
                Rental terms & conditions
              </h2>
              <p className="mt-4 text-sm leading-7 whitespace-pre-line text-stone-600 sm:text-base">{equipment.rentalTerms || "No specific rental terms provided."}</p>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <BookingSection equipment={equipment} />

            <FavoriteButton equipment={equipment} />

            {/* Owner Info */}
            <div className="rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                  Owner information
                </h2>
              </div>

              <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-stone-100 bg-stone-50/70 p-2 sm:mt-3 sm:gap-3 sm:p-2.5">
                <Image
                  src={owner.image}
                  alt={owner.name || "Owner avatar"}
                  width={44}
                  height={44}
                  className="size-10 shrink-0 rounded-full object-cover ring-2 ring-orange-500/25 sm:size-11"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                      {owner.name}
                    </p>
                    <BadgeCheck
                      className="size-3.5 shrink-0 text-emerald-500"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="truncate text-[11px] text-stone-500 sm:text-xs">
                    {owner.email}
                  </p>
                </div>
              </div>

              <dl className="mt-2.5 divide-y divide-stone-200/70 rounded-xl bg-stone-50 px-2.5 py-0.5 ring-1 ring-stone-100 sm:mt-3 sm:px-3">
                <div className="flex items-center justify-between gap-2 py-1.5 text-[11px] sm:py-2 sm:text-xs">
                  <dt className="font-medium text-stone-500">Owner ID</dt>
                  <dd className="max-w-[65%] truncate font-mono text-[10px] font-medium text-stone-700 sm:text-[11px]">
                    {owner._id}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-2 py-1.5 text-[11px] sm:py-2 sm:text-xs">
                  <dt className="font-medium text-stone-500">Equipment status</dt>
                  <dd className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/80 sm:text-[11px]">
                    <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    {equipment.status}
                  </dd>
                </div>
              </dl>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}
