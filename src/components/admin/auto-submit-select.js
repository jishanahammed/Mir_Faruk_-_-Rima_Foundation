"use client";

export function AutoSubmitSelect({ className, ...props }) {
  return (
    <select
      {...props}
      onChange={(event) => {
        event.currentTarget.form?.requestSubmit();
      }}
      className={className}
    />
  );
}
