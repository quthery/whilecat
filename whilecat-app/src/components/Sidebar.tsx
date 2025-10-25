import { useState } from "react";
import { MusicIcon } from "./icons/MusicIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { GridIcon } from "./icons/GridIcon";
import { UserIcon } from "./icons/UserIcon";
import { PlaylistIcon } from "./icons/PlaylistIcon";
import { LogoutIcon } from "./icons/LogoutIcon";
import { ChevronIcon } from "./icons/ChevronIcon";

export function Sidebar() {
  const [isPlaylistsOpen, setIsPlaylistsOpen] = useState(true);

  const playlists = [
    { id: "1", name: "Vibes & Chill", icon: "🎵" },
    { id: "2", name: "Morning Boost", icon: "☀️" },
    { id: "3", name: "Rhythm & Energy", icon: "⚡" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          
          <span className="logo-text">whilecat</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">
          <HomeIcon width={20} height={20} />
          <span>Home</span>
        </button>
        
        <button className="nav-item">
          <GridIcon width={20} height={20} />
          <span>Categories</span>
        </button>
        
        <button className="nav-item">
          <UserIcon width={20} height={20} />
          <span>Artists</span>
        </button>
        
        <button
          className={`nav-item ${isPlaylistsOpen ? "open" : ""}`}
          onClick={() => setIsPlaylistsOpen(!isPlaylistsOpen)}
        >
          <PlaylistIcon width={20} height={20} />
          <span>Playlists</span>
          <ChevronIcon
            width={16}
            height={16}
            direction={isPlaylistsOpen ? "down" : "right"}
          />
        </button>

        {isPlaylistsOpen && (
          <div className="playlist-submenu">
            {playlists.map((playlist) => (
              <button key={playlist.id} className="playlist-item">
                <span className="playlist-icon">{playlist.icon}</span>
                <span>{playlist.name}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogoutIcon width={20} height={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}