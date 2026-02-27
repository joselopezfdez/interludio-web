import { db } from "@/db";
import { courseChapter } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq, asc } from "drizzle-orm";

export async function GET(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== 'owner') {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const chapters = await db.select().from(courseChapter).orderBy(asc(courseChapter.topic), asc(courseChapter.order));
        return new Response(JSON.stringify(chapters), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Error fetching" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== 'owner') {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const body = await req.json();
        const { topic, title, description, duration, videoUrl, order } = body;

        const id = crypto.randomUUID();
        await db.insert(courseChapter).values({
            id,
            topic,
            title,
            description,
            duration: duration || "00:00",
            videoUrl,
            order: order || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return new Response(JSON.stringify({ success: true, id }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Error creating" }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== 'owner') {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const body = await req.json();
        const { id } = body;

        if (!id) return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });

        await db.delete(courseChapter).where(eq(courseChapter.id, id));

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Error deleting" }), { status: 500 });
    }
}
