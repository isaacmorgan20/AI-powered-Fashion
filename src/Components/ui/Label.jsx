const Label = ({ children, className = "", htmlFor, required, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`
        block text-sm font-medium text-text-primary
        ${required ? "flex items-center gap-1.5" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
      {required && (
        <span className="text-error" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

Label.displayName = "Label";

export { Label };