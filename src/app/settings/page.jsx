'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StudioNotification from '@/components/StudioNotification';

export default function SettingsPage() {
    const { data: session, isPending } = authClient.useSession();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('perfil'); // 'perfil', 'seguridad', 'info'
    const router = useRouter();

    // Password Change State
    const [passStep, setPassStep] = useState('idle'); // 'idle', 'otp', 'new_pass', 'loading'
    const [otpCode, setOtpCode] = useState('');
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
    const [passError, setPassError] = useState('');

    // Delete Account State
    const [delStep, setDelStep] = useState('idle'); // 'idle', 'otp', 'pass', 'loading'
    const [delOtp, setDelOtp] = useState('');
    const [delPass, setDelPass] = useState('');
    const [delError, setDelError] = useState('');

    useEffect(() => {
        if (session && !loading) {
            if (!name) setName(session.user.name || '');
            if (!image) setImage(session.user.image || '');
        }
    }, [session, loading]);

    const addNotification = (text, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, text, type }]);
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (isPending) return (
        <div className="min-h-screen bg-studio-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="font-black text-brand-primary tracking-widest animate-pulse uppercase">Cargando Estudio...</div>
            </div>
        </div>
    );

    if (!session) {
        router.push('/');
        return null;
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authClient.updateUser({
                name: name,
                image: image
            }, {
                onSuccess: () => {
                    addNotification('PERFIL ACTUALIZADO CON ÉXITO.', 'success');
                    router.refresh();
                },
                onError: (ctx) => {
                    addNotification(ctx.error.message || 'ERROR AL ACTUALIZAR.', 'error');
                }
            });
        } catch (err) {
            addNotification('OCURRIÓ UN ERROR INESPERADO.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- Password Change Logic ---
    const requestOtp = async () => {
        setLoading(true);
        setPassError('');
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: session.user.email,
                type: "email-verification"
            });
            if (error) {
                setPassError(error.message);
            } else {
                setPassStep('otp');
            }
        } catch (err) {
            setPassError('Error al enviar el código de seguridad.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPassError('');
        try {
            const { error } = await authClient.emailOtp.verifyEmail({
                email: session.user.email,
                otp: otpCode
            });
            if (error) {
                setPassError('Código incorrecto o expirado.');
            } else {
                setPassStep('new_pass');
            }
        } catch (err) {
            setPassError('Error de verificación.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.next !== passwords.confirm) {
            setPassError('Las contraseñas no coinciden.');
            return;
        }
        if (passwords.next.length < 8) {
            setPassError('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setLoading(true);
        setPassError('');
        try {
            const { error } = await authClient.changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.next,
                revokeOtherSessions: true
            });

            if (error) {
                setPassError(error.message || 'Error al cambiar la contraseña. Verifica la actual.');
            } else {
                addNotification('CONTRASEÑA ACTUALIZADA. SESIONES REINICIADAS.', 'success');
                setPassStep('idle');
                setPasswords({ current: '', next: '', confirm: '' });
                setOtpCode('');
            }
        } catch (err) {
            setPassError('Error crítico al cambiar contraseña.');
        } finally {
            setLoading(false);
        }
    };

    // --- Delete Account Logic ---
    const requestDeleteOtp = async () => {
        setLoading(true);
        setDelError('');
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: session.user.email,
                type: "email-verification"
            });
            if (error) {
                setDelError(error.message);
                addNotification('ERROR AL ENVIAR CÓDIGO.', 'error');
            } else {
                setDelStep('otp');
                addNotification('CÓDIGO DE ELIMINACIÓN ENVIADO.', 'success');
            }
        } catch (err) {
            setDelError('Error de red.');
        } finally {
            setLoading(false);
        }
    };

    const verifyDeleteOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setDelError('');
        try {
            const { error } = await authClient.emailOtp.verifyEmail({
                email: session.user.email,
                otp: delOtp
            });
            if (error) {
                setDelError('Código incorrecto.');
                addNotification('CÓDIGO INCORRECTO.', 'error');
            } else {
                setDelStep('pass');
            }
        } catch (err) {
            setDelError('Error de verificación.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteAccount = async (e) => {
        e.preventDefault();
        const confirmResult = window.confirm("¡ATENCIÓN CRÍTICA! ¿Estás absolutamente seguro? Esta acción borrará permanentemente todos tus datos de Laromusic Studio. NO SE PUEDE DESHACER.");

        if (!confirmResult) return;

        setLoading(true);
        try {
            const res = await fetch('/api/user/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: delPass })
            });

            const data = await res.json();

            if (res.ok) {
                addNotification('CUENTA ELIMINADA. ADIÓS...', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                setDelError(data.error || 'Autenticación fallida.');
                addNotification(data.error || 'ERROR AL ELIMINAR.', 'error');
            }
        } catch (err) {
            setDelError('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-transparent selection:bg-brand-primary selection:text-white">
            <Navbar />

            <main className="container mx-auto px-4 lg:px-8 pt-24 pb-20">
                <div className="max-w-6xl mx-auto">
                    {/* Dashboard Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-brand-primary/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-brand-primary/10">
                                    {image ? (
                                        <img src={image} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-black text-brand-primary/30 uppercase">
                                            {name ? name[0] : '?'}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-black text-white tracking-tighter leading-none">HOLA, {name.split(' ')[0].toUpperCase()}.</h1>
                                <div className="inline-flex mt-3 bg-white/10 px-3 py-1 rounded-full items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">ARTISTA VERIFICADO</span>
                                </div>
                            </div>
                        </div>


                        <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">MIEMBRO DESDE</p>
                            <p className="text-sm font-black text-brand-primary tracking-tight">{formatDate(session.user.createdAt)}</p>
                        </div>
                    </div>


                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Dashboard Sidebar */}
                        <aside className="lg:w-72 space-y-3">
                            {[
                                { id: 'perfil', label: 'Mi Perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                { id: 'seguridad', label: 'Seguridad', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                                { id: 'info', label: 'Información', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { id: 'cuenta', label: 'Eliminar Cuenta', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-xl font-black text-sm tracking-widest transition-all ${activeTab === tab.id
                                        ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} />
                                    </svg>
                                    {tab.label.toUpperCase()}
                                </button>
                            ))}
                        </aside>

                        {/* Dashboard Content */}
                        <div className="flex-1 min-h-[500px]">

                            <div className="bg-white/5 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 animate-fade-in-up">
                                {activeTab === 'perfil' && (
                                    <form onSubmit={handleUpdate} className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase">Ajustes de Perfil.</h2>
                                            <p className="text-sm font-bold opacity-60 text-white/60">Actualiza tu información pública de artista.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2">Nombre de Miembro</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/20 transition-all font-bold text-white placeholder:text-white/20"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Email (Solo lectura)</label>
                                                <input
                                                    type="email"
                                                    disabled
                                                    value={session.user.email}
                                                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-xl font-bold text-white/30 cursor-not-allowed"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2">Foto de Perfil</label>
                                                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-white">
                                                        {image ? (
                                                            <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-brand-primary/20">
                                                                {name ? name[0] : '?'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            id="avatar-upload"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    // Validaciones de seguridad
                                                                    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
                                                                    if (!allowedTypes.includes(file.type)) {
                                                                        addNotification('SOLO SE PERMITEN IMÁGENES (JPG, PNG, WEBP).', 'error');
                                                                        return;
                                                                    }
                                                                    if (file.size > 2 * 1024 * 1024) { // 2MB
                                                                        addNotification('EL ARCHIVO ES DEMASIADO GRANDE (MÁXIMO 2MB).', 'error');
                                                                        return;
                                                                    }

                                                                    setLoading(true);
                                                                    addNotification('PROCESANDO IMAGEN...', 'info');

                                                                    try {
                                                                        const reader = new FileReader();
                                                                        reader.onload = (event) => {
                                                                            const img = new Image();
                                                                            img.onload = () => {
                                                                                // Redimensionar usando Canvas para guardar en la Base de Datos gratuitamente
                                                                                const canvas = document.createElement('canvas');
                                                                                const MAX_WIDTH = 500;
                                                                                const MAX_HEIGHT = 500;
                                                                                let width = img.width;
                                                                                let height = img.height;

                                                                                if (width > height) {
                                                                                    if (width > MAX_WIDTH) {
                                                                                        height *= MAX_WIDTH / width;
                                                                                        width = MAX_WIDTH;
                                                                                    }
                                                                                } else {
                                                                                    if (height > MAX_HEIGHT) {
                                                                                        width *= MAX_HEIGHT / height;
                                                                                        height = MAX_HEIGHT;
                                                                                    }
                                                                                }
                                                                                canvas.width = width;
                                                                                canvas.height = height;
                                                                                const ctx = canvas.getContext('2d');
                                                                                ctx.drawImage(img, 0, 0, width, height);

                                                                                // Convertir a base64 (WebP, calidad media-alta para mantener bajo peso)
                                                                                const base64String = canvas.toDataURL('image/webp', 0.8);

                                                                                setImage(base64String);
                                                                                addNotification('FOTO LISTA. DEBES ACTUALIZAR EL PERFIL PARA GUARDAR.', 'success');
                                                                                setLoading(false);
                                                                            };
                                                                            img.src = event.target.result;
                                                                        };
                                                                        reader.onerror = () => {
                                                                            addNotification('ERROR AL LEER LA IMAGEN.', 'error');
                                                                            setLoading(false);
                                                                        };
                                                                        // Iniciamos la lectura como Base64
                                                                        reader.readAsDataURL(file);
                                                                    } catch (error) {
                                                                        addNotification('ERROR INESPERADO.', 'error');
                                                                        setLoading(false);
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor="avatar-upload"
                                                            className="inline-block px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-black text-[10px] text-white uppercase tracking-widest cursor-pointer hover:bg-brand-primary transition-all shadow-sm"
                                                        >
                                                            {loading ? 'Subiendo...' : 'Cambiar foto de perfil'}
                                                        </label>
                                                        <p className="text-[8px] font-bold opacity-40 uppercase tracking-tighter">Válido: JPG, PNG, WEBP | Máx 2MB.</p>
                                                    </div>
                                                </div>

                                                {/* Aviso de Confirmación */}
                                                {image !== session?.user?.image && !loading && (
                                                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl animate-pulse">
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5">
                                                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Cambio de foto pendiente</p>
                                                                <p className="text-[9px] font-bold text-orange-600/70 mt-1 uppercase">Has subido una nueva imagen a la nube, pero no se aplicará a tu perfil hasta que pulses "Actualizar Perfil" abajo.</p>
                                                            </div>
                                                            <div className="bg-orange-600 text-white text-[8px] font-black px-2 py-1 rounded-md tracking-tighter shadow-md shadow-orange-600/20">
                                                                PENDIENTE
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            disabled={loading}
                                            className={`w-full bg-white text-brand-primary py-5 rounded-xl font-black tracking-[0.3em] text-sm shadow-2xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90'}`}
                                        >
                                            {loading ? 'GUARDANDO...' : 'ACTUALIZAR PERFIL'}
                                        </button>
                                    </form>
                                )}

                                {activeTab === 'seguridad' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase">Seguridad de la Cuenta.</h2>
                                            <p className="text-sm font-bold opacity-60 text-white/60">Gestiona tus credenciales de acceso.</p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

                                            {passError && (
                                                <div className="mb-6 p-4 bg-red-100/10 text-red-400 text-xs font-black rounded-xl text-center border-2 border-red-500/20 uppercase tracking-wider">
                                                    {passError}
                                                </div>
                                            )}

                                            {passStep === 'idle' && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-14 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                        </svg>
                                                    </div>
                                                    <button
                                                        onClick={requestOtp}
                                                        disabled={loading}
                                                        className="w-full bg-brand-primary text-white py-5 rounded-xl font-black tracking-widest text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.95] transition-all"
                                                    >
                                                        {loading ? 'SOLICITANDO...' : 'CAMBIAR CONTRASEÑA'}
                                                    </button>
                                                </div>
                                            )}

                                            {passStep === 'otp' && (
                                                <form onSubmit={verifyOtp} className="space-y-4">
                                                    <p className="text-center text-[11px] font-bold bg-white/5 p-3 rounded-xl mb-4 border border-white/10 text-white/70">
                                                        Hemos enviado un código de 6 dígitos a <br />
                                                        <span className="text-brand-primary font-black uppercase">{session.user.email}</span>
                                                    </p>
                                                    <input
                                                        type="text"
                                                        placeholder="CÓDIGO"
                                                        maxLength={6}
                                                        value={otpCode}
                                                        onChange={(e) => setOtpCode(e.target.value)}
                                                        className="w-full px-6 py-6 bg-white/5 border-2 border-brand-primary/20 rounded-xl font-black text-brand-primary text-center text-3xl tracking-[0.5em] focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-primary/10"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPassStep('idle')}
                                                            className="flex-1 bg-white/5 py-4 rounded-xl font-black text-[10px] tracking-widest hover:bg-white/10 transition-all uppercase text-white/60"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-black text-[10px] tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-[1.05] transition-all uppercase"
                                                        >
                                                            {loading ? 'Verificando...' : 'Verificar Código'}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}

                                            {passStep === 'new_pass' && (
                                                <form onSubmit={handleChangePassword} className="space-y-4">
                                                    <div className="space-y-3">
                                                        <input
                                                            type="password"
                                                            placeholder="CONTRASEÑA ACTUAL"
                                                            value={passwords.current}
                                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                            className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-bold text-white focus:border-brand-primary focus:outline-none transition-all"
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="NUEVA CONTRASEÑA"
                                                            value={passwords.next}
                                                            onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                                                            className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-bold text-white focus:border-brand-primary focus:outline-none transition-all"
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="REPETIR NUEVA CONTRASEÑA"
                                                            value={passwords.confirm}
                                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                            className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-xl font-bold text-white focus:border-brand-primary focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full bg-brand-primary text-white py-5 rounded-xl font-black tracking-widest text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.95] transition-all uppercase"
                                                    >
                                                        {loading ? 'Actualizando...' : 'Confirmar Cambio de Contraseña'}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'info' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase">Información de tu cuenta</h2>
                                            <p className="text-sm font-bold opacity-60 text-white/60">Datos internos de tu cuenta en Laromusic.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { label: 'Estado de Email', value: session.user.emailVerified ? 'VERIFICADO' : 'PENDIENTE', color: session.user.emailVerified ? 'text-green-400' : 'text-orange-400' },
                                                { label: 'Rol de Usuario', value: 'ARTISTA ESTÁNDAR', color: 'text-brand-primary' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-sm">
                                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                                                    <p className={`text-xs font-black break-all ${item.color}`}>{item.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Seguridad de la Sesión</p>
                                            <div className="flex items-center justify-between text-[11px] font-bold text-white/40">
                                                <span>Sesión Activa</span>
                                                <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'cuenta' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase">Gestión de Cuenta.</h2>
                                            <p className="text-sm font-bold opacity-40 text-white uppercase tracking-tighter">Zona de configuración avanzada y seguridad.</p>
                                        </div>

                                        <div className="bg-white/5 p-8 rounded-xl border border-white/10 space-y-6">

                                            {delError && (
                                                <div className="p-4 bg-red-200 text-red-800 text-[10px] font-black rounded-xl text-center uppercase tracking-widest border-2 border-red-300 animate-shake">
                                                    {delError}
                                                </div>
                                            )}

                                            {delStep === 'idle' && (
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-4 text-white/40">
                                                        <div className="w-15 h-15 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-sm">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={requestDeleteOtp}
                                                        disabled={loading}
                                                        className="w-full bg-white/10 text-white/80 py-5 rounded-xl font-black tracking-[0.2em] text-[11px] border border-white/10 hover:bg-white/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                                                    >
                                                        {loading ? 'PROCESANDO...' : 'SOLICITAR ELIMINACIÓN TOTAL'}
                                                    </button>
                                                </div>
                                            )}

                                            {delStep === 'otp' && (
                                                <form onSubmit={verifyDeleteOtp} className="space-y-4 animate-fade-in-up">
                                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                                        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                                                            SEGURIDAD NIVEL 2: Código de email
                                                        </p>
                                                        <p className="text-[9px] font-bold opacity-40 mt-1 uppercase tracking-tighter text-white/50">Introduce el código para desbloquear el borrado</p>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="CÓDIGO"
                                                        maxLength={6}
                                                        value={delOtp}
                                                        onChange={(e) => setDelOtp(e.target.value)}
                                                        className="w-full px-6 py-6 bg-white/5 border-2 border-white/10 rounded-xl font-black text-white text-center text-4xl tracking-[0.5em] focus:border-brand-primary/50 focus:outline-none transition-all shadow-inner"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDelStep('idle')}
                                                            className="flex-1 bg-white/5 py-4 rounded-xl font-black text-[10px] tracking-widest text-white/60 border border-white/10 hover:bg-white/10 transition-all uppercase"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="flex-[2] bg-white text-brand-primary py-4 rounded-xl font-black text-[10px] tracking-widest hover:bg-white/90 transition-all uppercase"
                                                        >
                                                            {loading ? 'Verificando...' : 'Confirmar Identidad'}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}

                                            {delStep === 'pass' && (
                                                <form onSubmit={confirmDeleteAccount} className="space-y-4 animate-fade-in-up">
                                                    <div className="p-4 bg-white/10 text-white rounded-xl border border-white/10">
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-center">
                                                            ⚠️ CONFIRMACIÓN FINAL REQUERIDA
                                                        </p>
                                                        <p className="text-[9px] font-bold opacity-40 mt-1 uppercase tracking-tighter text-center">Introduce tu contraseña actual para autorizar el borrado inmediato</p>
                                                    </div>
                                                    <input
                                                        type="password"
                                                        placeholder="TU CONTRASEÑA ACTUAL"
                                                        value={delPass}
                                                        onChange={(e) => setDelPass(e.target.value)}
                                                        className="w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-xl font-black text-white tracking-widest focus:border-white focus:outline-none transition-all placeholder:text-white/20 text-center text-xl shadow-lg"
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full bg-red-500/80 text-white py-6 rounded-xl font-black tracking-[0.3em] text-[11px] border border-red-500/20 hover:bg-red-600 transition-all hover:scale-[1.02] active:scale-[0.95] shadow-2xl shadow-red-900/40"
                                                    >
                                                        {loading ? 'ELIMINANDO...' : 'ELIMINAR MI CUENTA AHORA'}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <StudioNotification
                notifications={notifications}
                removeNotification={removeNotification}
            />
        </div>
    );
}
