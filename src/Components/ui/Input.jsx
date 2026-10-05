import { forwardRef } from "react";

const Input = forwardRef(
 (
 {
 label,
 error,
 className = "",
 id,
 required,
 disabled = false,
 ...props
 },
 ref
 ) => {
 const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

 return (
 <div className="w-full">
 {label && (
 <label
 htmlFor={inputId}
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
 <input
 ref={ref}
 id={inputId}
 disabled={disabled}
 aria-invalid={error ? "true" : "false"}
 aria-describedby={error ? `${inputId}-error` : undefined}
 className={`
 w-full rounded-md border bg-surface-primary text-text-primary
 placeholder:text-text-muted
 transition-colors
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
 disabled:opacity-50 disabled:cursor-not-allowed
 ${error ? "border-error focus-visible:ring-error/20" : "border-border-medium hover:border-border-light"}
 ${className}
 `}
 {...props}
 />
 {error && (
 <p
 id={`${inputId}-error`}
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

Input.displayName = "Input";

export { Input };
