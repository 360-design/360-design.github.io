import { useRef, useState, type FormEvent } from "react";
import { formspreeEndpoint } from "../signup-config";
import { launchConsent } from "./consent";

type SignupState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function useSignupDelivery(endpoint: string | undefined) {
  const hosted = formspreeEndpoint(endpoint);
  const [state, setState] = useState<SignupState>({ kind: "idle" });
  const locked = useRef(false);

  async function submitLocal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const data = new FormData(event.currentTarget);
    locked.current = true;
    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"),
        }),
        signal: AbortSignal.timeout(12000),
      });
      const result: unknown = await response.json();
      if (
        response.ok &&
        typeof result === "object" &&
        result !== null &&
        "subscribed" in result &&
        result.subscribed === true
      ) {
        setState({ kind: "success" });
        return;
      }
      setState({
        kind: "error",
        message:
          response.status === 429
            ? "A few too many attempts. Please try again in a minute."
            : response.status === 400
              ? "Please check your email address and try again."
              : "We couldn’t save your email. Please try again.",
      });
    } catch {
      setState({
        kind: "error",
        message: "We couldn’t connect. Check your connection and try again.",
      });
    }
    locked.current = false;
  }

  // Hosted delivery deliberately has no submit handler: the browser owns the
  // POST and Formspree owns confirmation/CAPTCHA navigation. Local delivery
  // keeps the visitor here and reports the JSON response inline.
  return {
    state,
    formProps: {
      action: hosted,
      method: "post",
      onSubmit: hosted ? undefined : submitLocal,
    },
    trapName: hosted ? "_gotcha" : "website",
    fields: hosted
      ? {
          consent_version: launchConsent.version,
          consent: launchConsent.statement,
        }
      : {},
  };
}
