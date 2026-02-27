import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    try {
        const headerList = await headers();
        const session = await auth.api.getSession({
            headers: headerList,
        });

        if (!session || !session.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { planName, priceAmount, interval } = await req.json();

        // In a real app, you would have Price IDs from Stripe.
        // Here we'll create a session with line_items using price_data for simplicity
        // though for subscriptions it's better to use pre-created prices.

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Suscripción Interludio Academy - ${planName}`,
                        },
                        unit_amount: priceAmount * 100, // in cents
                        recurring: interval === 'month' ? { interval: 'month' } : undefined,
                    },
                    quantity: 1,
                },
            ],
            mode: interval === 'month' ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/estudio/privado?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/estudio?canceled=true`,
            metadata: {
                userId: session.user.id,
                planName: planName,
            },
            customer_email: session.user.email,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return new NextResponse(err.message, { status: 500 });
    }
}
