'use client';

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/animations/Reveal";

export default function AdminCoursesPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    const [topic, setTopic] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [order, setOrder] = useState("");

    // Bunny.net upload states
    const [videoFile, setVideoFile] = useState(null);
    const [uploadingText, setUploadingText] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!isPending && session) {
            if (session.user.role !== 'owner') {
                router.push('/admin/dashboard');
            } else {
                fetchChapters();
            }
        }
    }, [session, isPending, router]);

    const fetchChapters = async () => {
        try {
            const res = await fetch('/api/admin/courses');
            const data = await res.json();
            setChapters(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Error fetching chapters:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        let finalVideoUrl = videoUrl;

        // If a file is selected, upload it to Bunny.net via our intermediate API
        if (videoFile) {
            setIsCreating(true);
            setUploadingText("Preparando archivo...");

            try {
                // Request presigned URL or direct upload via NextJS API
                // For a 100% secure way we shouldn't expose the API KEY in the client.
                // We will send the file to our local server first (or use a signed flow)
                // For simplicity as requested, we will upload it via our API route

                const formData = new FormData();
                formData.append("file", videoFile);

                setUploadingText("Subiendo a Bunny.net (Puede tardar minutos)...");
                const uploadRes = await fetch("/api/admin/bunny-upload", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadRes.json();

                if (uploadData.success && uploadData.url) {
                    finalVideoUrl = uploadData.url;
                } else if (uploadData.error === "storage_zone_error") {
                    alert(uploadData.message);
                    setIsCreating(false);
                    setUploadingText("");
                    return;
                } else {
                    alert("Error subiendo a Bunny: " + (uploadData.error || "Desconocido"));
                    setIsCreating(false);
                    setUploadingText("");
                    return;
                }
            } catch (err) {
                console.error("Error al subir:", err);
                alert("Error de red al subir el video.");
                setIsCreating(false);
                setUploadingText("");
                return;
            }
        }

        if (!finalVideoUrl && !videoFile) {
            alert("Debes proporcionar una URL directa o subir un video.");
            return;
        }

        setUploadingText("Guardando en Base de Datos...");
        setIsCreating(true);
        try {
            const res = await fetch('/api/admin/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    title,
                    description,
                    duration,
                    videoUrl: finalVideoUrl,
                    order: parseInt(order) || 0
                })
            });
            if (res.ok) {
                setTopic("");
                setTitle("");
                setDescription("");
                setDuration("");
                setVideoUrl("");
                setOrder("");
                setVideoFile(null);
                fetchChapters();
            } else {
                alert("Error al crear. URL o datos incorrectos.");
            }
        } catch (e) {
            alert("Error de red");
        } finally {
            setIsCreating(false);
            setUploadingText("");
        }
    };

    const handleDelete = async (id) => {
        const confirmResult = window.confirm("¿Seguro que quieres borrar este capítulo de forma permanente?");
        if (!confirmResult) return;

        try {
            const res = await fetch('/api/admin/courses', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                fetchChapters();
            } else {
                alert("Error al borrar capítulo.");
            }
        } catch (e) {
            alert("Error al borrar capítulo.");
        }
    };

    if (isPending || loading) {
        return <div className="p-10 text-white opacity-50 uppercase tracking-widest text-xs font-black">Cargando módulos...</div>;
    }

    return (
        <section>
            <Reveal>
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">
                        Gesti{'\u00f3'}n de <span className="text-brand-primary italic">Cursos.</span>
                    </h1>
                    <p className="opacity-50 text-sm mt-2 uppercase tracking-widest">Administra los módulos y videos (Solo Propietario)</p>
                </div>
            </Reveal>

            <Reveal delay={0.1}>
                <div className="bg-[#151515] border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-xl mb-10">
                    <h2 className="text-xl font-black mb-8 tracking-tighter uppercase text-brand-secondary">Agregar Nuevo Capítulo</h2>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                placeholder="Tema o Módulo (Ej. Fundamentos de Mezcla)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                required
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs uppercase focus:border-brand-primary focus:outline-none transition-all placeholder:text-white/20"
                            />
                            <input
                                type="text"
                                placeholder="Título de la lección (Ej. Compresión Básica)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs uppercase focus:border-brand-primary focus:outline-none transition-all placeholder:text-white/20"
                            />
                            <div className="md:col-span-2">
                                <textarea
                                    placeholder="Descripción corta de lo que trata el video"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs focus:border-brand-primary focus:outline-none transition-all placeholder:text-white/20 resize-none"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Duración (Ej. 12:45)"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs uppercase focus:border-brand-primary focus:outline-none transition-all placeholder:text-white/20"
                            />
                            <input
                                type="number"
                                placeholder="Orden (Ej. 1)"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs uppercase focus:border-brand-primary focus:outline-none transition-all placeholder:text-white/20"
                            />
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black tracking-widest uppercase opacity-50 block mb-2">Video de la lección (Elige archivo O pon enlace directo)</label>

                                <div className="p-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl relative hover:bg-white/10 transition-colors">
                                    <input
                                        type="file"
                                        accept="video/mp4,video/webm"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setVideoFile(e.target.files[0]);
                                                setVideoUrl(""); // Clear manual url if file selected
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="text-center pointer-events-none">
                                        <svg className="w-8 h-8 text-brand-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-xs font-bold text-white tracking-widest uppercase">
                                            {videoFile ? `Seleccionado: ${videoFile.name}` : "Click para subir video a Bunny.net (.mp4)"}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center opacity-30 text-[10px] font-black uppercase tracking-widest">--- O ---</div>

                                <input
                                    type="text"
                                    placeholder="Link / URL directa al archivo de video (Ej. https://miservidor.com/video.mp4)"
                                    value={videoUrl}
                                    onChange={(e) => {
                                        setVideoUrl(e.target.value);
                                        setVideoFile(null); // Clear selected file if manual url typed
                                    }}
                                    disabled={!!videoFile}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white tracking-widest text-xs uppercase focus:border-brand-primary focus:outline-none transition-all placeholder:text-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="bg-brand-primary text-white py-4 px-8 rounded-xl font-black text-xs tracking-[0.2em] shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase"
                        >
                            {isCreating ? (uploadingText || 'CREANDO...') : 'CREAR CAPÍTULO'}
                        </button>
                    </form>
                </div>
            </Reveal>

            <Reveal delay={0.2}>
                <div className="bg-[#151515] border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-xl">
                    <h2 className="text-xl font-black mb-8 tracking-tighter uppercase text-white">Capítulos Existentes</h2>

                    {chapters.length === 0 ? (
                        <p className="text-white/40 text-xs font-bold tracking-widest uppercase">No hay capítulos creados todavía.</p>
                    ) : (
                        <div className="space-y-4">
                            {chapters.map(chapter => (
                                <div key={chapter.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-3 py-1 rounded-full font-black tracking-widest uppercase">{chapter.topic}</span>
                                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Orden: {chapter.order}</span>
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight text-white mb-2">{chapter.title}</h3>
                                        <p className="text-xs text-brand-secondary underline mb-2 break-all">{chapter.videoUrl}</p>
                                        <p className="text-[11px] text-white/50">{chapter.description || 'Sin descripción'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{chapter.duration}</span>
                                        <button
                                            onClick={() => handleDelete(chapter.id)}
                                            className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-red-500/20 hover:scale-[1.05] transition-all"
                                        >
                                            BORRAR
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Reveal>
        </section>
    );
}
