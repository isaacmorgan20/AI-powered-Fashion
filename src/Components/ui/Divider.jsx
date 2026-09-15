const Divider = ({ className = "", orientation = "horizontal", ...props }) => {
  return (
    <hr
      className={`
        border-border-light
        ${orientation === "horizontal" ? "w-full" : "h-full"}
        ${className}
      `}
      aria-orientation={orientation}
      {...props}
    />
  );
};

Divider.displayName = "Divider";

export { Divider };