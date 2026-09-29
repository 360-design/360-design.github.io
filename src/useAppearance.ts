import { useLayoutEffect, useReducer } from "react";
import { appearanceReducer, createAppearance } from "./appearance";

export function useAppearance() {
  const [appearance, dispatch] = useReducer(appearanceReducer, undefined, () =>
    createAppearance(
      typeof document !== "undefined" &&
        document.documentElement.dataset.mode === "White"
        ? "White"
        : "Black",
    ),
  );

  useLayoutEffect(() => {
    const { mode } = appearance;
    document.documentElement.dataset.mode = mode;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", mode === "White" ? "#eeede8" : "#111110");
    try {
      localStorage.setItem("360-mode", mode);
    } catch {
      // The control still works when browser storage is unavailable.
    }
  }, [appearance.mode]);

  return [appearance, dispatch] as const;
}
