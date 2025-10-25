export function GridIcon({ width = 24, height = 24, color = "currentColor" }: { width?: number; height?: number; color?: string }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
    </svg>
  );
}