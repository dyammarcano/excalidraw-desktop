# Excalidraw Desktop

A native desktop application for [Excalidraw](https://excalidraw.com/) built with Tauri.

## Features

- ✅ **Full Excalidraw Functionality** - Complete whiteboard and drawing capabilities
- ✅ **Native File Operations** - Save and open `.excalidraw` files with native dialogs
- ✅ **Offline First** - Works completely offline
- ✅ **Desktop Integration** - Keyboard shortcuts (Ctrl/Cmd+S, Ctrl/Cmd+O)
- ✅ **Cross-Platform** - Windows installers (MSI and NSIS)
- ✅ **Collaboration** - Real-time collaboration support (optional)
- ✅ **Portable** - Standalone executable available

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Yarn](https://yarnpkg.com/)
- [Rust](https://rustup.rs/)
- [Task](https://taskfile.dev/)

### Installation

```bash
# Clone the repository (if not already cloned)
git clone <repository-url>
cd excalidraw-desktop

# First-time setup (installs dependencies and builds everything)
task setup

# Run the app in development mode
task dev
```

### Build Production Installer

```bash
task build
```

Installers will be created in:
- `src-tauri/target/release/bundle/msi/` (Windows Installer)
- `src-tauri/target/release/bundle/nsis/` (Setup executable)

## Project Structure

```
excalidraw-desktop/
├── src/                              # Excalidraw source code
│   ├── packages/                     # Core packages (common, math, element, excalidraw)
│   ├── excalidraw-app/              # Web application
│   │   └── build/                   # Production build (created by task)
│   └── ...
├── src-tauri/                        # Rust backend
│   ├── src/
│   │   ├── commands/                # Native file operations
│   │   ├── lib.rs
│   │   └── main.rs
│   └── tauri.conf.json              # Tauri configuration
├── tauri-assets/                    # Tauri-specific assets
│   └── tauri-bridge.js              # Native file operations bridge
├── Taskfile.yml                     # Build automation
└── README.md                        # This file
```

## Available Tasks

### Common Commands

| Command | Description |
|---------|-------------|
| `task --list` | Show all available tasks |
| `task dev` | Run app in development mode |
| `task build` | Build production installers |
| `task check` | Check project status |

### Build Tasks

| Command | Description |
|---------|-------------|
| `task setup` | First-time setup (install + build) |
| `task excalidraw:rebuild` | Rebuild Excalidraw completely |
| `task excalidraw:update` | Update Excalidraw from upstream |
| `task excalidraw:build-packages` | Build core packages only |
| `task excalidraw:build-app` | Build app only |

### Clean Tasks

| Command | Description |
|---------|-------------|
| `task clean:all` | Clean all build artifacts |
| `task clean:excalidraw` | Clean Excalidraw artifacts |
| `task clean:tauri` | Clean Tauri artifacts |

### Testing Tasks

| Command | Description |
|---------|-------------|
| `task test` | Run Excalidraw tests |
| `task typecheck` | TypeScript type checking |

**For complete task reference, see [TASKFILE.md](TASKFILE.md)**

## Development Workflow

### Daily Development

```bash
# Start development server with hot-reload
task dev

# Make changes to Rust backend or Excalidraw source
# App will auto-reload
```

### Updating Excalidraw

```bash
# Pull latest Excalidraw and rebuild
task excalidraw:update

# Or manually:
cd src
git pull origin main
cd ..
task excalidraw:rebuild
```

### Before Committing

```bash
# Check project status
task check

# Run type checking
task typecheck

# Run tests
task test
```

## Native File Operations

The app includes native file save/open functionality:

### From JavaScript Console

```javascript
// Save a drawing
await window.tauriSaveFile({
  type: "excalidraw",
  version: 2,
  source: "excalidraw-desktop",
  elements: [],
  appState: {},
  files: {}
});

// Open a drawing
const result = await window.tauriOpenFile();
if (result.success) {
  console.log('Loaded:', result.data);
}
```

### Keyboard Shortcuts

- **Ctrl/Cmd+S** - Save (currently shows notification)
- **Ctrl/Cmd+O** - Open (currently shows notification)

*Note: Deep integration with Excalidraw's internal API is planned for future versions.*

## Architecture

### Frontend
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Source:** Official Excalidraw repository (cloned into `src/`)
- **Build Output:** `src/excalidraw-app/build/`

### Backend
- **Framework:** Tauri 2.x
- **Language:** Rust
- **Commands:** Native file operations (save/open)
- **Plugins:** Dialog, File System

### Integration
- **Bridge:** `tauri-bridge.js` injected into build
- **Communication:** JavaScript ↔ Rust via Tauri's invoke API

## Documentation

- **[TASKFILE.md](TASKFILE.md)** - Complete Taskfile reference
- **[REORGANIZATION.md](REORGANIZATION.md)** - Project reorganization details
- **[PHASE2_COMPLETE.md](PHASE2_COMPLETE.md)** - Native file operations implementation
- **[PRODUCTION_BUILD.md](PRODUCTION_BUILD.md)** - Production build guide
- **[TESTING.md](TESTING.md)** - Testing instructions

## Troubleshooting

### Build Issues

**Problem:** Packages not built
```bash
task excalidraw:build-packages
```

**Problem:** App build fails
```bash
task clean:excalidraw
task excalidraw:rebuild
```

**Problem:** Everything broken
```bash
task clean:all
task clean:node_modules
task setup
```

### Runtime Issues

**Problem:** Native file dialogs not working
- Check that Tauri bridge is loaded: `task check`
- Verify permissions in `src-tauri/capabilities/default.json`

**Problem:** Keyboard shortcuts not working
- Ensure app window has focus
- Check browser console (F12) for errors

## Version Information

- **Excalidraw:** Latest from main branch
- **Tauri:** 2.9.5
- **Rust:** 1.x (via rustup)
- **Node.js:** 16+ required

## License

This desktop wrapper combines:
- **Excalidraw** - MIT License ([https://github.com/excalidraw/excalidraw](https://github.com/excalidraw/excalidraw))
- **Tauri** - MIT/Apache 2.0 ([https://github.com/tauri-apps/tauri](https://github.com/tauri-apps/tauri))

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `task typecheck` and `task test`
5. Submit a pull request

## Support

### For Excalidraw Issues
- GitHub: https://github.com/excalidraw/excalidraw/issues

### For Tauri Issues
- GitHub: https://github.com/tauri-apps/tauri/issues

### For Desktop Wrapper Issues
- Create an issue in this repository

## Roadmap

### Phase 3 (Planned)
- [ ] Network hardening with Rust backend proxy
- [ ] Offline-first architecture
- [ ] Private backend support
- [ ] Stricter CSP policies

### Future Enhancements
- [ ] Deep Excalidraw API integration
- [ ] Auto-save functionality
- [ ] Recent files list
- [ ] File associations (.excalidraw files)
- [ ] Custom menu items
- [ ] Code signing
- [ ] Auto-update mechanism
- [ ] macOS and Linux builds

## Quick Commands Reference

```bash
# Setup
task setup              # First-time setup

# Development
task dev                # Run app with hot-reload
task check              # Check project status
task tree               # Show project structure

# Building
task excalidraw:rebuild # Rebuild Excalidraw
task build              # Build installers

# Updating
task excalidraw:update  # Update Excalidraw

# Cleaning
task clean:all          # Clean everything

# Testing
task test               # Run tests
task typecheck          # Type checking

# Help
task --list             # Show all tasks
task help               # Detailed help
```

## Links

- **Excalidraw:** https://excalidraw.com/
- **Tauri:** https://tauri.app/
- **Taskfile:** https://taskfile.dev/

---

Built with ❤️ using [Excalidraw](https://excalidraw.com/) and [Tauri](https://tauri.app/)
