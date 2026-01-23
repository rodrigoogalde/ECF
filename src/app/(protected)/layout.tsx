import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

  // Read the sidebar state from cookies on the server
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarState?.value !== "false"; // Default to true if cookie doesn't exist

  return (
    <>
      <AppSidebar user={session.user} defaultOpen={defaultOpen}>
        {children}
        <Toaster />
      </AppSidebar>
    </>
  );
}
