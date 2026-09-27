export type Colorway = "Black" | "White";
export type ChestMark = "circle" | "360";
export type GarmentView = "Back" | "Front";
export type DesignId = "01" | "02" | "03" | "04";
export type GarmentSelection = { color: Colorway; mark: ChestMark };
export type Design = {
  id: DesignId;
  name: string;
  type: string;
  garment: "hoodie" | "tee";
  artwork: "world" | "time" | "smiley" | "butterfly";
  description: string;
};

export const designs: Design[] = [
  {
    id: "01",
    name: "A brighter tomorrow",
    type: "World hoodie",
    garment: "hoodie",
    artwork: "world",
    description:
      "A world made of circles. A reminder that we are all part of something bigger. The first 360 hoodie concept, in black and white.",
  },
  {
    id: "02",
    name: "Good things take time",
    type: "Time tee",
    garment: "tee",
    artwork: "time",
    description:
      "Four words to live a little slower by. Built one circle at a time, on an everyday tee.",
  },
  {
    id: "03",
    name: "A little more happy",
    type: "Smiley tee",
    garment: "tee",
    artwork: "smiley",
    description:
      "The simplest expression, drawn with the simplest shape. A circle-made smile for the everyday.",
  },
  {
    id: "04",
    name: "Change is a good thing",
    type: "Butterfly hoodie",
    garment: "hoodie",
    artwork: "butterfly",
    description:
      "Small circles come together as a butterfly. An open invitation to grow, change, and begin again.",
  },
];
