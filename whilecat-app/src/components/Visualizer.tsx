import { useState, useEffect, useRef } from "react";

type VisualizerProps = {
  isPlaying: boolean;
};

export function Visualizer({ isPlaying }: VisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(40).fill(0));
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setBars((prevBars) =>
          prevBars.map((_, index) => {
            // Create wave-like pattern
            const time = Date.now() / 1000;
            const wave1 = Math.sin(time * 2 + index * 0.3) * 30;
            const wave2 = Math.sin(time * 3 - index * 0.2) * 20;
            const random = Math.random() * 15;
            const base = 40 + wave1 + wave2 + random;
            return Math.max(5, Math.min(100, base));
          })
        );
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Smooth fade out
      const fadeOut = () => {
        setBars((prevBars) => {
          const newBars = prevBars.map((height) => Math.max(0, height - 5));
          if (newBars.some((h) => h > 0)) {
            requestAnimationFrame(fadeOut);
          }
          return newBars;
        });
      };
      fadeOut();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="visualizer-panel">
      <div className="visualizer-header">
        <span className="panel-icon">≋</span>
        <span>SPECTRUM</span>
      </div>
      <div className="visualizer-vertical">
        {bars.map((height, index) => (
          <div
            key={index}
            className="visualizer-bar-vertical"
            style={{
              width: `${height}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}