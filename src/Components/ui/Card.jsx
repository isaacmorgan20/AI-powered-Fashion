const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`
        rounded-lg border border-border-light bg-surface-primary shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-5 py-4 border-b border-border-light ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-text-primary ${className}`} {...props}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = "", ...props }) => {
  return (
    <p className={`mt-1 text-sm text-text-secondary ${className}`} {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`
        px-5 py-3 border-t border-border-light bg-surface-muted/50
        rounded-b-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };