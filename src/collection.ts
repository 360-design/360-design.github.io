export type Colorway = "Black" | "White";
export type ChestMark = "circle" | "360";
export type GarmentView = "Back" | "Front";
export type DesignId = "01" | "02" | "03" | "04" | "05" | "06";
export type GarmentSelection = { color: Colorway; mark: ChestMark };
export type Design = {
  id: DesignId;
  name: string;
  type: string;
  garment: "hoodie" | "tee";
  artwork: "world" | "time" | "smiley" | "butterfly" | "circle" | "360";
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
  {
    id: "05",
    name: "Full circle",
    type: "Circle tee",
    garment: "tee",
    artwork: "circle",
    description:
      "The 360 circle, drawn in small rings and printed large on the back. Choose a circle or 360 mark for the front.",
  },
  {
    id: "06",
    name: "A new angle",
    type: "90° tee",
    garment: "tee",
    artwork: "360",
    description:
      "Our circle-built 360, turned 90 degrees clockwise down the back. 3 at the top, 0 at the bottom. Your choice of mark on the front.",
  },
];
