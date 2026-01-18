import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { Toaster } from "@components/sonner";
import { Navbar } from "@/src/components/Navbar";

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
