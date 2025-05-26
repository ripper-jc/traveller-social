import { Alert, AlertDescription, AlertTitle } from "./alert";
import { XCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "destructive";
}

export function ErrorDisplay({
  title = "Error",
  message,
  action,
  variant = "destructive",
}: ErrorDisplayProps) {
  return (
    <Alert variant={variant} className="my-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {action && (
        <div className="mt-3">
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </Alert>
  );
}

export function InlineError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="text-sm text-destructive flex items-center gap-2 mt-1">
      <XCircle className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
}
