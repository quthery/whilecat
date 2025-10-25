import type { Track } from "../App";

type TrackInfoProps = {
  track: Track | null;
};

export function TrackInfo({ track }: TrackInfoProps) {
  if (!track) {
    return (
      <div className="track-info-panel empty">
        <div className="empty-state">
          <div className="empty-icon">♪</div>
          <div className="empty-text">No track selected</div>
          <div className="empty-subtext">Select a track from the playlist to start</div>
        </div>
      </div>
    );
  }

  return (
    <div className="track-info-panel">
      <div className="artwork-section">
        <div className="artwork-wrapper">
          <img
            src={track.artwork_url}
            alt={`${track.title} artwork`}
            className="artwork-image"
          />
          <div className="artwork-glow"></div>
        </div>
      </div>
      <div className="track-details">
        <div className="track-label">NOW PLAYING</div>
        <h1 className="track-title-large">{track.title}</h1>
        <h2 className="track-artist-large">{track.artist}</h2>
        <p className="track-description">{track.desc}</p>
      </div>
    </div>
  );
}