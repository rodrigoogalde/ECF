import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Toaster } from "@components/ui/sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <AppSidebar user={session.user}>
        {children}
        <Toaster />
      </AppSidebar>
    </>
  );
}
