// Tauri Bridge for Excalidraw Desktop
// This script integrates native file operations with Excalidraw

(function() {
  'use strict';

  // Check if we're running in Tauri
  if (!window.__TAURI__) {
    console.log('Not running in Tauri environment');
    return;
  }

  const { invoke } = window.__TAURI__.core;

  // Add save functionality
  window.tauriSaveFile = async function(data, filePath = null) {
    try {
      const path = await invoke('save_excalidraw_file', {
        data: JSON.stringify(data),
        filePath
      });
      console.log('File saved successfully:', path);
      return { success: true, path };
    } catch (error) {
      console.error('Failed to save file:', error);
      return { success: false, error: error.toString() };
    }
  };

  // Add open functionality
  window.tauriOpenFile = async function() {
    try {
      const contents = await invoke('open_excalidraw_file');
      const data = JSON.parse(contents);
      console.log('File opened successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Failed to open file:', error);
      return { success: false, error: error.toString() };
    }
  };

  // Add keyboard shortcuts for save (Ctrl/Cmd+S)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();

      // Try to get Excalidraw data from the global object
      // This is a best-effort approach - may need adjustment based on Excalidraw's API
      const excalidrawContainer = document.querySelector('.excalidraw');
      if (excalidrawContainer) {
        console.log('Save shortcut triggered - Excalidraw detected');
        // The actual save implementation would need to integrate with Excalidraw's API
        // For now, just show that the shortcut is working
        alert('Save functionality available! Use the File menu or call window.tauriSaveFile() from console.');
      }
    }
  });

  // Add keyboard shortcuts for open (Ctrl/Cmd+O)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      console.log('Open shortcut triggered');
      alert('Open functionality available! Use the File menu or call window.tauriOpenFile() from console.');
    }
  });

  console.log('Tauri bridge initialized');
  console.log('Available functions: window.tauriSaveFile(), window.tauriOpenFile()');
})();
