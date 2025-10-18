import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

type RpcResponse = {
  success: boolean;
  message: string;
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  // Track fields
  const [title, setTitle] = useState("Simulated Track");
  const [artist, setArtist] = useState("Simulated Artist");
  const [albumName, setAlbumName] = useState("Sim Album");
  const [albumCover, setAlbumCover] = useState("https://i.pinimg.com/736x/4e/bb/6d/4ebb6dd0a2a63f8bc3a8322d6aa27097.jpg");
  const [shareUrl, setShareUrl] = useState("https://example.com/track");
  const [duration, setDuration] = useState<number>(180);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke<string>("greet", { name }));
  }

  async function playTrackViaRpc() {
    try {
      await invoke("init_discord_rpc");

      const track = {
        title,
        artist,
        album_name: albumName,
        album_cover_url: albumCover,
        share_url: shareUrl,
        duration: Number(duration),
      };

      await invoke<RpcResponse>("set_track_activity", { track });

    } catch (e) {
      setGreetMsg(String(e));
    }
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <section className="row" style={{ marginTop: 12 }}>
        <h3>Simulate / Start Track (RPC)</h3>
        <input value={title} onChange={(e) => setTitle(e.currentTarget.value)} placeholder="Title" />
        <input value={artist} onChange={(e) => setArtist(e.currentTarget.value)} placeholder="Artist" />
        <input value={albumName} onChange={(e) => setAlbumName(e.currentTarget.value)} placeholder="Album name" />
        <input value={albumCover} onChange={(e) => setAlbumCover(e.currentTarget.value)} placeholder="Album cover key/url" />
        <input value={shareUrl} onChange={(e) => setShareUrl(e.currentTarget.value)} placeholder="Share URL" />
        <input
          value={String(duration)}
          onChange={(e) => setDuration(Number(e.currentTarget.value || 0))}
          placeholder="Duration (seconds)"
          type="number"
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={playTrackViaRpc}>Play track via RPC</button>
        </div>
      </section>

      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
