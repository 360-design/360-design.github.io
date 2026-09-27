import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "@phosphor-icons/react";
import { formspreeEndpoint } from "../signup-config";

const hostedEndpoint = formspreeEndpoint(
  import.meta.env.VITE_FORMSPREE_ENDPOINT,
);

type SignupState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function Signup() {
  const [state, setState] = useState<SignupState>({ kind: "idle" });
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    // Native submission lets Formspree handle confirmation and CAPTCHA challenges.
    if (hostedEndpoint) return;
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    submitting.current = true;
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
      } else {
        setState({
          kind: "error",
          message:
            response.status === 429
              ? "A few too many attempts. Please try again in a minute."
              : response.status === 400
                ? "Please check your email address and try again."
                : "We couldn’t save your email. Please try again.",
        });
      }
    } catch {
      setState({
        kind: "error",
        message: "We couldn’t connect. Check your connection and try again.",
      });
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section
      className="launch section-pad"
      id="soon"
      aria-labelledby="launch-title"
    >
      <div>
        <p className="mono eyebrow" data-reveal="text">
          <span className="tiny-ring" aria-hidden="true" /> THE NEXT CHAPTER
        </p>
        <h2 id="launch-title" data-reveal="text" data-reveal-order="1">
          Join the
          <br />
          <span>circle.</span>
        </h2>
      </div>
      <div className="signup-copy" data-reveal="text" data-reveal-order="2">
        <p className="signup-intro">
          Our first collection is taking shape.
          <br />
          Be there when it comes full circle.
        </p>
        <form
          className="signup-form"
          action={hostedEndpoint}
          method="post"
          onSubmit={submit}
          aria-label="Join the circle"
          aria-busy={state.kind === "submitting"}
        >
          <label className="mono signup-label" htmlFor="signup-email">
            YOUR EMAIL
          </label>
          <div className="signup-field">
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              maxLength={254}
              required
              readOnly={state.kind === "submitting" || state.kind === "success"}
              aria-describedby="signup-note signup-feedback"
            />
            <button
              type="submit"
              className="signup-submit mono"
              disabled={state.kind === "submitting" || state.kind === "success"}
            >
              {state.kind === "success" ? (
                <>
                  YOU’RE IN <Check size={18} aria-hidden="true" />
                </>
              ) : state.kind === "submitting" ? (
                <>
                  JOINING <span className="signup-spinner" aria-hidden="true" />
                </>
              ) : (
                <>
                  JOIN THE CIRCLE <ArrowUpRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
          <div className="signup-trap" aria-hidden="true" inert>
            <label htmlFor="signup-website">Leave this empty</label>
            <input
              id="signup-website"
              name={hostedEndpoint ? "_gotcha" : "website"}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {hostedEndpoint && (
            <>
              <input
                type="hidden"
                name="consent_version"
                value="launch-updates-v1"
              />
              <input
                type="hidden"
                name="consent"
                value="I agree to receive email updates about the 360 launch."
              />
            </>
          )}
          <p className="signup-note" id="signup-note">
            By joining, you agree to receive email updates about the 360 launch.
          </p>
          <p
            className="signup-feedback"
            id="signup-feedback"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {state.kind === "success"
              ? "You’re on the list. We’ll be in touch when the collection is ready."
              : state.kind === "error"
                ? state.message
                : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
