

"use client";

import Link from "next/link";
import { XCircle, RefreshCw, Home } from "lucide-react";

export default function CancelPage() {
    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10 text-center">

                {/* Cancel Icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <XCircle size={48} className="text-red-500" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Payment Cancelled!
                </h1>

                <p className="text-gray-500 mt-3 leading-relaxed">
                    Your payment was not completed. No booking payment has been confirmed.
                    You can try again whenever you&apos;re ready.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                        <RefreshCw size={18} />
                        Try Again
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>

                </div>

                <p className="text-xs text-gray-400 mt-8">
                    Need help? Please contact our support team.
                </p>

            </div>
        </section>
    );
}

