'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Reveal } from '@/components/animations/Reveal';

export default function AcademiaPrivada() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [completedLessons, setCompletedLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [academyModules, setAcademyModules] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const saveProgressToDB = async (lessonId, isCompleted) => {
        if (!session) return;
        try {
            await fetch('/api/course/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId,
                    completed: isCompleted
                })
            });
        } catch (err) {
            console.error("Error saving progress", err);
        }
    };

    // Load courses from DB
    useEffect(() => {
        const loadCourses = async () => {
            try {
                const res = await fetch('/api/course');
                const data = await res.json();

                // Agrupar por tema (topic)
                const moduleMap = {};
                data.forEach(chap => {
                    if (!moduleMap[chap.topic]) {
                        moduleMap[chap.topic] = {
                            id: chap.topic,
                            title: chap.topic,
                            lessons: []
                        };
                    }
                    moduleMap[chap.topic].lessons.push(chap);
                });

                setAcademyModules(Object.values(moduleMap));
            } catch (err) {
                console.error("Error loading courses from DB", err);
            } finally {
                setLoadingCourses(false);
            }
        };

        if (session) {
            loadCourses();
        }
    }, [session]);

    // Initial load of completed lessons from DB
    useEffect(() => {
        const loadProgress = async () => {
            if (!session) return;
            try {
                const res = await fetch('/api/course/progress');
                const data = await res.json();
                if (data.success && data.progress) {
                    const completed = Array.from(new Set(data.progress.filter(p => p.completed).map(p => p.lessonId)));
                    setCompletedLessons(completed);
                }
            } catch (err) {
                console.error("Error loading progress", err);
            }
        };
        loadProgress();
    }, [session]);

    // Effect to check session and roles
    useEffect(() => {
        if (!isPending && !session) {
            router.push('/estudio');
        } else if (!isPending && session && session.user.role !== 'owner' && session.user.role !== 'alumno' && !session.user.isAdmin) {
            router.push('/estudio');
        }
    }, [session, isPending, router]);

    // Calculate progress whenever completedLessons changes
    useEffect(() => {
        let totalLessons = 0;
        academyModules.forEach(mod => {
            totalLessons += mod.lessons.length;
        });

        if (totalLessons === 0) {
            setProgress(0);
        } else {
            const uniqueCompletedCount = new Set(completedLessons).size;
            const calcProgress = Math.min(100, Math.round((uniqueCompletedCount / totalLessons) * 100));
            setProgress(calcProgress);
        }
    }, [completedLessons, academyModules]);

    const handleLessonSelect = (lesson, isLocked) => {
        if (isLocked) return;
        setSelectedLesson(lesson);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const markAsCompleted = () => {
        if (!selectedLesson) return;
        if (!completedLessons.includes(selectedLesson.id)) {
            setCompletedLessons(prev => {
                const next = [...prev, selectedLesson.id];
                saveProgressToDB(selectedLesson.id, true);
                return next;
            });
        }
    };

    const checkIsLocked = (lessonId) => {
        // Todas las lecciones desbloqueadas según petición
        return false;
    };

    if (isPending || !session || loadingCourses) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0d0d0d] selection:bg-brand-primary selection:text-white pb-32">
            <Navbar />

            <section className="pt-40 pb-20 relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
                        <Reveal>
                            <div className="flex flex-col gap-4">
                                <span className="text-brand-secondary font-black text-xs tracking-[0.5em] uppercase italic">Plataforma Educativa</span>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                                    INTERLUDIO <br />
                                    <span className="text-brand-secondary italic">ACADEMY</span>
                                </h1>
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] w-full lg:w-96">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black tracking-widest uppercase opacity-40">TU PROGRESO</span>
                                    <span className="text-2xl font-black text-brand-secondary">{progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] mt-4 opacity-40 font-bold uppercase tracking-widest">
                                    {completedLessons.length} de {academyModules.reduce((acc, m) => acc + m.lessons.length, 0)} LECCIONES COMPLETADAS
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="space-y-16">
                        {academyModules.length === 0 ? (
                            <div className="text-white/40 uppercase font-black tracking-widest p-10 text-center border border-white/10 rounded-3xl bg-white/5">
                                AÚN NO HAY CURSOS DISPONIBLES EN PLATAFORMA.
                            </div>
                        ) : academyModules.map((module, mIdx) => (
                            <Reveal key={module.id} delay={mIdx * 0.1}>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black uppercase text-xs tracking-widest">
                                            {mIdx + 1}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">{module.title}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {module.lessons.map((lesson, idx) => {
                                            const isDone = completedLessons.includes(lesson.id);
                                            const isLocked = checkIsLocked(lesson.id);

                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => handleLessonSelect(lesson, isLocked)}
                                                    className={`group w-full flex items-center justify-between p-6 md:p-8 rounded-3xl border transition-all duration-500 overflow-hidden relative ${isLocked ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed' :
                                                        isDone ? 'bg-brand-primary/10 border-brand-primary/30 hover:border-brand-primary/60' :
                                                            'bg-white/5 border-white/10 hover:bg-white/10 hover:border-brand-secondary/40'
                                                        }`}
                                                >
                                                    {/* Glow effect on hover */}
                                                    {!isLocked && (
                                                        <div className="absolute inset-0 bg-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}

                                                    <div className="flex items-center gap-6 relative z-10">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20' :
                                                            isLocked ? 'bg-white/10 text-white/20' :
                                                                'bg-white/10 text-white group-hover:bg-brand-secondary group-hover:text-white'
                                                            }`}>
                                                            {isDone ? (
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : isLocked ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-[10px] font-black">{idx + 1}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <h4 className={`text-lg font-bold tracking-tight transition-colors uppercase ${isLocked ? 'text-white/40' : 'text-white group-hover:text-brand-secondary'}`}>
                                                                {lesson.title}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-[9px] font-black tracking-widest uppercase opacity-40">
                                                                <span>DURACIÓN: {lesson.duration}</span>
                                                                {isLocked && <span className="text-red-400">BLOQUEADO</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="relative z-10">
                                                        {isLocked ? (
                                                            <div className="px-4 py-2 rounded-xl bg-white/5 text-[9px] font-black tracking-widest uppercase opacity-30 border border-white/10">
                                                                BLOQUEADO
                                                            </div>
                                                        ) : (
                                                            <div className={`px-6 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all ${isDone ? 'bg-brand-primary text-white' : 'bg-brand-secondary text-white group-hover:scale-105 shadow-lg shadow-brand-secondary/20'
                                                                }`}>
                                                                {isDone ? 'REVISAR' : 'VER LECCIÓN'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {isModalOpen && selectedLesson && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fade-in" onClick={closeModal}></div>
                    <div className="relative w-full max-w-5xl bg-[#111] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-zoom-in">
                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <span className="text-brand-secondary font-black text-[10px] tracking-widest uppercase italic block mb-2">LECTURA ACTUAL</span>
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">{selectedLesson.title}</h3>
                                </div>
                                <button onClick={closeModal} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/10 z-50">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                                <div className="lg:col-span-2">
                                    <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
                                        {selectedLesson.videoUrl && selectedLesson.videoUrl.includes("iframe.mediadelivery.net") ? (
                                            <iframe
                                                src={selectedLesson.videoUrl}
                                                className="w-full h-full border-none"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <video
                                                className="w-full h-full object-contain"
                                                controls
                                                controlsList="nodownload"
                                                onContextMenu={(e) => e.preventDefault()}
                                                src={selectedLesson.videoUrl}
                                            >
                                                Tu navegador no soporta la reproducción de video.
                                            </video>
                                        )}
                                    </div>

                                    {/* Real-time Progress tracker */}
                                    <div className="mt-8 flex flex-col gap-3">
                                        {completedLessons.includes(selectedLesson.id) ? (
                                            <p className="text-[10px] text-green-400 font-black tracking-widest uppercase mt-1 animate-pulse flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                                ¡LECCIÓN COMPLETADA!
                                            </p>
                                        ) : (
                                            <button
                                                onClick={markAsCompleted}
                                                className="w-full py-4 rounded-xl font-black text-xs tracking-[0.2em] bg-brand-primary text-white uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                                            >
                                                MARCAR COMO COMPLETADA
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-sm font-black tracking-widest uppercase opacity-40">Descripción</h4>
                                    <p className="text-white/70 leading-relaxed font-medium">
                                        {selectedLesson.description || "Sin descripción adicional."}
                                    </p>
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black opacity-30 uppercase">Duración aproximada</span>
                                                <span className="text-base font-bold text-white">{selectedLesson.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-white/10 hover:bg-white/20 text-white/80`}
                                    >
                                        Cerrar Reproductor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <style jsx global>{`
                @keyframes zoom-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-zoom-in {
                    animation: zoom-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </main>
    );
}
