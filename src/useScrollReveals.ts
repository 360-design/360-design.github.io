import { useEffect, useRef } from "react";
import "./scroll-reveals.css";

export function useScrollReveals() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = root.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!page || reducedMotion.matches || !("IntersectionObserver" in window)) {
      return;
    }

    const targets = [...page.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.08 &&
            entry.target.getAttribute("data-reveal-state") === "pending"
          ) {
            if (entry.target.matches(":focus-within")) {
              entry.target.removeAttribute("data-reveal-state");
            } else {
              entry.target.setAttribute("data-reveal-state", "visible");
            }
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );

    for (const target of targets) {
      const bounds = target.getBoundingClientRect();
      // Keep restored scroll positions and direct section links visible on load.
      if (bounds.top < window.innerHeight && bounds.bottom > 0) continue;
      target.dataset.revealState = "pending";
      observer.observe(target);
    }

    const finish = (target: HTMLElement) => {
      delete target.dataset.revealState;
      observer.unobserve(target);
    };
    const onAnimationEnd = (event: AnimationEvent) => {
      if (
        event.animationName.startsWith("scroll-reveal-") &&
        event.target instanceof HTMLElement
      ) {
        finish(event.target);
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-reveal-state]");
      if (target && page.contains(target)) finish(target);
    };
    const revealAll = () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        for (const target of targets) delete target.dataset.revealState;
      }
    };

    page.addEventListener("animationend", onAnimationEnd);
    page.addEventListener("focusin", onFocus);
    reducedMotion.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      page.removeEventListener("animationend", onAnimationEnd);
      page.removeEventListener("focusin", onFocus);
      reducedMotion.removeEventListener("change", revealAll);
      for (const target of targets) delete target.dataset.revealState;
    };
  }, []);

  return root;
}
