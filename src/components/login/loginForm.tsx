"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/config/routes";
import { loginWithGoogle, loginWithMicrosoft } from "../../app/actions/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const GOOGLE_LOGO =
    "https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg";
  const MICROSOFT_LOGO =
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg";

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/main";

  const handleLoginWithGoogle = async () => {
    await loginWithGoogle({ redirectTo: callbackUrl });
  };

  const handleLoginWithMicrosoft = async () => {
    await loginWithMicrosoft({ redirectTo: callbackUrl });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center px-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md shadow-md rounded-xl p-6 relative">
        <Link
          href={ROUTES.HOME}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="font-medium">Inicio</span>
        </Link>

        <CardHeader className="text-center pt-8">
          <CardTitle className="text-3xl font-bold">
            Bienvenido
          </CardTitle>
          <CardDescription className="text-sm mt-2">
            Inicia sesión para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 py-4">
          <div className="grid grid-cols-2 gap-6">
            <form action={handleLoginWithGoogle}>
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full border-2 hover:scale-110 transition-transform"
              >
                <Image
                  src={GOOGLE_LOGO}
                  alt="Iniciar sesión con Google"
                  width={32}
                  height={32}
                />
              </Button>
            </form>

            <form action={handleLoginWithMicrosoft}>
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full border-2 hover:scale-110 transition-transform"
              >
                <Image
                  src={MICROSOFT_LOGO}
                  alt="Iniciar sesión con Microsoft"
                  width={32}
                  height={32}
                />
              </Button>
            </form>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Solo cuentas personales de la UC.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
