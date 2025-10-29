import type { ChangeEvent } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useTrack } from "../hooks/use-track";

const mockTracks = [
  { id: "1", title: "faustian bargain", artist: "КАРОЛЕВСКИ ЗЕРНАДЦАТЬ", desc: "Ambient electronic journey through synthetic consciousness", artwork_url: "https://i1.sndcdn.com/artworks-tgRYyzYhtWYPfQ7w-w6xuNQ-t1080x1080.png", share_url: "https://soundcloud.com/royalxvii/faustian-bargain", duration: 234 },
  { id: "2", title: "faustian bargain", artist: "КАРОЛЕВСКИ ЗЕРНАДЦАТЬ", desc: "Glitch hop beats with nostalgic synthesizers", artwork_url: "https://i1.sndcdn.com/artworks-tgRYyzYhtWYPfQ7w-w6xuNQ-t1080x1080.png", share_url: "https://soundcloud.com/royalxvii/faustian-bargain", duration: 198 },
  { id: "3", title: "faustian bargain", artist: "КАРОЛЕВСКИ ЗЕРНАДЦАТЬ", desc: "Downtempo vibes meets neon cityscapes", artwork_url: "https://i1.sndcdn.com/artworks-tgRYyzYhtWYPfQ7w-w6xuNQ-t1080x1080.png", share_url: "https://soundcloud.com/royalxvii/faustian-bargain", duration: 267 },
  { id: "4", title: "faustian bargain", artist: "КАРОЛЕВСКИ ЗЕРНАДЦАТЬ", desc: "Fast-paced breakbeat with terminal aesthetics", artwork_url: "https://i1.sndcdn.com/artworks-tgRYyzYhtWYPfQ7w-w6xuNQ-t1080x1080.png", share_url: "https://soundcloud.com/royalxvii/faustian-bargain", duration: 189 },
  { id: "5", title: "faustian bargain", artist: "КАРОЛЕВСКИ ЗЕРНАДЦАТЬ", desc: "Deep atmospheric soundscape with digital rain", artwork_url: "https://i1.sndcdn.com/artworks-tgRYyzYhtWYPfQ7w-w6xuNQ-t1080x1080.png", share_url: "https://soundcloud.com/royalxvii/faustian-bargain", duration: 301 },
];

const Index = () => {
  const {
    isPlaying,
    currentTrack,
    currentIndex,
    progress,
    volume,
    currentTime,
    soundcloudLink,

    setVolume,
    setSoundcloudLink,
    togglePlay,
    play,
    pause,
  } = useTrack();

  const active = currentTrack ?? mockTracks[currentIndex ?? 0] ?? mockTracks[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderProgressBar = () => {
    const totalChars = 50;
    const filled = Math.floor((progress / 100) * totalChars);
    const empty = totalChars - filled;
    return "[" + "=".repeat(filled) + " ".repeat(empty) + "]";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 scanline">
      <div className="max-w-fit mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-primary pb-6">
          <div className="flex items-start justify-between mb-4">
            <pre className="text-primary glow-text text-sm">
{`
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓████████▓▒░▒▓██████▓▒░ ░▒▓██████▓▒░▒▓████████▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓████████▓▒░ ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░     
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░     
 ░▒▓█████████████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓████████▓▒░▒▓████████▓▒░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░     

`}
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-accent hover:bg-muted border border-primary"
            >
              <User className="h-10 w-10" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="$ paste soundcloud link here..."
              value={soundcloudLink}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSoundcloudLink(e.target.value)}
              className="flex-1 bg-input border-primary text-foreground placeholder:text-muted-foreground font-mono"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-accent hover:bg-muted border border-primary"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Player */}
        <div className="terminal-border bg-card p-6 mb-6">
          <div className="mb-6 flex gap-6">
            {/* Album Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 terminal-border bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">♪</div>
                  <div className="text-xs">TRACK {(currentIndex ?? 0) + 1}</div>
                </div>
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1">
              <div className="text-accent mb-2">$ player --now-playing</div>
              <div className="text-primary text-xl glow-text mb-2">
                &gt; {active.title}
              </div>
              <div className="text-muted-foreground mb-3">artist: {active.artist}</div>
              <div className="text-sm text-foreground/80 border-l-2 border-primary pl-3">{active.desc}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 font-mono text-xs">
            <div className="text-primary">{renderProgressBar()}</div>
            <div className="flex justify-between text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(active.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                const prev = ((currentIndex ?? 0) - 1 + mockTracks.length) % mockTracks.length;
                await play(mockTracks[prev], prev);
              }}
              className="text-primary hover:text-accent hover:bg-muted border border-primary"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-primary hover:text-accent hover:bg-muted border-2 border-primary h-12 w-12 glow-text"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                const next = ((currentIndex ?? 0) + 1) % mockTracks.length;
                await play(mockTracks[next], next);
              }}
              className="text-primary hover:text-accent hover:bg-muted border border-primary"
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <Volume2 className="h-4 w-4 text-primary" />
              <div className="w-24">
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              <span className="text-xs text-muted-foreground w-8">{Array.isArray(volume) ? volume[0] : volume}%</span>
            </div>
          </div>

          {/* Status */}
          <div className="text-xs text-muted-foreground font-mono border-t border-border pt-3">
            <div>status: {isPlaying ? "[PLAYING]" : "[PAUSED]"}</div>
            <div>volume: {Array.isArray(volume) ? volume[0] : volume}%</div>
            <div>bitrate: 320kbps</div>
          </div>
        </div>

        {/* Playlist */}
        <div className="terminal-border bg-card p-6">
          <div className="text-accent mb-4">$ player --list-queue</div>
          <div className="space-y-2">
            {mockTracks.map((track, index) => (
              <div
                key={track.id}
                onClick={async () => {
                  await play(track, index);
                }}
                className={`font-mono text-sm cursor-pointer hover:text-accent transition-colors p-2 hover:bg-muted ${
                  index === (currentIndex ?? 0) ? "text-primary glow-text bg-muted" : "text-muted-foreground"
                }`}
              >
                <span className="text-accent">{index + 1}.</span> {track.title}
                <span className="float-right">[{formatTime(track.duration)}]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground font-mono">
          <div>$ system_status: [ONLINE] | uptime: 99.99% | latency: 12ms</div>
          <div className="mt-2">press CTRL+C to exit | type 'help' for commands</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
