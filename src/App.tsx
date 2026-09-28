import { ArrowUpRight } from "@phosphor-icons/react";
import { CircleMark } from "./components/CircleMark";
import CircleSign from "./components/CircleSign";
import Collection from "./components/Collection";
import Hero from "./components/Hero";
import Lookbook from "./components/Lookbook";
import Signup from "./components/Signup";
import { useAppearance } from "./useAppearance";
import { useScrollReveals } from "./useScrollReveals";

export default function App() {
  const revealRoot = useScrollReveals();
  const [appearance, dispatch] = useAppearance();
  const changeMode = (mode: typeof appearance.mode) =>
    dispatch({ type: "mode", mode });
  return (
    <div ref={revealRoot}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <main id="main">
        <Hero mode={appearance.mode} onModeChange={changeMode} />
        <Lookbook selections={appearance.selections} />
        <Collection
          selections={appearance.selections}
          onSelectionChange={(id, update) =>
            dispatch({ type: "garment", id, update })
          }
        />
        <section
          className="story section-pad"
          id="story"
          aria-labelledby="story-title"
        >
          <div className="story-copy">
            <p className="mono eyebrow" data-reveal="text">
              03 / THE IDEA
            </p>
            <h2 id="story-title" data-reveal="text" data-reveal-order="1">
              A passing moment.
              <br />
              An endless idea.
            </h2>
            <p data-reveal="text" data-reveal-order="2">
              It started with a sign in a mall. A grid of round lights,
              switching on and off. Simple circles becoming letters, then
              shapes, then something else entirely.
            </p>
            <p data-reveal="text" data-reveal-order="3">
              That idea stayed. What if a whole clothing label could begin with
              that one shape?
            </p>
            <p
              className="story-statement"
              data-reveal="text"
              data-reveal-order="4"
            >
              That's 360. One circle. Whatever comes next.
            </p>
          </div>
          <div className="story-art" data-reveal="image">
            <CircleSign />
          </div>
        </section>
        <Signup />
      </main>
      <footer className="site-footer">
        <a
          href="#top"
          className="footer-brand"
          aria-label="360 back to top"
          data-reveal="text"
        >
          <CircleMark />
        </a>
        <nav
          className="footer-socials"
          aria-label="Social media"
          data-reveal="text"
          data-reveal-order="1"
        >
          <a
            href="https://www.youtube.com/@360-DESIGNS-BRAND"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="footer-social-icon youtube" aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/360designofficial"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="footer-social-icon instagram" aria-hidden="true" />
          </a>
          <a
            href="https://www.tiktok.com/@360.design0"
            aria-label="TikTok"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="footer-social-icon tiktok" aria-hidden="true" />
          </a>
        </nav>
        <a
          href="#top"
          className="back-top mono"
          data-reveal="text"
          data-reveal-order="2"
        >
          BACK TO TOP <ArrowUpRight size={16} />
        </a>
      </footer>
    </div>
  );
}
