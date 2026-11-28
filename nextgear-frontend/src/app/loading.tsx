

export default function Loading() {
    return (
        <main className="flex flex-1 items-center justify-center bg-linear-to-b from-orange-50/70 via-white to-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-4 text-center"
            >
                <span className="sr-only">Loading, please wait...</span>

                {/* Spinner */}
                <div
                    aria-hidden="true"
                    className="size-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500 sm:size-12"
                />

                <p className="text-xs text-stone-500 sm:text-sm">
                    Loading, please wait...
                </p>
            </div>
        </main>
    );
}
