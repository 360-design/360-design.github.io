import SignupForm from "../signup/SignupForm";

export default function Signup() {
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
        <SignupForm />
      </div>
    </section>
  );
}
