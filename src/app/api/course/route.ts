import { db } from "@/db";
import { courseChapter } from "@/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const chapters = await db.select().from(courseChapter).orderBy(asc(courseChapter.topic), asc(courseChapter.order));
        return new Response(JSON.stringify(chapters), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Error fetching course chapters" }), { status: 500 });
    }
}
