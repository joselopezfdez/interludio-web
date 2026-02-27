import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    user: {
        additionalFields: {
            isAdmin: {
                type: "boolean",
                required: false,
                defaultValue: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const { error } = await resend.emails.send({
                from: "Laromusic <onboarding@resend.dev>",
                to: [user.email],
                subject: "Verifica tu cuenta en Laromusic Studio",
                html: `
                    <div style="font-family: sans-serif; background: #FFD1E3; padding: 40px; border-radius: 20px; color: #2D0A1F;">
                        <h1 style="color: #FF1B8D; margin-bottom: 20px;">¡BIENVENIDO ARTISTA!</h1>
                        <p style="font-size: 16px; line-height: 1.6;">Gracias por unirte a nuestro estudio. Para empezar a crear, necesitamos verificar tu identidad.</p>
                        <div style="background: white; padding: 20px; border-radius: 15px; margin: 30px 0; text-align: center;">
                            <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Tu código de verificación es:</p>
                            <h2 style="font-size: 32px; letter-spacing: 5px; color: #FF1B8D; margin: 0;">${token}</h2>
                        </div>
                        <p style="font-size: 12px; opacity: 0.6;">Si prefieres verificar pulsando un botón, puedes hacerlo aquí:</p>
                        <a href="${url}" style="background: #FF1B8D; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 10px;">VERIFICAR AHORA</a>
                    </div>
                `
            });
            if (error) {
                console.error("Error sending verification email:", error);
            }
        }
    }
});
