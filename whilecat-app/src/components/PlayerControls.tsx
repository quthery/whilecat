type PlayerControlsProps = {
  isPlaying: boolean;
  hasTrack: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export function PlayerControls({
  isPlaying,
  hasTrack,
  onPlayPause,
  onStop,
  onNext,
  onPrev,
}: PlayerControlsProps) {
  return (
    <div className="controls">
      <button className="control-btn" onClick={onPrev} disabled={!hasTrack} title="Previous">
        ⏮
      </button>
      <button
        className="control-btn play-btn"
        onClick={onPlayPause}
        disabled={!hasTrack}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button className="control-btn" onClick={onStop} disabled={!hasTrack} title="Stop">
        ⏹
      </button>
      <button className="control-btn" onClick={onNext} disabled={!hasTrack} title="Next">
        ⏭
      </button>
    </div>
  );
}