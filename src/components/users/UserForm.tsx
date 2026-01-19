"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { userSchema } from "@/lib/validations/user";
import { Prisma } from "@prisma/client";
import { createUser, updateUser } from "@/app/actions/routes/user";

interface UserFormProps {
  user?: Prisma.UserGetPayload<{}>;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!user;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = userSchema.parse({
      email: formData.get("email") as string,
      name: (formData.get("name") as string) || undefined,
    });
    
    try {
      const result = isEditing
        ? await updateUser(user.id, data)
        : await createUser(data);

      if (result) {
        toast.success(
          isEditing
            ? "Usuario actualizado exitosamente"
            : "Usuario creado exitosamente"
        );
        setTimeout(() => {
          router.push("/users");
        }, 1000);
      } else {
        toast.error("Ocurrió un error");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Modifica los datos del usuario"
            : "Ingresa los datos del usuario para darle acceso a la aplicación"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              defaultValue={user?.email || ""}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre completo"
              defaultValue={user?.name || ""}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? isEditing
                ? "Actualizando..."
                : "Creando..."
              : isEditing
              ? "Actualizar Usuario"
              : "Crear Usuario"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
