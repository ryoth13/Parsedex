use notify_rust::Notification;
use tauri::AppHandle;
use std::env;
use std::path::MAIN_SEPARATOR as SEP;

#[derive(serde::Deserialize)]
pub struct NotificationParams {
    title: String,
    body: String,
    icon: String,
}

// 用于前端调用发送系统通知
#[tauri::command]
pub fn send_system_notification(app: AppHandle, params: NotificationParams) -> Result<(), String> {
    let mut notifi_app = Notification::new();
    #[cfg(target_os = "macos")]
    {
        let _ = notify_rust::set_application(if tauri::is_dev() {
            "com.apple.Terminal"
        } else {
            &app.config().identifier
        });
    }
    #[cfg(windows)]
    {
        let curr_dir = env::current_exe()
            .ok()
            .and_then(|p| p.parent().map(|p| p.to_path_buf()))
            .map(|p| p.to_string_lossy().into_owned())
            .unwrap_or_default();
        // set the notification's System.AppUserModel.ID only when running the installed app
        if !(curr_dir.ends_with(format!("{SEP}target{SEP}debug").as_str())
            || curr_dir.ends_with(format!("{SEP}target{SEP}release").as_str()))
        {
            notifi_app.app_id(&app.config().identifier);
        }
    }
    if !params.icon.is_empty() {
        notifi_app.icon(&params.icon);
    } else {
        notifi_app.auto_icon();
    }
    tauri::async_runtime::spawn(async move {
        let _ = notifi_app
            .summary(&params.title)
            .body(&params.body)
            .show()
            .expect("show notification failed");
    });
    Ok(())
}
 
