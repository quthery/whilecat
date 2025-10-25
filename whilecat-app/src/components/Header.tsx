import { SearchIcon } from "./icons/SearchIcon";
import { HeartIcon } from "./icons/HeartIcon";
import { SettingsIcon } from "./icons/SettingsIcon";

export function Header() {
  return (
    <header className="header">
      <div className="search-bar">
        <SearchIcon width={20} height={20} color="#8B92A7" />
        <input
          type="text"
          placeholder="Search for a song"
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <button className="icon-btn" title="Favorites">
          <HeartIcon width={24} height={24} />
        </button>
        <button className="icon-btn" title="Settings">
          <SettingsIcon width={24} height={24} />
        </button>
        <div className="user-profile">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Molly Hunter"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">Molly Hunter</span>
            <span className="user-badge">Premium</span>
          </div>
        </div>
      </div>
    </header>
  );
}