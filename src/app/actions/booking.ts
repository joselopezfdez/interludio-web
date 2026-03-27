"use server";

import { db } from "@/db";
import { booking } from "@/db/schema";
import { and, lt, gt } from "drizzle-orm";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function getBookingsForDate(dateStr: string) {
    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await db.query.booking.findMany({
        where: and(
            gt(booking.endTime, startOfDay),
            lt(booking.startTime, endOfDay)
        )
    });

    // Return plain objects to avoid errors with Date passing to Client Components
    return bookings.map(b => ({
        id: b.id,
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
    }));
}

export async function createBooking(data: {
    name: string;
    email: string;
    phone?: string;
    details?: string;
    withEngineer?: boolean;
    startTime: string; // ISO string
    endTime: string; // ISO string
}) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (startTime >= endTime) {
        return { error: "La hora de inicio debe ser anterior a la de fin" };
    }

    const overlapping = await db.query.booking.findFirst({
        where: and(
            lt(booking.startTime, endTime),
            gt(booking.endTime, startTime)
        )
    });

    if (overlapping) {
        return { error: "El horario seleccionado ya no está disponible" };
    }

    const id = crypto.randomUUID();

    await db.insert(booking).values({
        id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        details: `Asistencia: ${data.withEngineer ? 'CON Técnico de Sonido' : 'SIN Técnico de Sonido'}\n${data.details ? '\nComentarios: ' + data.details : ''}`,
        startTime,
        endTime,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const startStr = startTime.toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" });
    const endStr = endTime.toLocaleString("es-ES", { timeStyle: "short" });

    const htmlContent = `
        <div style="font-family: sans-serif; background: #FFD1E3; padding: 40px; border-radius: 20px; color: #2D0A1F;">
            <h1 style="color: #FF1B8D; margin-bottom: 20px; text-transform: uppercase;">¡Reserva Confirmada!</h1>
            <p style="font-size: 16px; line-height: 1.6;">Hola ${data.name}, tu sesión en Interludio Studio ha sido reservada con éxito.</p>
            <div style="background: white; padding: 30px; border-radius: 15px; margin: 30px 0; border: 2px solid #FF1B8D;">
                <p><strong>Fecha y hora:</strong> ${startStr} - ${endStr}</p>
                <p><strong>Asistencia:</strong> ${data.withEngineer ? 'Estudio + Técnico de Sonido' : 'Solo Estudio (Sin Técnico)'}</p>
                ${data.details ? `<p><strong>Detalles:</strong> ${data.details}</p>` : ''}
            </div>
            <p style="font-size: 14px; opacity: 0.8;">Nos vemos pronto en el estudio.</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Interludio Studio" <${process.env.GMAIL_USER}>`,
            to: data.email,
            subject: "Confirmación de reserva - INTERLUDIO Studio",
            html: htmlContent
        });

        await transporter.sendMail({
            from: `"Interludio Studio" <${process.env.GMAIL_USER}>`,
            to: "cuentatradeos44@gmail.com",
            subject: `Nueva reserva: ${data.name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>Nueva Reserva en Interludio Studio</h2>
                    <p><strong>Nombre:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Teléfono:</strong> ${data.phone || 'No proporcionado'}</p>
                    <p><strong>Fecha y hora:</strong> ${startStr} - ${endStr}</p>
                    <p><strong>Opción elegida:</strong> ${data.withEngineer ? 'CON Técnico de Sonido' : 'SIN Técnico'}</p>
                    <p><strong>Detalles de la sesión:</strong> ${data.details || 'Ninguno'}</p>
                </div>
            `
        });
    } catch (e) {
        console.error("Error enviando email", e);
        // We still return success even if email fails, because booking is created in DB.
    }

    return { success: true };
}
