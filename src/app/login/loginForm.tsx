"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Button } from "@components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/card";
import { cn } from "@/src/lib/utils";
import { loginWithGoogle, loginWithMicrosoft } from "../actions/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const GOOGLE_LOGO =
    "https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg";
  const MICROSOFT_LOGO =
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg";

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleLoginWithGoogle = async () => {
    await loginWithGoogle({ redirectTo: callbackUrl });
  };

  const handleLoginWithMicrosoft = async () => {
    await loginWithMicrosoft({ redirectTo: callbackUrl });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center  px-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md shadow-md rounded-xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Bienvenido
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-2">
            Inicia sesión para acceder a tu cuenta
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 py-4">
          <form action={handleLoginWithGoogle}>
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-background hover:bg-gray-50 text-sm"
            >
              <Image
                src={GOOGLE_LOGO}
                alt="Google logo"
                width={20}
                height={20}
              />
              Iniciar sesión con Google
            </Button>
          </form>

          <form action={handleLoginWithMicrosoft}>
            <Button
              type="submit"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-background hover:bg-gray-50 text-sm"
            >
              <Image
                src={MICROSOFT_LOGO}
                alt="Microsoft logo"
                width={20}
                height={20}
              />
              Iniciar sesión con Microsoft
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Solo cuentas personales de Microsoft (no institucionales).
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
