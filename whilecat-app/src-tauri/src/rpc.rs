use discord_rich_presence::{DiscordIpc, DiscordIpcClient, activity};
use serde::{Deserialize, Serialize};
use tauri::State;
use std::sync::Mutex;

const APP_ID: &str = "1429098698268344452";

#[derive(Debug, Serialize)]
pub struct RpcResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Track {
    pub title: String,
    pub artist: String,
    pub album_name: String,
    pub album_cover_url: String,
    pub share_url: String,
    pub duration: u64,
}

pub struct DiscordRpcState(pub Mutex<Option<DiscordIpcClient>>);

impl DiscordRpcState {
    pub fn new() -> Self {
        Self(Mutex::new(None))
    }
}

#[tauri::command]
pub async fn init_discord_rpc(
    state: State<'_, DiscordRpcState>,
) -> Result<RpcResponse, String> {
    let mut client = DiscordIpcClient::new(APP_ID);

    client.connect()
        .map_err(|e| format!("Failed to connect to Discord: {}", e))?;
    
    *state.0.lock().unwrap() = Some(client);
    
    println!("[RPC] Discord RPC initialized");
    Ok(RpcResponse {
        success: true,
        message: "Discord RPC initialized successfully".to_string(),
    })
}

#[tauri::command]
pub async fn set_track_activity(
    state: State<'_, DiscordRpcState>,
    track: Track,
) -> Result<RpcResponse, String> {
    let mut state_guard = state.0.lock().unwrap();
    
    if let Some(client) = state_guard.as_mut() {
        let start_time = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_err(|e| format!("Time error: {}", e))?
            .as_secs() as i64;
        
        let end_time = start_time + track.duration as i64;

        let activity = activity::Activity::new()
            .details(&track.title)
            .state(&track.album_name)
            .assets(
                activity::Assets::new()
                    .large_image(&track.album_cover_url)
                    .large_text(&track.album_name),
            )
            .timestamps(
                activity::Timestamps::new()
                    .start(start_time)
                    .end(end_time),
            )
            .buttons(vec![
                activity::Button::new("Слушать в SoundCloud", &track.share_url),
            ])
            .activity_type(activity::ActivityType::Listening);

        client.set_activity(activity)
            .map_err(|e| format!("Failed to set activity: {}", e))?;

        println!("[RPC] Activity set: {} - {}", track.artist, track.title);
        
        Ok(RpcResponse {
            success: true,
            message: format!("Now playing: {} - {}", track.artist, track.title),
        })
    } else {
        Err("Discord RPC not initialized. Call init_discord_rpc first.".to_string())
    }
}

#[tauri::command]
pub async fn clear_activity(
    state: State<'_, DiscordRpcState>,
) -> Result<RpcResponse, String> {
    let mut state_guard = state.0.lock().unwrap();
    
    if let Some(client) = state_guard.as_mut() {
        client.clear_activity()
            .map_err(|e| format!("Failed to clear activity: {}", e))?;
        
        println!("[RPC] Activity cleared");
        
        Ok(RpcResponse {
            success: true,
            message: "Activity cleared".to_string(),
        })
    } else {
        Err("Discord RPC not initialized".to_string())
    }
}

#[tauri::command]
pub async fn disconnect_discord_rpc(
    state: State<'_, DiscordRpcState>,
) -> Result<RpcResponse, String> {
    let mut state_guard = state.0.lock().unwrap();
    
    if let Some(client) = state_guard.take() {
        // DiscordIpcClient автоматически закрывает соединение при drop
        drop(client);
        
        println!("[RPC] Discord RPC disconnected");
        
        Ok(RpcResponse {
            success: true,
            message: "Discord RPC disconnected".to_string(),
        })
    } else {
        Err("Discord RPC not initialized".to_string())
    }
}