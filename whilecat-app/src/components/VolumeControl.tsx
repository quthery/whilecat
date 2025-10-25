type VolumeControlProps = {
  volume: number;
  onVolumeChange: (volume: number) => void;
};

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const getVolumeIcon = () => {
    if (volume === 0) return "🔇";
    if (volume < 50) return "🔉";
    return "🔊";
  };

  return (
    <div className="volume-control">
      <span className="volume-icon">{getVolumeIcon()}</span>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="volume-slider"
      />
      <span className="volume-value">{volume}%</span>
    </div>
  );
}