"use client";

import { useState, useEffect } from "react";
import { getBookingsForDate, createBooking } from "@/app/actions/booking";

// Assuming working hours: 10:00 to 22:00
const START_HOUR = 10;
const END_HOUR = 22;

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const DAY_NAMES = ["L", "M", "X", "J", "V", "S", "D"];

export default function BookingCalendar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    const [duration, setDuration] = useState(1);
    const [selectedTime, setSelectedTime] = useState("");

    const [step, setStep] = useState(1); // 1 = Select Time, 2 = Details
    const [withEngineer, setWithEngineer] = useState(true);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "", phone: "", details: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!selectedDate) return;

        async function fetchBookings() {
            setLoadingBookings(true);
            try {
                const data = await getBookingsForDate(selectedDate);
                setBookings(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingBookings(false);
            }
        }

        fetchBookings();
    }, [selectedDate]);

    // Calendar generation
    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const daysInMonth = getDaysInMonth(currentMonthDate.getFullYear(), currentMonthDate.getMonth());

    // Adjust to Monday first (JS getDay: 0 is Sun, 1 is Mon)
    const firstDayOfMonth = daysInMonth[0].getDay();
    const emptyDaysBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const prevMonth = () => {
        const d = new Date(currentMonthDate);
        d.setMonth(d.getMonth() - 1);
        // Don't go back past the current real month
        const realCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        if (d >= realCurrentMonth) {
            setCurrentMonthDate(d);
            setSelectedDate("");
            setSelectedTime("");
        }
    };

    const nextMonth = () => {
        const d = new Date(currentMonthDate);
        d.setMonth(d.getMonth() + 1);
        setCurrentMonthDate(d);
        setSelectedDate("");
        setSelectedTime("");
    };

    const handleDateSelect = (d) => {
        // Disable past dates
        if (d < today) return;

        const dateString = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        setSelectedDate(dateString);
        setSelectedTime("");
    };

    // Time slots generation
    const getAvailableStartTimes = () => {
        if (!selectedDate) return [];

        const slots = [];
        for (let h = START_HOUR; h <= END_HOUR - duration; h++) {
            const slotStart = new Date(`${selectedDate}T${h.toString().padStart(2, '0')}:00:00`);
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(slotStart.getHours() + duration);

            // Allow if today and time is in the future
            if (slotStart <= new Date()) continue;

            // Check overlaps with bookings
            let isOverlapping = false;
            for (const b of bookings) {
                const bStart = new Date(b.startTime);
                const bEnd = new Date(b.endTime);

                if (slotStart < bEnd && slotEnd > bStart) {
                    isOverlapping = true;
                    break;
                }
            }

            if (!isOverlapping) {
                slots.push(`${h.toString().padStart(2, '0')}:00`);
            }
        }
        return slots;
    };

    const availableTimes = getAvailableStartTimes();

    const handleNextStep = () => {
        if (selectedDate && selectedTime) {
            setStep(2);
            setErrorMessage("");
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!formData.name || !formData.email) {
            setErrorMessage("Debes rellenar todos los campos obligatorios.");
            return;
        }

        setIsSubmitting(true);

        const startTimeStr = `${selectedDate}T${selectedTime}:00`;
        const startDate = new Date(startTimeStr);
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + parseInt(duration));

        try {
            const res = await createBooking({
                ...formData,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                withEngineer,
            });

            if (res.error) {
                setErrorMessage(res.error);
            } else if (res.success) {
                setSuccessMessage("¡Tu reserva ha sido confirmada! Revisa tu correo electrónico para ver los detalles.");
                setStep(1);
                setSelectedDate("");
                setSelectedTime("");
                setFormData({ name: "", email: "", phone: "", details: "" });
                setBookings([]);
            }
        } catch (error) {
            setErrorMessage("Ocurrió un error al procesar tu reserva. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (successMessage) {
        return (
            <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-[2rem] border border-brand-primary/20 text-center max-w-2xl mx-auto shadow-2xl">
                <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4">¡Reserva Completada!</h3>
                <p className="text-white/80 text-lg mb-8">{successMessage}</p>
                <button
                    onClick={() => setSuccessMessage("")}
                    className="px-8 py-3 bg-brand-primary rounded-xl font-bold uppercase hover:bg-brand-secondary transition shadow-lg hover:shadow-brand-primary/50"
                >
                    Hacer otra reserva
                </button>
            </div>
        );
    }

    const isPrevDisabled = currentMonthDate.getFullYear() === today.getFullYear() && currentMonthDate.getMonth() === today.getMonth();

    // Helper to print selected date
    let selectedDateLabel = "";
    if (selectedDate) {
        const d = new Date(`${selectedDate}T00:00:00`);
        selectedDateLabel = `${DAY_NAMES[d.getDay() === 0 ? 6 : d.getDay() - 1]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
    }

    return (
        <div className="bg-zinc-950/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 w-full max-w-4xl mx-auto shadow-2xl text-white">
            <div className="mb-6 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-center md:text-left">
                    Reserva tu <span className="text-brand-primary">sesión</span>
                </h2>
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="text-brand-primary hover:text-white transition mt-2 flex items-center font-bold text-xs tracking-widest uppercase">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Volver al Calendario
                    </button>
                )}
            </div>

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 flex items-center">
                    <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {errorMessage}
                </div>
            )}

            {step === 1 && (
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 min-h-[400px]">
                    {/* LEFTSIDE: Calendar & Duration */}
                    <div className={`${selectedDate ? 'lg:w-[55%]' : 'w-full max-w-lg mx-auto'} transition-all duration-500 ease-in-out`}>
                        <div className="bg-black/30 p-5 rounded-xl border border-white/5 mb-4">
                            <label className="block text-xs font-bold mb-2 text-white/50 uppercase tracking-widest">Duración de Sesión</label>
                            <select
                                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white text-sm hover:border-brand-primary/50 focus:border-brand-primary outline-none transition cursor-pointer"
                                value={duration}
                                onChange={(e) => {
                                    setDuration(parseInt(e.target.value));
                                    setSelectedTime("");
                                }}
                            >
                                <option value={1}>1 Hora</option>
                                <option value={2}>2 Horas</option>
                                <option value={3}>3 Horas</option>
                                <option value={4}>Media Jornada (4 Horas)</option>
                                <option value={5}>5 Horas</option>
                                <option value={6}>6 Horas</option>
                                <option value={8}>Día completo (8 Horas)</option>
                            </select>
                        </div>

                        <div className="bg-black/30 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium tracking-wide">
                                    {MONTH_NAMES[currentMonthDate.getMonth()]} <span className="text-white/40">{currentMonthDate.getFullYear()}</span>
                                </h3>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={prevMonth}
                                        disabled={isPrevDisabled}
                                        className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-zinc-900 border border-white/10 hover:border-brand-primary/50 disabled:opacity-30 disabled:block transition disabled:hover:border-white/10"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    </button>
                                    <button
                                        onClick={nextMonth}
                                        className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-zinc-900 border border-white/10 hover:border-brand-primary/50 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center mb-1">
                                {DAY_NAMES.map(d => (
                                    <div key={d} className="text-[10px] font-bold text-white/40 uppercase relative bottom-1">{d}</div>
                                ))}

                                {/* Empty spaces */}
                                {Array(emptyDaysBefore).fill(null).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}

                                {/* Days */}
                                {daysInMonth.map((d, i) => {
                                    const dateString = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
                                    const isSelected = selectedDate === dateString;
                                    const isPast = d < today;

                                    return (
                                        <div key={i} className="flex justify-center aspect-square items-center p-0.5">
                                            <button
                                                onClick={() => handleDateSelect(d)}
                                                disabled={isPast}
                                                className={`w-full h-full rounded flex items-center justify-center text-sm font-medium transition-all duration-200 ${isSelected
                                                    ? 'bg-brand-primary text-white shadow-[0_0_10px_rgba(255,27,141,0.5)]'
                                                    : isPast
                                                        ? 'text-white/10 cursor-not-allowed hidden md:flex opacity-50'
                                                        : 'bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                {d.getDate()}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHTSIDE: Time Picker */}
                    {selectedDate && (
                        <div className="lg:w-[45%] transition-all duration-500 ease-in-out animate-slide-in-right">
                            <div className="bg-black/30 p-5 rounded-xl border border-white/5 h-full flex flex-col">
                                <p className="mb-4 text-sm font-medium tracking-wide text-brand-primary uppercase">
                                    {selectedDateLabel}
                                </p>

                                {loadingBookings ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-white/40 gap-4">
                                        <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
                                        <p className="text-sm">Buscando huecos...</p>
                                    </div>
                                ) : availableTimes.length > 0 ? (
                                    <div className="flex-1 pr-2 overflow-y-auto max-h-[300px] fancy-scroll">
                                        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {availableTimes.map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setSelectedTime(t)}
                                                    className={`py-2 rounded border text-sm font-medium transition-all ${selectedTime === t
                                                        ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                                                        : 'bg-zinc-900 border-white/5 hover:border-brand-primary/50 text-white/80 hover:bg-zinc-800'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-white/40 text-center gap-4">
                                        <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <p className="text-sm px-4">No quedan horas disponibles para una sesión de {duration}h este día.</p>
                                    </div>
                                )}

                                {selectedTime && (
                                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
                                        <button
                                            onClick={handleNextStep}
                                            className="w-full py-3 bg-white text-black rounded text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition shadow-lg active:scale-95"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                    }
                </div >
            )}

            {
                step === 2 && (
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-slide-in-right">
                        {/* LEFTSIDE: Summary */}
                        <div className="lg:w-1/3 space-y-4">
                            <div className="bg-black/30 p-6 rounded-xl border border-brand-primary/30 h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[50px] rounded-full"></div>

                                <h3 className="text-lg font-bold mb-4 tracking-wide text-white">Resumen Cita</h3>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Día</p>
                                        <p className="font-medium text-sm">{selectedDateLabel}</p>
                                    </div>
                                    <div className="w-full h-px bg-white/5"></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Hora</p>
                                        <p className="font-medium text-sm text-brand-primary">{selectedTime}</p>
                                    </div>
                                    <div className="w-full h-px bg-white/5"></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Duración</p>
                                        <p className="font-medium text-sm">{duration} Hora{duration > 1 ? 's' : ''}</p>
                                    </div>
                                    <div className="w-full h-px bg-white/5"></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Extras</p>
                                        <p className="font-medium text-sm text-brand-primary">{withEngineer ? 'Con técnico' : 'Sin técnico'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHTSIDE: User form */}
                        <div className="lg:w-2/3">
                            <form onSubmit={handleBooking} className="bg-black/30 p-6 rounded-xl border border-white/5">
                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold mb-3 text-white/60 uppercase tracking-widest">Opciones de Estudio</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setWithEngineer(true)}
                                            className={`cursor-pointer p-4 rounded-lg border transition-all ${withEngineer ? 'bg-brand-primary/10 border-brand-primary' : 'bg-zinc-900 border-white/10 hover:border-white/30'}`}
                                        >
                                            <div className="flex items-center mb-1">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${withEngineer ? 'border-brand-primary' : 'border-white/40'}`}>
                                                    {withEngineer && <div className="w-2.5 h-2.5 bg-brand-primary rounded-full"></div>}
                                                </div>
                                                <p className="font-bold text-sm text-white">Con técnico de sonido</p>
                                            </div>
                                            <p className="text-xs text-white/50 pl-6 leading-relaxed">Incluye un ingeniero grabando y asistiendo durante toda la sesión.</p>
                                        </div>
                                        <div
                                            onClick={() => setWithEngineer(false)}
                                            className={`cursor-pointer p-4 rounded-lg border transition-all ${!withEngineer ? 'bg-brand-primary/10 border-brand-primary' : 'bg-zinc-900 border-white/10 hover:border-white/30'}`}
                                        >
                                            <div className="flex items-center mb-1">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${!withEngineer ? 'border-brand-primary' : 'border-white/40'}`}>
                                                    {!withEngineer && <div className="w-2.5 h-2.5 bg-brand-primary rounded-full"></div>}
                                                </div>
                                                <p className="font-bold text-sm text-white">Sin técnico de sonido</p>
                                            </div>
                                            <p className="text-xs text-white/50 pl-6 leading-relaxed">Solo alquiler del estudio. Debes traer o ser tu propio técnico.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-[10px] font-bold mb-2 text-white/60 uppercase tracking-widest">Nombre completo *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:border-brand-primary outline-none transition placeholder:text-white/20"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold mb-2 text-white/60 uppercase tracking-widest">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:border-brand-primary outline-none transition placeholder:text-white/20"
                                            placeholder="tucorreo@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-[10px] font-bold mb-2 text-white/60 uppercase tracking-widest">Teléfono (opcional)</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:border-brand-primary outline-none transition placeholder:text-white/20"
                                        placeholder="+34 600 000 000"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold mb-2 text-white/60 uppercase tracking-widest">Detalles adicionales (opcional)</label>
                                    <textarea
                                        rows="3"
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-sm text-white focus:border-brand-primary outline-none transition resize-none placeholder:text-white/20"
                                        placeholder="Indica un poco de qué se tratará..."
                                    ></textarea>
                                </div>

                                <div className="mb-6 p-4 bg-zinc-900/50 rounded-lg border border-white/5 flex gap-3 items-start">
                                    <button
                                        type="button"
                                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                                        className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${acceptedTerms ? 'bg-brand-primary border-brand-primary' : 'border-white/40 bg-zinc-800'}`}
                                    >
                                        {acceptedTerms && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>}
                                    </button>
                                    <div className="text-xs text-white/60 leading-relaxed cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                                        <span className="text-white font-medium">Acepto los términos y condiciones:</span> Entiendo que <strong>está terminantemente prohibido fumar</strong> dentro de las instalaciones del estudio y que me haré <strong>responsable de abonar cualquier rotura o desperfecto</strong> del equipo ocasionado durante mi sesión.
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-4 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition text-white/60 hover:text-white"
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.name || !formData.email || !acceptedTerms}
                                        className="px-6 py-3 bg-brand-primary rounded text-xs font-bold uppercase tracking-widest hover:bg-brand-secondary transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-brand-primary/30 active:scale-95 text-white"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.25"></circle>
                                                    <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" strokeLinecap="round"></path>
                                                </svg>
                                                Procesando...
                                            </span>
                                        ) : (
                                            "Confirmar Reserva"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </div>
    );
}
