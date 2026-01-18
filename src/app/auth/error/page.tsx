import { ErrorView } from "@/components/login/errorView";
import Loading from "@/components/loading";
import { Suspense } from "react";

interface AuthErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const { error } = await searchParams;

  const getErrorMessage = () => {
    switch (error) {
      case "UnauthorizedEmail":
        return {
          title: "Correo no autorizado",
          description: "Solo se permiten cuentas institucionales de la Universidad Católica (@uc.cl). Por favor, inicia sesión con tu correo UC.",
        };
      case "OAuthAccountNotLinked":
        return {
          title: "Cuenta ya vinculada",
          description: "Este correo ya está asociado con otro método de inicio de sesión. Intenta con el método que usaste originalmente.",
        };
      default:
        return {
          title: "Error de autenticación",
          description: "Ocurrió un error durante el proceso de inicio de sesión. Por favor, intenta nuevamente.",
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="flex  w-full h-screen items-center justify-center">
      <Suspense fallback={<Loading />}>
        <ErrorView
          title={errorInfo.title}
          description={errorInfo.description}
          error={error}
        />
      </Suspense>
    </div>
  );
}
