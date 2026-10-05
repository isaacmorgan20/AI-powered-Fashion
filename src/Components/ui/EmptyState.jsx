const EmptyState = ({
 icon: Icon,
 title,
 description,
 action,
 className = "",
 ...props
}) => {
 return (
 <div
 className={`
 flex flex-col items-center justify-center text-center
 py-12 px-4
 ${className}
 `}
 {...props}
 >
 {Icon && (
 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted">
 <Icon size={24} className="text-text-muted" aria-hidden="true" />
 </div>
 )}
 {title && (
 <h3 className="text-lg font-semibold text-text-primary mb-1">
 {title}
 </h3>
 )}
 {description && (
 <p className="text-sm text-text-secondary max-w-sm mb-4">
 {description}
 </p>
 )}
 {action && (
 <div className="mt-2">{action}</div>
 )}
 </div>
 );
};

EmptyState.displayName = "EmptyState";

export { EmptyState };
