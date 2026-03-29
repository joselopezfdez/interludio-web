import { NextResponse } from 'next/server';
import { db } from '@/db';
import { presets, presetPurchases } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const headerList = await headers();
        const session = await auth.api.getSession({
            headers: headerList,
        });

        if (!session || !session.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const userId = session.user.id;

        // Get all purchase records for this user
        const purchases = await db.select()
            .from(presetPurchases)
            .where(eq(presetPurchases.userId, userId));

        if (purchases.length === 0) {
            return NextResponse.json([]);
        }

        const presetIds = purchases.map(p => p.presetId);

        // Fetch preset details for these IDs
        const purchasedPresets = await db.select()
            .from(presets)
            .where(inArray(presets.id, presetIds));

        return NextResponse.json(purchasedPresets);
    } catch (err) {
        console.error('Error fetching purchased presets:', err);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
