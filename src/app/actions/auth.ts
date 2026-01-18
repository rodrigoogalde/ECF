"use server";

import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

interface LoginWithGoogleProps {
    redirectTo: string | null
}

interface LoginWithMicrosoftProps {
    redirectTo: string | null
}

export async function loginWithGoogle({ redirectTo }: LoginWithGoogleProps) {
  await signIn("google", { redirectTo: redirectTo ? redirectTo : "/" });
}

export async function loginWithMicrosoft({ redirectTo }: LoginWithMicrosoftProps) {
  await signIn("microsoft-entra-id", { redirectTo: redirectTo ? redirectTo : "/" });
}

export async function logout() {
    await signOut({ redirectTo: "/" });
    return redirect("/");
}