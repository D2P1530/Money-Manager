import { useId } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => React.ReactNode;
};

export function Field({ label, error, hint, className, children }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error || hint);

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-[13px] font-medium text-ink">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": hasMessage ? messageId : undefined,
      })}
      {error ? (
        <p id={messageId} role="alert" className="text-xs text-negative">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
