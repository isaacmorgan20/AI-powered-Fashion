const Skeleton = ({
  className = "",
  variant = "rect",
  width,
  height,
  ...props
}) => {
  const baseStyles = `
    animate-pulse rounded bg-surface-muted
    ${className}
  `;

  if (variant === "circle") {
    const size = width || height || "1rem";
    return (
      <div
        className={`${baseStyles} rounded-full`}
        style={{ width: size, height: size }}
        {...props}
      />
    );
  }

  if (variant === "text") {
    return (
      <div
        className={`${baseStyles} h-4 rounded`}
        style={{ width: width || "100%" }}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${baseStyles}`}
      style={{
        width: width || "100%",
        height: height || "1rem",
      }}
      {...props}
    />
  );
};

Skeleton.displayName = "Skeleton";

export { Skeleton };