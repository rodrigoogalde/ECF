import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FinishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
  answeredCount: number;
  totalQuestions: number;
  flaggedCount: number;
  finishing: boolean;
}

export function FinishModal({
  open,
  onOpenChange,
  onFinish,
  answeredCount,
  totalQuestions,
  flaggedCount,
  finishing,
}: FinishModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Finalizar prueba?</AlertDialogTitle>
          <AlertDialogDescription>
            Has respondido {answeredCount} de {totalQuestions} preguntas.
            {flaggedCount > 0 && ` Tienes ${flaggedCount} preguntas marcadas para revisar.`}
            <br /><br />
            Una vez finalizada, no podrás modificar tus respuestas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onFinish} disabled={finishing}>
            {finishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              "Finalizar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
