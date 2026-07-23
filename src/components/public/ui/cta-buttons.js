"use client";

// Reusable call-to-action buttons in the hero style.
// RegistrationButton: teal→cyan gradient pill that inverts to white on hover.
// LearnMoreButton: white pill with a subtle border that tints cyan on hover.
// Both accept href, children and an optional className for spacing tweaks.

export function RegistrationButton({ href, onClick, children, className = "" }) {
  const sharedClassName = `inline-flex items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/80 transition-all duration-300 ease-out visited:!text-white hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:bg-none hover:!text-cyan-800 hover:shadow-xl hover:shadow-cyan-300/70 focus:!text-white active:!text-white ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={sharedClassName}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} className={sharedClassName}>
      {children}
    </a>
  );
}

export function LearnMoreButton({ href, children, className = "" }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-cyan-200/80 transition-all duration-300 ease-out visited:!text-white hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:bg-none hover:!text-cyan-800 hover:shadow-xl hover:shadow-cyan-300/70 focus:!text-white active:!text-white ${className}`}
    >
      {children}
    </a>
  );
}
