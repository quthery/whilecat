import type { Track } from "../App";
import { PlayIcon } from "./icons/PlayIcon";
import { ChevronIcon } from "./icons/ChevronIcon";
import { ViewsIcon } from "./icons/ViewsIcon";

type SongGridProps = {
  tracks: Track[];
  currentTrack: Track | null;
  onPlayTrack: (track: Track) => void;
};

export function SongGrid({ tracks, currentTrack, onPlayTrack }: SongGridProps) {
  return (
    <section className="song-section">
      <div className="section-header">
        <h3 className="section-title">Popular songs</h3>
        <div className="section-nav">
          <button className="nav-arrow">
            <ChevronIcon width={20} height={20} direction="left" />
          </button>
          <button className="nav-arrow">
            <ChevronIcon width={20} height={20} direction="right" />
          </button>
        </div>
      </div>

      <div className="song-grid">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`song-card ${currentTrack?.id === track.id ? "playing" : ""}`}
          >
            <div className="song-artwork">
              <img src={track.artwork_url} alt={track.title} />
              <button
                className="song-play-btn"
                onClick={() => onPlayTrack(track)}
              >
                <PlayIcon width={20} height={20} color="#fff" />
              </button>
            </div>
            <div className="song-info">
              <h4 className="song-title">{track.title}</h4>
              <div className="small-text">
                <p className="song-artist">{track.artist}</p>
                <div className="views-sec">
                  <p className="views">12398</p>
                  <ViewsIcon/> 
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}