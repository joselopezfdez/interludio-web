import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }) {
    // 1. Verificar sesión en el servidor (Seguridad máxima)
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Si no hay sesión o no es admin, fuera
    if (!session || !session.user.isAdmin) {
        // Redirigimos a la home para que el usuario tenga que loguearse correctamente
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#1a0d14] text-white flex flex-col md:flex-row">
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen">
                <div className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
