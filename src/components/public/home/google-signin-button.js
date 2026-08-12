"use client";

import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function decodeJwtPayload(token) {
  try {
    const payloadSegment = token.split(".")[1];
    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google sign-in.")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in."));
    document.head.appendChild(script);
  });
}

/**
 * Real "Continue with Google" using Google Identity Services (GIS). Renders Google's
 * own button, which opens the browser's native Google account chooser — the same
 * experience as any other "Sign in with Google" flow on the web.
 *
 * The ID token this produces is sent as-is to the backend, which verifies it against
 * Google directly (see CRM.Application/Services/GoogleAuth_Service). This component
 * only decodes the token client-side to show an immediate name/photo preview — that
 * decoded copy is never trusted for the actual submission.
 */
export function GoogleSignInButton({ clientId, text, onSignedIn, onError }) {
  const buttonRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // onSignedIn/onError are typically inline arrow functions from the caller, so their
  // identity changes on every parent render. Reading the latest via refs (instead of
  // depending on them directly) keeps the setup effect below from re-running — and
  // re-initializing/re-rendering Google's button — on every unrelated parent re-render.
  const onSignedInRef = useRef(onSignedIn);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSignedInRef.current = onSignedIn;
    onErrorRef.current = onError;
  }, [onSignedIn, onError]);

  useEffect(() => {
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const claims = decodeJwtPayload(response.credential);

            onSignedInRef.current({
              idToken: response.credential,
              preview: claims
                ? {
                    fullName: claims.name ?? claims.email,
                    email: claims.email,
                    profileImageUrl: claims.picture ?? null,
                  }
                : null,
            });
          },
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            width: 320,
            text: "continue_with",
          });
        }

        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current?.(text.loadError);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={buttonRef} />
      {!isReady ? <p className="text-xs text-slate-400">{text.loading}</p> : null}
    </div>
  );
}
