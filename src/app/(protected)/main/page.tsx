import { MainDashboard } from "./MainDashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MainPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-6">
      <MainDashboard user={session.user} />
    </div>
  );
}
