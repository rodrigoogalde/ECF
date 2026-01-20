import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  isFlagged?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFlag?: () => void;
}

export function QuestionNavigation({
  currentIndex,
  totalQuestions,
  isFlagged,
  onPrevious,
  onNext,
  onToggleFlag,
}: QuestionNavigationProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </Button>

      {onToggleFlag && (
        <div className="flex items-center gap-2">
          <Button
            variant={isFlagged ? "default" : "outline"}
            size="icon"
            onClick={onToggleFlag}
            className={isFlagged ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1}
      >
        Siguiente
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
