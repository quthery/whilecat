export function SkipForwardIcon({ width = 24, height = 24, color = "currentColor" }: { width?: number; height?: number; color?: string }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="5 4 15 12 5 20 5 4" fill={color}/>
      <line x1="19" y1="5" x2="19" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}