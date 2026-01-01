# 🔄 Renamer Desktop Application

A professional bulk file renaming tool with a modern dark-themed GUI, rule-based engine, and powerful customization options.

![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?logo=tauri)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎨 **Modern Dark UI** - Beautiful glassmorphism design with purple/cyan accent colors
- 📁 **Folder Selection** - Open any folder and view all files
- 🔀 **Live Preview** - See renamed files in real-time before applying
- ✅ **Selective Renaming** - Enable selection mode to rename only specific files
- 📝 **Multiple Rule Types**:
  - Prefix / Suffix
  - Find & Replace
  - Sequence numbering
  - Date/Time stamps
  - Case conversion (lowercase, uppercase, capitalize, title case)
  - Custom JavaScript expressions

## 📥 Download

### Quick Install (v1.1.0 - Production)

Download the latest version for Windows:

| Format | Download | Size |
|--------|----------|------|
| **Windows Installer (.exe)** | [Renamer 1.1.0 Setup](https://github.com/karthik-cyberexpert/Renamer-Desktop-Application/releases/download/v1.1.0/Renamer_1.0.0_x64-setup.exe) | 2.1 MB |
| **Windows MSI** | [Renamer 1.1.0 MSI](https://github.com/karthik-cyberexpert/Renamer-Desktop-Application/releases/download/v1.1.0/Renamer_1.0.0_x64_en-US.msi) | 3.2 MB |

> **Note:** After downloading, run the installer and follow the prompts. Windows may show a SmartScreen warning - click "More info" → "Run anyway" to proceed.

### All Releases

View all releases and changelogs: [📦 Releases Page](https://github.com/karthik-cyberexpert/Renamer-Desktop-Application/releases)

---

## 🛠️ Build from Source

If you prefer to build from source, follow the instructions below.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | v18 or higher | [nodejs.org](https://nodejs.org/) |
| Rust | Latest stable | [rustup.rs](https://rustup.rs/) |
| Git | Any | [git-scm.com](https://git-scm.com/) |

> **Note:** After installing Rust, restart your terminal for the changes to take effect.

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/karthik-cyberexpert/Renamer-Desktop-Application.git
cd Renamer-Desktop-Application
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Core Package

```bash
npm run build --workspaces
```

### 4. Run the Application

```bash
cd apps/desktop
npm run tauri dev
```

The app will compile and launch automatically. First-time compilation may take a few minutes.

## 🖥️ Usage

### Basic Workflow

1. **Open a Folder** - Click the "Open Folder" button in the left panel
2. **Add Rules** - Click "+ Add Rule" in the right panel and select a rule type
3. **Configure Rules** - Fill in the parameters for each rule
4. **Preview Changes** - See the live preview in the center panel
5. **Apply Changes** - Click "Apply Changes" to rename the files

### Selection Mode

For selective renaming:
1. Click the **"Selection"** toggle button
2. Use checkboxes to select specific files
3. Use "Select All" / "Deselect All" for quick actions
4. Only selected files will be renamed when you click "Apply Changes"

### Available Rules

| Rule | Description | Example |
|------|-------------|---------|
| **Prefix** | Add text at the start | `photo.jpg` → `IMG_photo.jpg` |
| **Suffix** | Add text before extension | `photo.jpg` → `photo_2024.jpg` |
| **Replace** | Find and replace text | `photo_old.jpg` → `photo_new.jpg` |
| **Sequence** | Add sequential numbers | `photo.jpg` → `001_photo.jpg` |
| **Date** | Insert date/time | `photo.jpg` → `2024-01-01_photo.jpg` |
| **Lowercase** | Convert to lowercase | `PHOTO.jpg` → `photo.jpg` |
| **Uppercase** | Convert to UPPERCASE | `photo.jpg` → `PHOTO.jpg` |
| **Capitalize** | Capitalize Each Word | `hello world.jpg` → `Hello World.jpg` |
| **Title Case** | Smart title case | `HELLO WORLD.jpg` → `Hello World.jpg` |
| **Custom** | JavaScript expression | Use `name` variable for custom transforms |

### Custom Rule Examples

```javascript
// Replace underscores with spaces
name.replace(/_/g, ' ')

// Reverse the filename
name.split('').reverse().join('')

// Truncate to 10 characters
name.substring(0, 10)

// Remove numbers
name.replace(/\d/g, '')
```

## 📁 Project Structure

```
Renamer-Desktop-Application/
├── packages/
│   ├── core/              # Shared rule engine (TypeScript)
│   └── cli/               # Command-line interface
├── apps/
│   └── desktop/           # Tauri + React desktop app
│       ├── src/           # React frontend
│       └── src-tauri/     # Rust backend
├── package.json           # Root workspace config
└── README.md
```

## �️ Development

### Running in Development Mode

```bash
cd apps/desktop
npm run tauri dev
```

### Building for Production

```bash
cd apps/desktop
npm run tauri build
```

The built application will be in `apps/desktop/src-tauri/target/release/`.

## � Troubleshooting

### "cargo: command not found"
Install Rust from [rustup.rs](https://rustup.rs/) and restart your terminal.

### "Cannot find module" error
Run `npm install` from the root directory.

### Build fails on first run
This is normal - the first build downloads and compiles Rust dependencies. Wait for it to complete.

### Files not appearing after selecting folder
Make sure you're selecting a folder with files (not just subfolders). The app scans only the selected directory, not subdirectories by default.

## � CLI Usage (Optional)

The project also includes a CLI for batch processing:

```bash
# Show help
node packages/cli/bin/renamer.js --help

# Dry run (preview changes)
node packages/cli/bin/renamer.js run --rules rules.json --target ./my-files

# Apply changes
node packages/cli/bin/renamer.js run --rules rules.json --target ./my-files --no-dry-run

# Undo changes
node packages/cli/bin/renamer.js undo --log renamer-log-<timestamp>.json
```

## � Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ using Tauri, React, and TypeScript**
