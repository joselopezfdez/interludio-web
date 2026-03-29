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

        const { cartItems } = await req.json();

        if (!cartItems || cartItems.length === 0) {
            return new NextResponse('Cart is empty', { status: 400 });
        }

        const line_items = cartItems.map((item: any) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    description: item.description || '',
                    images: item.image ? [item.image] : [],
                },
                unit_amount: item.price, // Already in cents
            },
            quantity: 1,
        }));

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/presets/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/presets?canceled=true`,
            metadata: {
                userId: session.user.id,
                presetIds: JSON.stringify(cartItems.map((i: any) => i.id)),
                type: 'presets_purchase'
            },
            customer_email: session.user.email,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (err: any) {
        console.error('Stripe Presets Checkout Error:', err);
        return new NextResponse(err.message, { status: 500 });
    }
}
