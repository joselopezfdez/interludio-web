import { db } from "@/db";
import { user } from "@/db/schema";
import { desc } from "drizzle-orm";
import UsersManagement from "@/components/admin/UsersManagement";

export default async function AdminUsersPage() {
    const allUsers = await db.select().from(user).orderBy(desc(user.createdAt));

    // Pasamos los usuarios al componente de cliente
    return <UsersManagement users={allUsers} />;
}
