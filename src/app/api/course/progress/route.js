import { auth } from "@/lib/auth";
import { db } from "@/db";
import { courseProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import crypto from "crypto";

export async function GET(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const progress = await db.select().from(courseProgress)
            .where(eq(courseProgress.userId, session.user.id));
        return Response.json({ success: true, progress });
    } catch (error) {
        console.error("Fetch progress error:", error);
        return Response.json({ error: "Error al cargar progreso" }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { lessonId, completed } = await req.json();

    if (!lessonId) {
        return Response.json({ error: "Missing lessonId" }, { status: 400 });
    }

    try {
        const existing = await db.select().from(courseProgress)
            .where(and(
                eq(courseProgress.userId, session.user.id),
                eq(courseProgress.lessonId, lessonId)
            ));

        if (existing.length > 0) {
            await db.update(courseProgress)
                .set({
                    completed: completed !== undefined ? completed : existing[0].completed,
                    updatedAt: new Date(),
                })
                .where(eq(courseProgress.id, existing[0].id));
        } else {
            await db.insert(courseProgress).values({
                id: crypto.randomUUID(),
                userId: session.user.id,
                lessonId,
                completed: completed || false,
                currentProgress: 0,
                updatedAt: new Date(),
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Save progress error:", error);
        return Response.json({ error: "Error al guardar progreso" }, { status: 500 });
    }
}
