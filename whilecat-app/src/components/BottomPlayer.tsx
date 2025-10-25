import type { Track } from "../App";
import { PlayIcon } from "./icons/PlayIcon";
import { PauseIcon } from "./icons/PauseIcon";
import { SkipBackIcon } from "./icons/SkipBackIcon";
import { SkipForwardIcon } from "./icons/SkipForwardIcon";
import { ShuffleIcon } from "./icons/ShuffleIcon";
import { RepeatIcon } from "./icons/RepeatIcon";
import { HeartIcon } from "./icons/HeartIcon";
import { VolumeIcon } from "./icons/VolumeIcon";

type BottomPlayerProps = {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
};

export function BottomPlayer({
  track,
  isPlaying,
  currentTime,
  volume,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
}: BottomPlayerProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = track ? (currentTime / track.duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = Math.floor(percentage * track.duration);
    onSeek(newTime);
  };

  if (!track) {
    return (
      <div className="bottom-player">
        <div className="player-empty">
          <span>No track playing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-player">
      <div className="player-track-info">
        <img src={track.artwork_url} alt={track.title} className="player-artwork" />
        <div className="player-details">
          <h4 className="player-title">{track.title}</h4>
          <p className="player-artist">{track.artist}</p>
        </div>
        <button className="player-icon-btn">
          <HeartIcon width={20} height={20} />
        </button>
      </div>

      <div className="player-controls-section">
        <div className="player-controls">
          <button className="player-control-btn">
            <ShuffleIcon width={18} height={18} />
          </button>
          <button className="player-control-btn" onClick={onPrev}>
            <SkipBackIcon width={20} height={20} />
          </button>
          <button className="player-play-btn" onClick={onPlayPause}>
            {isPlaying ? (
              <PauseIcon width={24} height={24} />
            ) : (
              <PlayIcon width={24} height={24} />
            )}
          </button>
          <button className="player-control-btn" onClick={onNext}>
            <SkipForwardIcon width={20} height={20} />
          </button>
          <button className="player-control-btn">
            <RepeatIcon width={18} height={18} />
          </button>
        </div>

        <div className="player-progress">
          <span className="progress-time">{formatTime(currentTime)}</span>
          <div className="progress-bar-container" onClick={handleProgressClick}>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <span className="progress-time">{formatTime(track.duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <VolumeIcon width={20} height={20} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
}