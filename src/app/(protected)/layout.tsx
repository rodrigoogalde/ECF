import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Toaster } from "@components/ui/sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ROUTES } from "@/lib/config/routes";

export default async function RootProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(ROUTES.LOGIN);
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
