import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/db';
import { user, presetPurchases } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import crypto from 'crypto';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
            const purchaseType = session.metadata?.type;

            if (purchaseType === 'presets_purchase') {
                const presetIds = JSON.parse(session.metadata?.presetIds || '[]');
                
                // Record each preset purchase
                for (const presetId of presetIds) {
                    await db.insert(presetPurchases).values({
                        id: crypto.randomUUID(),
                        userId,
                        presetId,
                        stripeSessionId: session.id,
                        createdAt: new Date(),
                    });
                }
                console.log(`User ${userId} purchased presets: ${presetIds.join(', ')}`);
            } else {
                // Default handling for subscriptions (upgrading to alumno)
                await db.update(user)
                    .set({ role: 'alumno' })
                    .where(eq(user.id, userId));
                console.log(`User ${userId} upgraded to alumno`);
            }
        }

    }

    return new NextResponse(null, { status: 200 });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
