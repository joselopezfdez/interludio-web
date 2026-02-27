'use client';

import { Reveal } from './animations/Reveal';

export default function Contact() {
    return (
        <section id="contact" className="py-16 md:py-32 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">

                    <div className="flex-1 space-y-8 md:space-y-12 text-center lg:text-left">
                        <Reveal>
                            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-none text-studio-text">
                                ¿Listo para<br />hacer <span className="text-brand-primary italic">historia?</span>
                            </h2>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <p className="text-base md:text-lg opacity-90 max-w-md mx-auto lg:mx-0 leading-relaxed font-bold text-white/90">
                                Actualmente reservando sesiones para el segundo y tercer trimestre de 2026. Hablemos de tu próximo proyecto y demos vida a tu visión.
                            </p>
                        </Reveal>

                        <div className="space-y-6 md:space-y-8">
                            <Reveal delay={0.2}>
                                <div className="flex flex-col md:flex-row items-center lg:items-start gap-4 md:gap-6 group">
                                    <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black tracking-widest opacity-60 uppercase mb-1 text-brand-primary">Ubicación</p>
                                        <p className="text-xs md:text-sm font-bold opacity-100 uppercase tracking-tight text-white">C. Jaén 3, 28935 Móstoles, Madrid, España.</p>
                                    </div>
                                </div>
                            </Reveal>

                            <Reveal delay={0.3}>
                                <div className="flex flex-col md:flex-row items-center lg:items-start gap-4 md:gap-6 group">
                                    <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10Z" /><path d="m22 7-10 7L2 7" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black tracking-widest opacity-60 uppercase mb-1 text-brand-primary">E-mail Us</p>
                                        <p className="text-xs md:text-sm font-bold opacity-100 uppercase tracking-tight text-white">laromusic@gmail.com</p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-xl">
                        <Reveal delay={0.4}>
                            <div className="bg-brand-primary/80 backdrop-blur-sm p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-brand-primary/10 shadow-2xl shadow-brand-primary/5">
                                <form className="space-y-4 md:space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[10px] font-black uppercase opacity-60 tracking-widest ml-1 text-white">Nombre</label>
                                            <input type="text" placeholder="Marcos" className="w-full bg-white/10 border border-brand-primary/20 rounded-xl px-4 md:px-6 py-3 md:py-4 outline-none focus:border-brand-primary transition-all text-sm text-white placeholder:text-white/20" />
                                        </div>
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[10px] font-black uppercase opacity-60 tracking-widest ml-1 text-white">Email</label>
                                            <input type="email" placeholder="tuemail@gmail.com" className="w-full bg-white/10 border border-brand-primary/20 rounded-xl px-4 md:px-6 py-3 md:py-4 outline-none focus:border-brand-primary transition-all text-sm text-white placeholder:text-white/20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-black uppercase opacity-60 tracking-widest ml-1 text-white">Tipo de Proyecto</label>
                                        <select className="w-full bg-white/10 border border-brand-primary/20 rounded-xl px-4 md:px-6 py-3 md:py-4 outline-none focus:bg-brand-primary focus:border-brand-primary transition-all appearance-none cursor-pointer text-sm text-white">
                                            <option className="bg-[#121212]">Sesión de Grabación</option>
                                            <option className="bg-[#121212]">Proyecto de Mezcla</option>
                                            <option className="bg-[#121212]">Sesión de Masterización</option>
                                            <option className="bg-[#121212]">Producción Completa</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-black uppercase opacity-60 tracking-widest ml-1 text-white">Mensaje</label>
                                        <textarea rows="4" placeholder="Háblanos de tu proyecto..." className="w-full bg-white/10 border border-brand-primary/20 rounded-xl px-4 md:px-6 py-3 md:py-4 outline-none focus:border-brand-primary transition-all resize-none text-sm text-white placeholder:text-white/20" />
                                    </div>
                                    <button className="w-full bg-brand-primary text-white py-4 md:py-5 rounded-xl font-black text-[10px] md:text-xs tracking-[0.3em] uppercase hover:bg-brand-secondary hover:translate-y-[-2px] transition-all shadow-xl shadow-brand-primary/20">
                                        ENVIAR CONSULTA
                                    </button>
                                </form>
                            </div>
                        </Reveal>
                    </div>

                </div>
            </div>

            <Reveal delay={0.6}>
                <div className="mt-16 md:mt-32 w-full h-[300px] md:h-[600px] relative overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3042.8447816694386!2d-3.864887323424163!3d40.32360566060411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd418ea8a68b4ef1%3A0x7d6c6e3d2f8e9f5e!2sC.%20Ja%C3%A9n%2C%203%2C%2028935%20M%C3%B3stoles%2C%20Madrid!5e0!3m2!1ses!2ses!4v1707660000000!5m2!1ses!2ses"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(0.5)' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación de Laro Music"
                        className="opacity-70 hover:opacity-100 transition-opacity duration-1000"
                    />
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-brand-primary/10" />
                </div>
            </Reveal>
        </section>
    );
}
