import { NextResponse } from 'next/server';
import { db } from '@/db';
import { presets } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const allPresets = await db.select().from(presets).orderBy(desc(presets.createdAt));
        return NextResponse.json(allPresets);
    } catch (err) {
        console.error('Error fetching presets:', err);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
