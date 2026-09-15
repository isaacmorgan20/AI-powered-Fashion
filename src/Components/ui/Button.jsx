import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      className = "",
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-hover border border-transparent",
      secondary:
        "bg-surface-muted text-text-primary hover:bg-surface-hover border border-border-light",
      outline:
        "bg-transparent text-text-primary hover:bg-surface-muted border border-border-medium",
      ghost: "bg-transparent text-text-primary hover:bg-surface-muted border border-transparent",
      destructive:
        "bg-error text-error-foreground hover:bg-error/90 border border-transparent",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
      icon: "h-10 w-10 p-0",
    };

    const isLoading = loading || disabled;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isLoading}
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} rounded-md ${className}`}
        {...props}
      >
        {loading && (
          <Loader2
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {!loading && children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };