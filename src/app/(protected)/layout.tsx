import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Toaster } from "@components/ui/sonner";
import { Navbar } from "@/components/Navbar";

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
      <Navbar />
      {children}
      <Toaster />
    </>
  );
}
