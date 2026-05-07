export default function ArrowIcon({
  direction,
}: {
  direction: "previous" | "next";
}) {
  const arrowIconPath =
    direction === "previous" ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18";

  return (
    <svg
      aria-hidden="true"
      className="eventloop-popular-events-arrow-icon"
      viewBox="0 0 24 24"
    >
      <path d={arrowIconPath} />
    </svg>
  );
}
