import type { Track } from "../App";

type PlaylistProps = {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
};

export function Playlist({ tracks, currentTrack, onTrackSelect }: PlaylistProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="playlist-panel">
      <div className="panel-header">
        <span className="panel-icon">♪</span>
        <span>PLAYLIST</span>
      </div>
      <div className="playlist-content">
        {tracks.map((track, index) => (
          <div
            key={index}
            className={`playlist-item ${currentTrack?.title === track.title ? "active" : ""}`}
            onClick={() => onTrackSelect(track)}
          >
            <div className="track-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="track-info">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist}</div>
            </div>
            <div className="track-duration">{formatTime(track.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}