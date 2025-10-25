import { useState } from "react";
import type { Track } from "../App";
import { PlayIcon } from "./icons/PlayIcon";
import { ChevronIcon } from "./icons/ChevronIcon";

type HeroCarouselProps = {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
};

export function HeroCarousel({ tracks, onPlayTrack }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  if (tracks.length === 0) return null;

  const currentTrack = tracks[currentIndex];
  const visibleTracks = [
    tracks[(currentIndex - 1 + tracks.length) % tracks.length],
    currentTrack,
    tracks[(currentIndex + 1) % tracks.length],
  ];

  return (
    <section className="hero-carousel">
      <button className="carousel-btn prev" onClick={goToPrevious}>
        <ChevronIcon width={24} height={24} direction="left" />
      </button>

      <div className="carousel-track">
        {visibleTracks.map((track, idx) => (
          <div
            key={track.id}
            className={`carousel-card ${idx === 1 ? "active" : ""}`}
            style={{
              backgroundImage: `url(${track.artwork_url})`,
            }}
          >
            {idx === 1 && (
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h2 className="carousel-title">{track.title}</h2>
                  <p className="carousel-artist">{track.artist}</p>
                  <button
                    className="play-btn-large"
                    onClick={() => onPlayTrack(track)}
                  >
                    <PlayIcon width={24} height={24} color="#fff" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="carousel-btn next" onClick={goToNext}>
        <ChevronIcon width={24} height={24} direction="right" />
      </button>
    </section>
  );
}