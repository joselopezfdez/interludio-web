import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Constants for Bunny.net Stream
const BUNNY_API_KEY = "6bf348d5-2e36-4f54-aabd49b16fb9-d0ea-4d72";
const LIBRARY_ID = "605203";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== 'owner') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 1. Create the video entry in Bunny Stream API
        const createRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
            method: 'POST',
            headers: {
                'AccessKey': BUNNY_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ title: file.name })
        });

        if (!createRes.ok) {
            const errorText = await createRes.text();
            return NextResponse.json({
                error: "stream_create_error",
                message: "Error conectando con Bunny Stream. Verifica tu API Key y Library ID.",
                details: errorText
            }, { status: 500 });
        }

        const createData = await createRes.json();
        const videoId = createData.guid;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Upload video binary data to Bunny Stream API
        const uploadRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`, {
            method: 'PUT',
            headers: {
                "AccessKey": BUNNY_API_KEY,
                "Content-Type": file.type || 'application/octet-stream',
            },
            body: buffer
        });

        if (!uploadRes.ok) {
            const errorText = await uploadRes.text();
            return NextResponse.json({
                error: "stream_upload_error",
                message: "Error al subir el archivo al Stream de Bunny.",
                details: errorText
            }, { status: 500 });
        }

        // Return the secure embed URL for the player
        const url = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;

        return NextResponse.json({ success: true, url });

    } catch (error: any) {
        console.error("Bunny upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
