const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variantStyles = {
    default:
      "bg-surface-muted text-text-secondary border border-border-light",
    success:
      "bg-success-light text-success border border-success/20",
    warning:
      "bg-warning-light text-warning-foreground border border-warning/20",
    error:
      "bg-error-light text-error border border-error/20",
    info:
      "bg-info-light text-info border border-info/20",
    ai:
      "bg-ai-light text-ai border border-ai/20",
    whatsapp:
      "bg-channel-whatsapp-light text-channel-whatsapp border border-channel-whatsapp/20",
    instagram:
      "bg-channel-instagram-light text-channel-instagram border border-channel-instagram/20",
    facebook:
      "bg-channel-facebook-light text-channel-facebook border border-channel-facebook/20",
    telegram:
      "bg-channel-telegram-light text-channel-telegram border border-channel-telegram/20",
    website:
      "bg-channel-website-light text-channel-website border border-channel-website/20",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        transition-colors
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = "Badge";

export { Badge };