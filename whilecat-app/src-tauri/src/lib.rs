pub mod rpc;
pub use rpc::{
    clear_activity, disconnect_discord_rpc, init_discord_rpc, set_track_activity, DiscordRpcState,
    RpcResponse, Track,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DiscordRpcState::new())
        .invoke_handler(tauri::generate_handler![
            greet,
            init_discord_rpc,
            set_track_activity,
            clear_activity,
            disconnect_discord_rpc
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
