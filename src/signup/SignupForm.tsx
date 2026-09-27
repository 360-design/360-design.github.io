import { ArrowUpRight, Check } from "@phosphor-icons/react";
import { launchConsent } from "./consent";
import useSignupDelivery from "./useSignupDelivery";

export default function SignupForm({
  endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT,
}: {
  endpoint?: string;
}) {
  const { state, formProps, trapName, fields } = useSignupDelivery(endpoint);
  return (
    <form
      className="signup-form"
      {...formProps}
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
          name={trapName}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <p className="signup-note" id="signup-note">
        {launchConsent.notice}
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
  );
}
