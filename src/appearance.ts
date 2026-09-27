import type { Colorway, DesignId, GarmentSelection } from "./collection.ts";

export type Appearance = {
  mode: Colorway;
  selections: Record<DesignId, GarmentSelection>;
};
type AppearanceAction =
  | { type: "mode"; mode: Colorway }
  | { type: "garment"; id: DesignId; update: Partial<GarmentSelection> };

export function createAppearance(mode: Colorway): Appearance {
  return {
    mode,
    selections: {
      "01": { color: mode, mark: "circle" },
      "02": { color: mode, mark: "circle" },
      "03": { color: mode, mark: "circle" },
      "04": { color: mode, mark: "circle" },
    },
  };
}

export function appearanceReducer(
  state: Appearance,
  action: AppearanceAction,
): Appearance {
  switch (action.type) {
    case "mode": {
      const selections = { ...state.selections };
      for (const id of ["01", "02", "03", "04"] as const) {
        selections[id] = { ...selections[id], color: action.mode };
      }
      return { mode: action.mode, selections };
    }
    case "garment":
      return {
        ...state,
        selections: {
          ...state.selections,
          [action.id]: { ...state.selections[action.id], ...action.update },
        },
      };
  }
}
