import { forwardRef } from "react";

const Textarea = forwardRef(
 (
 {
 label,
 error,
 className = "",
 id,
 required,
 disabled = false,
 rows = 3,
 ...props
 },
 ref
 ) => {
 const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

 return (
 <div className="w-full">
 {label && (
 <label
 htmlFor={textareaId}
 className="block text-sm font-medium text-text-primary mb-1.5"
 >
 {label}
 {required && (
 <span className="text-error ml-1" aria-hidden="true">
 *
 </span>
 )}
 </label>
 )}
 <textarea
 ref={ref}
 id={textareaId}
 disabled={disabled}
 rows={rows}
 aria-invalid={error ? "true" : "false"}
 aria-describedby={error ? `${textareaId}-error` : undefined}
 className={`
 w-full rounded-md border bg-surface-primary text-text-primary
 placeholder:text-text-muted
 transition-colors resize-y min-h-[80px]
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
 disabled:opacity-50 disabled:cursor-not-allowed
 ${error ? "border-error focus-visible:ring-error/20" : "border-border-medium hover:border-border-light"}
 ${className}
 `}
 {...props}
 />
 {error && (
 <p
 id={`${textareaId}-error`}
 className="mt-1.5 text-sm text-error"
 role="alert"
 >
 {error}
 </p>
 )}
 </div>
 );
 }
);

Textarea.displayName = "Textarea";

export { Textarea };
