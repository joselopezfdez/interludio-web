'use client';

import { Reveal } from "@/components/animations/Reveal";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage({ users }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [editName, setEditName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setEditName(user.name);
        setIsDeleting(false);
        setMessage(null);
    };

    const handleUpdateName = async () => {
        if (!editName || editName === selectedUser.name) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Nombre actualizado correctamente' });
                router.refresh();
                setTimeout(() => setSelectedUser(null), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al actualizar' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Usuario eliminado correctamente' });
                router.refresh();
                setTimeout(() => setSelectedUser(null), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al eliminar' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <Reveal>
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        GESTIÓN DE <span className="text-brand-primary italic">USUARIOS.</span>
                    </h1>
                    <p className="opacity-50 text-sm mt-2 uppercase tracking-widest">Administra los accesos y roles del estudio</p>
                </div>
            </Reveal>

            {/* Desktop Table View */}
            <Reveal delay={0.2}>
                <div className="hidden lg:block bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Usuario</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Email</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Verificación</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Rol</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    onClick={() => handleOpenModal(u)}
                                    className="border-b border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer"
                                >
                                    <td className="px-8 py-5 flex items-center gap-4 font-bold">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-[10px] shadow-inner">
                                            {u.image ? (
                                                <img src={u.image} className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <span className="text-brand-primary font-black">{u.name[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                        <span className="tracking-tight text-white/90 group-hover:text-brand-primary transition-colors">{u.name}</span>
                                    </td>
                                    <td className="px-8 py-5 opacity-60 font-bold font-mono text-[11px]">{u.email}</td>
                                    <td className="px-8 py-5">
                                        {u.emailVerified ? (
                                            <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">VERIFICADO</span>
                                        ) : (
                                            <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">PENDIENTE</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        {u.isAdmin ? (
                                            <span className="text-[9px] bg-brand-primary text-black px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-brand-primary/10">ADMIN</span>
                                        ) : (
                                            <span className="text-[9px] bg-white/5 text-white/40 border border-white/10 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">CLIENTE</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 opacity-30 text-[10px] font-black uppercase tracking-widest">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Reveal>

            {/* Mobile / Tablet List View */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
                {users.map((u, index) => (
                    <Reveal key={u.id} delay={index * 0.05}>
                        <div
                            onClick={() => handleOpenModal(u)}
                            className="bg-[#151515] border border-white/5 p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-black text-brand-primary">
                                    {u.image ? (
                                        <img src={u.image} className="w-full h-full object-cover rounded-full" />
                                    ) : u.name[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white tracking-tight">{u.name}</span>
                                    {u.isAdmin && <span className="text-[8px] text-brand-primary font-black uppercase tracking-widest">ADMIN</span>}
                                </div>
                            </div>
                            <svg className="w-5 h-5 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-up">
                        <div className="relative p-8 text-center border-b border-white/5 bg-gradient-to-b from-brand-primary/10 to-transparent">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <div className="w-24 h-24 rounded-full bg-brand-primary/20 border-4 border-brand-primary/30 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-brand-primary shadow-2xl">
                                {selectedUser.image ? (
                                    <img src={selectedUser.image} className="w-full h-full object-cover rounded-full" />
                                ) : selectedUser.name[0].toUpperCase()}
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter text-white">{selectedUser.name.toUpperCase()}</h3>
                            <p className="text-brand-primary/60 text-[10px] font-black tracking-[0.3em] uppercase mt-1">
                                {selectedUser.isAdmin ? 'Administrador' : 'Cliente Registrado'}
                            </p>
                        </div>

                        <div className="p-8 space-y-6">
                            {message && (
                                <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] ml-1">Editar Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-brand-primary transition-all"
                                        placeholder="Nombre del usuario"
                                    />
                                    {editName !== selectedUser.name && (
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={loading}
                                            className="w-full bg-brand-primary text-black py-3 rounded-xl font-black text-[10px] tracking-widest uppercase hover:opacity-90 disabled:opacity-50 transition-all"
                                        >
                                            {loading ? 'GUARDANDO...' : 'GUARDAR NOMBRE'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] ml-1">Correo Electrónico</span>
                                    <span className="text-sm font-bold text-white/60 break-all bg-white/5 px-5 py-3 rounded-xl">{selectedUser.email}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] block mb-1">Estado Cuenta</span>
                                        {selectedUser.emailVerified ? (
                                            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Verificado</span>
                                        ) : (
                                            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Pendiente</span>
                                        )}
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-right">
                                        <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] block mb-1">Fecha Registro</span>
                                        <span className="text-[9px] font-bold text-white/70 uppercase">
                                            {new Date(selectedUser.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                {!isDeleting ? (
                                    <button
                                        onClick={() => setIsDeleting(true)}
                                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all"
                                    >
                                        ELIMINAR CUENTA
                                    </button>
                                ) : (
                                    <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 space-y-3 animate-shake">
                                        <p className="text-[9px] font-black text-red-400 uppercase text-center tracking-widest">¿ESTÁS SEGURO? ESTA ACCIÓN ES IRREVERSIBLE</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsDeleting(false)}
                                                className="flex-1 bg-white/5 text-white/60 py-3 rounded-xl font-bold text-[10px] uppercase"
                                            >
                                                CANCELAR
                                            </button>
                                            <button
                                                onClick={handleDeleteUser}
                                                disabled={loading}
                                                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-red-500/20"
                                            >
                                                {loading ? 'BORRANDO...' : 'SÍ, BORRAR'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all"
                                >
                                    CERRAR PANEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
