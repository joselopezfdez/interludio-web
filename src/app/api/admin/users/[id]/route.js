import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function PATCH(req, { params }) {
    const authSession = await auth.api.getSession({
        headers: await headers()
    });

    if (!authSession || !authSession.user.isAdmin) {
        return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { name } = await req.json();

    if (!name) {
        return Response.json({ error: "Nombre requerido" }, { status: 400 });
    }

    try {
        await db.update(user)
            .set({ name })
            .where(eq(user.id, id));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Admin update user error:", error);
        return Response.json({ error: "Error al actualizar el usuario" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const authSession = await auth.api.getSession({
        headers: await headers()
    });

    if (!authSession || !authSession.user.isAdmin) {
        return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    try {
        // Obtener el usuario antes de borrarlo para tener su email
        const targetUser = await db.select().from(user).where(eq(user.id, id)).then(res => res[0]);
        
        if (!targetUser) {
            return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        // Borrar sesiones, cuentas y verificaciones primero (integridad referencial)
        await db.delete(session).where(eq(session.userId, id));
        await db.delete(account).where(eq(account.userId, id));
        // Si hay una tabla de verificación que use el email, la limpiamos
        await db.delete(verification).where(eq(verification.identifier, targetUser.email));
        
        await db.delete(user).where(eq(user.id, id));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Admin delete user error:", error);
        return Response.json({ error: "Error al eliminar el usuario" }, { status: 500 });
    }
}
