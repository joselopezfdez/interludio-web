import { db } from "@/db";
import { user } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Reveal } from "@/components/animations/Reveal";

export default async function AdminDashboard() {
    // Obtener estadísticas rápidas
    const totalUsers = await db.select({ value: count() }).from(user);
    const totalAdmins = await db.select({ value: count() }).from(user).where(eq(user.isAdmin, true));

    return (
        <section>
            <Reveal>
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        BIENVENIDO, <span className="text-brand-primary italic">ADMIN.</span>
                    </h1>
                    <p className="opacity-50 text-sm mt-2 uppercase tracking-widest">Resumen general del estudio</p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Reveal delay={0.1}>
                    <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem] shadow-xl">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-3">Total Usuarios</p>
                        <p className="text-5xl font-black text-brand-primary tracking-tighter">{totalUsers[0].value}</p>
                    </div>
                </Reveal>
                <Reveal delay={0.2}>
                    <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem] shadow-xl">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-3">Administradores</p>
                        <p className="text-5xl font-black text-brand-primary tracking-tighter">{totalAdmins[0].value}</p>
                    </div>
                </Reveal>
                <Reveal delay={0.3}>
                    <div className="bg-[#151515] border border-white/5 p-8 rounded-[2rem] shadow-xl">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-3">Estado Sistema</p>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                            <p className="text-2xl font-black uppercase tracking-tighter">Online</p>
                        </div>
                    </div>
                </Reveal>
            </div>

            <Reveal delay={0.4}>
                <div className="bg-[#151515] border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-xl">
                    <h2 className="text-xl font-black mb-8 tracking-tighter uppercase">Actividad reciente</h2>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-4 px-6 bg-white/[0.02] rounded-2xl border border-white/5">
                            <span className="text-xs font-bold uppercase opacity-80 tracking-wide">Sistema de admin configurado</span>
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">RECIÉN AHORA</span>
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
