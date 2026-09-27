import { useEffect, useState } from "react";
import { signDesigns, signInterval, signSize } from "../sign-artwork";
import { ringRadius, ringStroke } from "../artwork";
import "./circle-sign.css";

function renderLight(cell: number) {
  return (
    <circle
      key={cell}
      cx={(cell % signSize) + 0.5}
      cy={Math.floor(cell / signSize) + 0.5}
      r={ringRadius}
    />
  );
}

const gridLights = Array.from({ length: signSize ** 2 }, (_, cell) =>
  renderLight(cell),
);

export default function CircleSign() {
  const [index, setIndex] = useState(0);
  const design = signDesigns[index];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const update = () => {
      window.clearInterval(timer);
      timer = undefined;
      if (!document.hidden && !reducedMotion.matches) {
        timer = window.setInterval(() => {
          setIndex((current) => (current + 1) % signDesigns.length);
        }, signInterval);
      }
    };
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);
    update();
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <div className="circle-sign" data-design={design.id}>
      <svg
        viewBox={`0 0 ${signSize} ${signSize}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={ringStroke}
        role="img"
        aria-label="Circle-light sign displaying the 360 logo, circle, world map, Good things take time, smiley and butterfly designs"
      >
        <g className="circle-sign-grid">{gridLights}</g>
        <g key={design.id} className="circle-sign-artwork">
          {[...design.cells].map(renderLight)}
        </g>
      </svg>
    </div>
  );
}
