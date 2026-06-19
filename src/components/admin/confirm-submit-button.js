"use client";

export function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
  ariaLabel,
  title,
  disabled = false,
}) {
  return (
    <button
      type="submit"
      className={className}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
