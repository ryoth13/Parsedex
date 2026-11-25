// Prevents additional console window on Windows in release
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub async fn open_url(_: tauri::AppHandle, url: String) {
    open::that(url).unwrap();
}

mod notifications;
use notifications::send_system_notification;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, send_system_notification])
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
