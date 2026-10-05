import { forwardRef } from "react";

const Select = forwardRef(
 (
 {
 label,
 error,
 className = "",
 id,
 required,
 disabled = false,
 options = [],
 placeholder,
 ...props
 },
 ref
 ) => {
 const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

 return (
 <div className="w-full">
 {label && (
 <label
 htmlFor={selectId}
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
 <select
 ref={ref}
 id={selectId}
 disabled={disabled}
 aria-invalid={error ? "true" : "false"}
 aria-describedby={error ? `${selectId}-error` : undefined}
 className={`
 w-full rounded-md border bg-surface-primary text-text-primary
 transition-colors
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
 disabled:opacity-50 disabled:cursor-not-allowed
 appearance-none
 ${error ? "border-error focus-visible:ring-error/20" : "border-border-medium hover:border-border-light"}
 ${className}
 `}
 {...props}
 >
 {placeholder && (
 <option value="" disabled>
 {placeholder}
 </option>
 )}
 {options.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 {error && (
 <p
 id={`${selectId}-error`}
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

Select.displayName = "Select";

export { Select };
