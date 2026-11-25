

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/core/server';


export async function POST(request: Request) {

    const userSession = await getSession();
    try {
        const formData = await request.formData();
        const bookingData = JSON.parse(
            formData.get("bookingData") as string
        );

        const headersList = await headers()
        const origin = headersList.get('origin')

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Equipment Rental',
                        },
                        unit_amount: Math.round(Number(bookingData.total) * 100),
                    },
                    quantity: 1,
                },
            ],
            customer_email: userSession?.user.email,
            metadata: {
                customerId: userSession?.user.id as string,
                address: bookingData.address,
                contactNumber: bookingData.contactNumber,
                additionalNotes: bookingData.additionalNotes,
                equipmentId: bookingData.equipmentId,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                requiredQuantity: bookingData.requiredQuantity,
            },
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
            integration_identifier: 'nextgear_001',
        });
        return NextResponse.redirect(session.url as string, 303)
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
