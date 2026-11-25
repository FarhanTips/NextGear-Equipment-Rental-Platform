

import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'


interface PaymentSuccessPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}


export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
    const { session_id } = await searchParams

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const {
        status,
        payment_status,
        payment_intent,
        metadata,
        customer_email,
        amount_total,
        currency
    } = await stripe.checkout.sessions.retrieve(session_id as string, {
        expand: ['line_items', 'payment_intent']
    })

    if (status === 'open') {
        return redirect('/')
    }

    if (status === "complete" && payment_status === "paid") {
        console.log({
            status,
            payment_status,
            payment_intent,
            metadata,
            customer_email,
            amount_total,
            currency,
        })

        const total = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: (currency ?? "usd").toUpperCase(),
        }).format((amount_total ?? 0) / 100);

        const paymentIntentId =
            typeof payment_intent === "string"
                ? payment_intent
                : payment_intent?.id;

        return (
            <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Success Header */}
                    <div className="text-center px-6 py-10 bg-green-50">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <svg
                                className="w-9 h-9 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Payment Successful!
                        </h1>

                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                            Thank you for your booking. Your payment has been received successfully.
                        </p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-5 sm:p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-5">
                            Booking Summary
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-100">

                                    <tr>
                                        <td className="py-4 text-gray-500">Customer Email</td>
                                        <td className="py-4 text-right font-medium text-gray-900 break-all">
                                            {customer_email}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-4 text-gray-500">Transaction ID</td>
                                        <td className="py-4 text-right font-medium text-gray-900 break-all">
                                            {paymentIntentId}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-4 text-gray-500">Rental Start Date</td>
                                        <td className="py-4 text-right font-medium text-gray-900">
                                            {metadata?.startDate}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-4 text-gray-500">Rental End Date</td>
                                        <td className="py-4 text-right font-medium text-gray-900">
                                            {metadata?.endDate}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-4 text-gray-500">Required Quantity</td>
                                        <td className="py-4 text-right font-medium text-gray-900">
                                            {metadata?.requiredQuantity}
                                        </td>
                                    </tr>

                                    <tr className="bg-gray-50">
                                        <td className="py-5 pl-3 font-semibold text-gray-900">
                                            Total Paid
                                        </td>
                                        <td className="py-5 pr-3 text-right text-xl font-bold text-green-600">
                                            {total}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                            <p className="text-sm text-gray-500 leading-relaxed">
                                A confirmation email will be sent to{" "}
                                <span className="font-medium text-gray-800">
                                    {customer_email}
                                </span>.
                                If you have any questions, please contact our support team.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        );

    }
}
