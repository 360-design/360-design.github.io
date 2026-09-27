const digits = [
  ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
];

export function CircleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 178 70"
      fill="none"
      aria-hidden="true"
    >
      {digits.flatMap((digit, index) =>
        digit.flatMap((row, y) =>
          [...row].map((cell, x) =>
            cell === "1" ? (
              <circle
                key={`${index}-${y}-${x}`}
                cx={5 + index * 62 + x * 10}
                cy={5 + y * 10}
                r="3.25"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            ) : null,
          ),
        ),
      )}
    </svg>
  );
}
