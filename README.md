# Rule-Based File Renamer

A professional bulk file renaming tool with a shared rule engine, CLI, and Desktop GUI.

## 📋 Prerequisites

### For CLI (Command Line Interface)
- ✅ Node.js v18 or higher

### For GUI (Desktop App)
- ✅ Node.js v18 or higher
- ✅ Rust toolchain - **[Install from rustup.rs](https://rustup.rs/)**
  - After installing, restart your terminal

---

## 🚀 Quick Start

### Step 1: Install Dependencies

From the root directory (`c:\Karthik\Projects\Project-1`):

```bash
npm install
```

### Step 2: Build the Project

```bash
npm run build --workspaces
```

---

## 💻 Using the CLI

### Basic Commands

**Show help:**
```bash
node packages/cli/bin/renamer.js --help
```

**Rename files (dry-run by default):**
```bash
node packages/cli/bin/renamer.js run --rules rules.json --target ./my-files
```

**Actually rename files:**
```bash
node packages/cli/bin/renamer.js run --rules rules.json --target ./my-files --no-dry-run
```

**Undo a rename operation:**
```bash
node packages/cli/bin/renamer.js undo --log renamer-log-<timestamp>.json
```

### Step-by-Step CLI Usage

1. **Create a rules file** (`rules.json`):
   ```json
   [
     {
       "id": "1",
       "type": "prefix",
       "active": true,
       "params": { "value": "IMG_" }
     },
     {
       "id": "2",
       "type": "sequence",
       "active": true,
       "params": { "start": 1, "padding": 3 }
     }
   ]
   ```

2. **Test with dry-run** (safe preview):
   ```bash
   node packages/cli/bin/renamer.js run --rules rules.json --target ./test-files
   ```

3. **Review the output**, then **apply changes**:
   ```bash
   node packages/cli/bin/renamer.js run --rules rules.json --target ./test-files --no-dry-run
   ```

4. **If needed, undo**:
   ```bash
   node packages/cli/bin/renamer.js undo --log renamer-log-<timestamp>.json
   ```

---

## 🖥️ Using the GUI

### Prerequisites Check

Before running the GUI, verify Rust is installed:

```bash
cargo --version
```

If you see an error, install Rust from **[rustup.rs](https://rustup.rs/)** and restart your terminal.

### Step-by-Step GUI Usage

1. **Start the development server** (from root directory):
   ```bash
   npm run dev
   ```

2. **The Tauri app will launch** with a 3-pane interface:
   - **Left Pane:** File selection (click "Open Folder")
   - **Center Pane:** Preview table showing original → new names
   - **Right Pane:** Rule builder

3. **Add rules** by clicking "+ Add Rule" and selecting a type (prefix, suffix, sequence, etc.)

4. **Configure each rule** with the parameters in the form fields

5. **Review the preview** in the center pane (updates live)

6. **Click "Apply"** to rename the files

---

## 📚 Available Rules

- **prefix** - Add text to the beginning
- **suffix** - Add text to the end (before extension)
- **replace** - Find and replace text
- **sequence** - Add sequential numbers
- **date** - Insert date/time stamps
- **regex** - Advanced pattern matching

---

## 🛠️ Troubleshooting

### "cargo: command not found" or "program not found"
- **Solution:** Install Rust from [rustup.rs](https://rustup.rs/)
- After installation, restart your terminal
- Verify with: `cargo --version`

### "Cannot find module" error
- **Solution:** Make sure you're in the root directory (`c:\Karthik\Projects\Project-1`)
- Run `npm install` again

### GUI build fails
- Ensure Rust is installed
- Try: `cd apps/desktop` then `npm install`

---

## 📁 Project Structure

```
Project-1/
├── packages/
│   ├── core/          # Shared rule engine (TypeScript)
│   └── cli/           # Command-line interface
└── apps/
    └── desktop/       # Tauri + React GUI
```

---

## 🧪 Running Tests

```bash
npm run test --workspaces
```

This runs unit tests for the core rule engine.
