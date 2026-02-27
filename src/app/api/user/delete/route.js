import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req) {
    const authSession = await auth.api.getSession({
        headers: await headers()
    });

    if (!authSession) {
        return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { password } = await req.json();

    if (!password) {
        return Response.json({ error: "Contraseña requerida" }, { status: 400 });
    }

    try {
        // Verificar contraseña usando la API de better-auth internamente
        // Nota: checkPassword no es parte de la API pública de better-auth directamente en todos los sitios, 
        // pero podemos intentar usar signIn con las credenciales actuales para validar
        const verify = await auth.api.signInEmail({
            body: {
                email: authSession.user.email,
                password: password
            }
        }).catch(() => null);

        if (!verify) {
            return Response.json({ error: "Contraseña incorrecta" }, { status: 400 });
        }

        const userId = authSession.user.id;

        // Borrado en cascada manual de todas las tablas relacionadas
        await db.delete(session).where(eq(session.userId, userId));
        await db.delete(account).where(eq(account.userId, userId));
        await db.delete(user).where(eq(user.id, userId));
        // Nota: verification se asocia por identificador (email), pero no siempre es necesario borrarlo
        // ya que caducan solos, pero por limpieza:
        await db.delete(verification).where(eq(verification.identifier, authSession.user.email));

        return Response.json({ success: true });
    } catch (error) {
        console.error("Delete account error:", error);
        return Response.json({ error: "Error interno al procesar la eliminación" }, { status: 500 });
    }
}
