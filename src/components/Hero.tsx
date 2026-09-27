import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { CircleMark } from "./CircleMark";

import CampaignPhoto from "./CampaignPhoto";
import ModeSwitch, { type ModeSwitchProps } from "./ModeSwitch";

const headline = ["Everything", "starts with", "a circle."];

export default function Hero({ mode, onModeChange }: ModeSwitchProps) {
  const [introReady, setIntroReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageInView, setImageInView] = useState(false);
  const imageFrame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    // Let the display font arrive before the lights turn on, without holding
    // the opening indefinitely on a slow connection.
    const start = () => {
      if (active) setIntroReady(true);
    };
    const timeout = window.setTimeout(start, 600);
    void document.fonts.ready.then(() => {
      window.clearTimeout(timeout);
      start();
    });
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const frame = imageFrame.current;
    if (!frame) return;
    if (!("IntersectionObserver" in window)) {
      setImageInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
          setImageInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="hero"
      id="top"
      aria-labelledby="hero-title"
      data-intro={introReady ? "ready" : "pending"}
    >
      <div className="hero-copy">
        <div className="hero-title-group">
          <div className="brand" role="img" aria-label="360">
            <CircleMark />
          </div>
          <h1 id="hero-title">
            {headline.map((line) => (
              <span className="light-line" key={line}>
                {line}
                <span className="light-glow" aria-hidden="true">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-description">
            One simple shape. A world of possibilities.
            <br />
            Monochrome clothing, made of circles.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#collection">
              A FIRST LOOK <ArrowUpRight size={20} />
            </a>
            <ModeSwitch mode={mode} onModeChange={onModeChange} />
          </div>
        </div>
        <div className="hero-bottom">
          <a
            href="#collection"
            className="scroll-link"
            aria-label="Scroll to the first collection"
          >
            <ArrowDown size={19} />
          </a>
        </div>
      </div>
      <div
        className="hero-visual"
        ref={imageFrame}
        data-revealed={introReady && imageLoaded && imageInView}
      >
        <CampaignPhoto mode={mode} onReady={() => setImageLoaded(true)} />
      </div>
    </section>
  );
}
