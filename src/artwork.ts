export type GridCell = readonly [number, number];
export type CircleGrid = {
  columns: number;
  rows: number;
  cells: GridCell[];
};

// Every print uses the same square lattice. The complete stroke diameter is
// 0.68 cells, leaving a 0.32-cell gap even between horizontal neighbours.
export const ringRadius = 0.28;
export const ringStroke = 0.12;

function grid(
  columns: number,
  rows: number,
  active: (x: number, y: number) => boolean,
): CircleGrid {
  const cells: GridCell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) if (active(x, y)) cells.push([x, y]);
  }
  return { columns, rows, cells };
}

const letters = {
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "0": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
};

function lettering(lines: (keyof typeof letters)[][]): CircleGrid {
  const columns = Math.max(...lines.map((line) => line.length * 6 - 1));
  const cells: GridCell[] = [];
  lines.forEach((line, lineIndex) => {
    const offset = (columns - (line.length * 6 - 1)) / 2;
    line.forEach((letter, index) =>
      letters[letter].forEach((row, y) => {
        [...row].forEach((value, x) => {
          if (value === "1")
            cells.push([offset + index * 6 + x, lineIndex * 10 + y]);
        });
      }),
    );
  });
  return { columns, rows: lines.length * 10 - 3, cells };
}

function inPolygon(x: number, y: number, points: GridCell[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

// Simplified continent silhouettes, sampled onto the lattice rather than
// approximated by free-positioned dots along coastlines.
const continents: GridCell[][] = [
  [
    [1, 5],
    [5, 3],
    [9, 3],
    [11, 1],
    [15, 2],
    [14, 5],
    [12, 6],
    [14, 8],
    [12, 10],
    [10, 10],
    [9, 13],
    [7, 12],
    [5, 9],
    [3, 8],
    [2, 6],
  ],
  [
    [8, 12],
    [10, 12],
    [11, 14],
    [13, 15],
    [13, 17],
    [11, 16],
    [10, 14],
  ],
  [
    [12, 16],
    [15, 15],
    [18, 17],
    [19, 20],
    [17, 23],
    [16, 26],
    [14, 29],
    [13, 25],
    [13, 22],
    [11, 19],
  ],
  [
    [16, 1],
    [20, 0],
    [21, 2],
    [19, 5],
    [17, 5],
    [16, 3],
  ],
  [
    [23, 7],
    [25, 5],
    [26, 2],
    [28, 3],
    [27, 6],
    [30, 5],
    [32, 3],
    [37, 3],
    [39, 4],
    [42, 4],
    [44, 7],
    [42, 9],
    [40, 9],
    [41, 11],
    [38, 12],
    [37, 15],
    [35, 13],
    [33, 12],
    [32, 15],
    [30, 11],
    [27, 10],
    [25, 10],
  ],
  [
    [23, 11],
    [27, 10],
    [30, 13],
    [29, 17],
    [27, 21],
    [25, 22],
    [24, 18],
    [22, 15],
    [21, 13],
  ],
  [
    [29, 20],
    [30, 19],
    [30, 23],
    [29, 24],
  ],
  [
    [34, 16],
    [36, 16],
    [38, 18],
    [40, 18],
    [40, 19],
    [37, 19],
    [35, 18],
  ],
  [
    [39, 22],
    [42, 21],
    [44, 23],
    [44, 26],
    [40, 26],
    [37, 25],
    [37, 23],
  ],
  [
    [43, 12],
    [44, 10],
    [45, 10],
    [44, 13],
  ],
  [
    [45, 26],
    [46, 25],
    [46, 28],
    [45, 29],
  ],
];

export const artworkGrids = {
  circle: grid(21, 21, (x, y) => {
    const distance = Math.hypot(x - 10, y - 10);
    return distance > 6.5 && distance < 9.4;
  }),
  "360": lettering([["3", "6", "0"]]),
  time: lettering([
    ["G", "O", "O", "D"],
    ["T", "H", "I", "N", "G", "S"],
    ["T", "A", "K", "E"],
    ["T", "I", "M", "E"],
  ]),
  smiley: grid(31, 31, (x, y) => {
    const outside = Math.hypot(x - 15, y - 15);
    const smile = Math.hypot(x - 15, y - 14);
    return (
      (outside >= 12.5 && outside < 13.5) ||
      ((x === 10 || x === 20) && (y === 10 || y === 11)) ||
      (y >= 18 && smile >= 8.5 && smile < 9.5)
    );
  }),
  butterfly: grid(35, 29, (x, y) => {
    const offset = Math.abs(x - 17);
    return (
      inPolygon(offset, y, [
        [1, 14],
        [3, 9],
        [9, 5],
        [15, 1],
        [16, 6],
        [14, 12],
        [9, 16],
        [3, 17],
      ]) ||
      inPolygon(offset, y, [
        [1, 17],
        [7, 16],
        [12, 18],
        [11, 22],
        [7, 27],
        [4, 24],
        [2, 20],
      ]) ||
      (offset === 0 && y >= 11 && y <= 23) ||
      (y >= 5 && y <= 10 && offset === 11 - y)
    );
  }),
  world: grid(47, 31, (x, y) =>
    continents.some((polygon) => inPolygon(x, y, polygon)),
  ),
} satisfies Record<string, CircleGrid>;
