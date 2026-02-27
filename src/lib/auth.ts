import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import nodemailer from "nodemailer";
import { emailOTP } from "better-auth/plugins";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

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
            },
            role: {
                type: "string",
                required: false,
                defaultValue: "user"
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    plugins: [
        emailOTP({
            sendVerificationOnSignUp: true,
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                const mailOptions = {
                    from: `"Interludio Studio" <${process.env.GMAIL_USER}>`,
                    to: email,
                    subject: "Código de verificación - INTERLUDIO Studio",
                    html: `
                        <div style="font-family: sans-serif; background: #FFD1E3; padding: 40px; border-radius: 20px; color: #2D0A1F;">
                            <h1 style="color: #FF1B8D; margin-bottom: 20px; text-transform: uppercase;">¡Verifica tu cuenta!</h1>
                            <p style="font-size: 16px; line-height: 1.6;">Estás a un paso de entrar en el estudio. Confirma tu email con este código:</p>
                            <div style="background: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center; border: 2px solid #FF1B8D;">
                                <h2 style="font-size: 42px; letter-spacing: 15px; color: #FF1B8D; margin: 0; font-weight: 900;">${otp}</h2>
                            </div>
                            <p style="font-size: 12px; opacity: 0.6; text-align: center;">Este código caducará en 5 minutos.</p>
                        </div>
                    `
                };

                try {
                    await transporter.sendMail(mailOptions);
                } catch (error) {
                    console.error("Error sending OTP email with Nodemailer:", error);
                }
            }
        })
    ]
});
