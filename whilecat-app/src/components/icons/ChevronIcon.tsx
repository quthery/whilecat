export function ChevronIcon({ width = 24, height = 24, color = "currentColor", direction = "right" }: { width?: number; height?: number; color?: string; direction?: "left" | "right" | "up" | "down" }) {
  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: 270
  }[direction];
  
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: `rotate(${rotation}deg)` }}>
      <polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}