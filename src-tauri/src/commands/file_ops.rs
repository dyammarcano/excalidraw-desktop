use tauri::command;
use std::fs;

#[command]
pub async fn save_excalidraw_file(
    app: tauri::AppHandle,
    data: String,
    file_path: Option<String>,
) -> Result<String, String> {
    use tauri_plugin_dialog::{DialogExt, FilePath};

    let path = if let Some(path) = file_path {
        // Use provided path
        path
    } else {
        // Show save dialog
        let file = app
            .dialog()
            .file()
            .add_filter("Excalidraw", &["excalidraw"])
            .set_file_name("drawing.excalidraw")
            .blocking_save_file();

        match file {
            Some(FilePath::Path(p)) => p.to_string_lossy().to_string(),
            Some(FilePath::Url(u)) => u.to_string(),
            None => return Err("Save cancelled".to_string()),
        }
    };

    // Write file using std::fs
    fs::write(&path, data)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(path)
}

#[command]
pub async fn open_excalidraw_file(app: tauri::AppHandle) -> Result<String, String> {
    use tauri_plugin_dialog::{DialogExt, FilePath};

    // Show open dialog
    let file = app
        .dialog()
        .file()
        .add_filter("Excalidraw", &["excalidraw", "json"])
        .blocking_pick_file();

    let path = match file {
        Some(FilePath::Path(p)) => p.to_string_lossy().to_string(),
        Some(FilePath::Url(u)) => u.to_string(),
        None => return Err("Open cancelled".to_string()),
    };

    // Read file using std::fs
    let contents = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    Ok(contents)
}
