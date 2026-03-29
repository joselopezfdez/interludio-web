import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { presets, presetPurchases } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }) {
    try {
        const { id: presetId } = await params;
        const headerList = await headers();
        const session = await auth.api.getSession({
            headers: headerList,
        });

        if (!session || !session.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const userId = session.user.id;

        // Verify purchase
        const purchase = await db.select()
            .from(presetPurchases)
            .where(and(
                eq(presetPurchases.userId, userId),
                eq(presetPurchases.presetId, presetId)
            ))
            .limit(1);

        if (purchase.length === 0) {
            return new NextResponse('No has adquirido este producto', { status: 403 });
        }

        // Fetch preset details to get file path
        const preset = await db.select()
            .from(presets)
            .where(eq(presets.id, presetId))
            .limit(1);

        if (preset.length === 0) {
            return new NextResponse('Preset no encontrado', { status: 404 });
        }

        const filePath = preset[0].filePath;
        
        // Resolve absolute path. Assuming storage/presets/ folder
        const absolutePath = path.resolve(process.cwd(), filePath);

        if (!fs.existsSync(absolutePath)) {
            console.error(`File NOT found: ${absolutePath}`);
            return new NextResponse('El archivo no existe en el servidor', { status: 404 });
        }

        const fileBuffer = fs.readFileSync(absolutePath);
        const fileName = path.basename(absolutePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });

    } catch (err: any) {
        console.error('Download Error:', err);
        return new NextResponse(err.message, { status: 500 });
    }
}
