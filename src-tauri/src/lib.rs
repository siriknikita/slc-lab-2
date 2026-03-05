// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JiraTicket {
    pub key: String,
    pub summary: String,
    pub status: String,
}

/// Mock Jira tickets for demo. No real API calls.
fn mock_tickets() -> Vec<JiraTicket> {
    vec![
        JiraTicket {
            key: "PROJ-1".into(),
            summary: "Add login screen".into(),
            status: "Done".into(),
        },
        JiraTicket {
            key: "PROJ-2".into(),
            summary: "Fix navigation bug".into(),
            status: "Done".into(),
        },
        JiraTicket {
            key: "PROJ-3".into(),
            summary: "Update dependencies".into(),
            status: "Done".into(),
        },
    ]
}

#[tauri::command]
fn fetch_tickets(keys: Vec<String>) -> Vec<JiraTicket> {
    let mock = mock_tickets();
    if keys.is_empty() {
        return mock;
    }
    keys.into_iter()
        .map(|key| {
            mock.iter()
                .find(|t| t.key.eq_ignore_ascii_case(&key))
                .cloned()
                .unwrap_or_else(|| JiraTicket {
                    key: key.clone(),
                    summary: format!("[Mock] Ticket {}", key),
                    status: "Unknown".into(),
                })
        })
        .collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fetch_tickets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
