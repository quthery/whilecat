import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { SongGrid } from "./components/SongGrid";
import { BottomPlayer } from "./components/BottomPlayer";

type RpcResponse = {
  success: boolean;
  message: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  desc: string;
  artwork_url: string;
  share_url: string;
  duration: number;
};

function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock data
  const mockTracks: Track[] = [
    {
      id: "1",
      title: "саунд",
      artist: "akiko!,kouru",
      desc: "A nostalgic journey through time",
      artwork_url: "https://i1.sndcdn.com/artworks-RRYMTdHuEaOKoWn5-L0LzxA-t500x500.jpg",
      share_url: "https://example.com/track1",
      duration: 240,
    },
    {
      id: "2",
      title: "Fading Horizon",
      artist: "Ella Hunt",
      desc: "Dreamy electronic soundscapes",
      artwork_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
      share_url: "https://example.com/track2",
      duration: 195,
    },
    {
      id: "3",
      title: "Waves of Time",
      artist: "Lana Rivera",
      desc: "Ambient waves of emotion",
      artwork_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      share_url: "https://example.com/track3",
      duration: 210,
    },
    {
      id: "4",
      title: "Electric Dreams",
      artist: "Mia Lowell",
      desc: "Vibrant electronic beats",
      artwork_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
      share_url: "https://example.com/track4",
      duration: 225,
    },
    {
      id: "5",
      title: "Shadows & Light",
      artist: "Ryan Miles",
      desc: "Contrast in musical form",
      artwork_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop",
      share_url: "https://example.com/track5",
      duration: 198,
    },
    {
      id: "6",
      title: "Echoes of Midnight",
      artist: "Jon Hickman",
      desc: "Dark and mysterious vibes",
      artwork_url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
      share_url: "https://example.com/track6",
      duration: 267,
    },
  ];

  const playTrack = async (track: Track) => {
    try {
      await invoke("init_discord_rpc");
      await invoke<RpcResponse>("set_track_activity", { track });

      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
    } catch (e) {
      console.error("Error playing track:", e);
    }
  };

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    if (currentTrack) {
      const currentIndex = mockTracks.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % mockTracks.length;
      playTrack(mockTracks[nextIndex]);
    }
  };

  const prevTrack = () => {
    if (currentTrack) {
      const currentIndex = mockTracks.findIndex((t) => t.id === currentTrack.id);
      const prevIndex = (currentIndex - 1 + mockTracks.length) % mockTracks.length;
      playTrack(mockTracks[prevIndex]);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  return (
    <div className="app">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <div className="content-scroll">
          <HeroCarousel tracks={mockTracks.slice(0, 3)} onPlayTrack={playTrack} />
          
          <SongGrid
            tracks={mockTracks}
            currentTrack={currentTrack}
            onPlayTrack={playTrack}
          />
        </div>
      </div>

      <BottomPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        volume={volume}
        onPlayPause={togglePlayPause}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={handleSeek}
        onVolumeChange={setVolume}
      />
    </div>
  );
}

export default App;