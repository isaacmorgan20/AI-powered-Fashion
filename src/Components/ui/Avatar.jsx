const Avatar = ({
  src,
  alt,
  name,
  size = "md",
  online = false,
  className = "",
  ...props
}) => {
  const sizeStyles = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const bgColor = name
    ? `hsl(${name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 137 % 360} 65% 50%)`
    : "var(--color-primary)";

  return (
    <div className={`relative inline-flex ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={`${sizeStyles[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full flex items-center justify-center font-medium text-white`}
          style={{ backgroundColor: bgColor }}
          aria-label={name}
        >
          {initials}
        </div>
      )}
      {online && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full border-2 border-surface-primary
            ${size === "xs" ? "h-1.5 w-1.5" : "h-2.5 w-2.5"}
            bg-success
          `}
          aria-label="Online"
        />
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";

export { Avatar };