# Package Contents - What's In This Folder

```
pyirsdksrt/                           ← Main folder
│
├── 🚀 START_BROADCAST.bat            ← WINDOWS: Double-click to start!
├── 🚀 start_broadcast.py             ← Python launcher (checks dependencies)
├── 📡 broadcast_app.py               ← Main application (connects to iRacing)
├── 🎮 demo_mode.py                   ← Test mode (works without iRacing)
│
├── 📚 irsdk.py                       ← ✅ iRacing SDK (INCLUDED - 29KB)
├── 📋 requirements.txt               ← Python package list
├── 📋 vars.txt                       ← Available iRacing data variables
│
├── 📖 Documentation                  ← READ THESE!
│   ├── README.md                     ← Start here - Overview
│   ├── INSTALLATION_GUIDE.md         ← Complete beginner setup guide
│   ├── BROADCAST_README.md           ← Detailed feature documentation
│   ├── QUICK_START.md                ← Quick reference & troubleshooting
│   └── PACKAGE_CONTENTS.md           ← This file
│
├── 🌐 templates/                     ← Web pages
│   ├── producer.html                 ← Producer control panel UI
│   └── overlay.html                  ← OBS browser source overlay
│
├── 🎨 static/                        ← Styling and scripts
│   ├── css/
│   │   ├── producer.css              ← Control panel styles
│   │   └── overlay.css               ← Overlay styles (customize here!)
│   └── js/
│       ├── producer.js               ← Control panel functionality
│       └── overlay.js                ← Overlay functionality
│
└── 📚 tutorials/                     ← Advanced SDK usage examples
    ├── 01 Introduction.md
    ├── 02 Using irsdk script.md
    └── 03 Base application.md
```

## 🎯 What Each File Does

### 🚀 Launchers (Start Here!)

- **START_BROADCAST.bat** - Windows users: Just double-click this!
- **start_broadcast.py** - Cross-platform launcher, checks if everything is installed

### 📡 Applications

- **broadcast_app.py** - The main broadcast overlay application
  - Connects to iRacing for real telemetry
  - Serves web pages on http://localhost:5000
  - Streams data via WebSocket at 60 FPS
  
- **demo_mode.py** - Test application with fake data
  - Works without iRacing
  - Perfect for testing your OBS setup
  - Simulates realistic telemetry

### 📚 Core SDK

- **irsdk.py** - Complete iRacing SDK implementation ✅
  - **THIS IS INCLUDED** - You don't need to download it separately!
  - 29KB file with all iRacing SDK functionality
  - Handles memory mapping, YAML parsing, broadcast messages
  
### 🌐 Web Interface

- **templates/producer.html** - The producer control panel you see in your browser
- **templates/overlay.html** - The overlay that appears in OBS
- **static/css/** - Makes things look pretty (customize colors here!)
- **static/js/** - Makes things work (handles real-time updates)

### 📖 Documentation

| File | Purpose | When to Read |
|------|---------|--------------|
| **README.md** | Quick overview | First visit |
| **INSTALLATION_GUIDE.md** | Complete setup walkthrough | If you're new to Python |
| **BROADCAST_README.md** | Detailed feature docs | When you want to learn more |
| **QUICK_START.md** | Quick reference | Keep handy while working |
| **PACKAGE_CONTENTS.md** | This file | To understand the structure |

## 💾 File Sizes (Approximate)

```
Total Package Size: ~100 KB (without dependencies)

Core Files:
├── irsdk.py                  29 KB  ← Full SDK included!
├── broadcast_app.py           7 KB
├── demo_mode.py               4 KB
├── HTML templates             9 KB
├── CSS stylesheets           11 KB
└── JavaScript files          10 KB
```

## 🔌 What Gets Installed When You Run pip install

When you run `pip install -r requirements.txt`, these packages are installed:

- **Flask** (~2 MB) - Web server framework
- **Flask-SocketIO** (~50 KB) - Real-time communication
- **python-socketio** (~200 KB) - WebSocket support
- **eventlet** (~400 KB) - Async server
- **PyYAML** (~200 KB) - YAML parser

**Total additional space: ~3 MB**

## 📂 Files You Can Safely Ignore

These are generated/system files you don't need to worry about:

- `__pycache__/` - Python bytecode cache (auto-generated)
- `*.pyc` - Compiled Python files (auto-generated)
- `.git/` - Git version control (if you cloned from GitHub)
- `pyirsdk.egg-info/` - Package metadata (auto-generated)
- `build/`, `dist/` - Build artifacts (auto-generated)

## 🎨 Files You Might Want to Customize

To personalize your broadcast:

1. **Overlay Colors**: Edit `static/css/overlay.css`
   - Change gradient colors
   - Adjust text colors
   - Modify positioning

2. **Control Panel Theme**: Edit `static/css/producer.css`
   - Change color scheme
   - Adjust layout

3. **Displayed Data**: Edit `broadcast_app.py`
   - Add more telemetry variables (see `vars.txt`)
   - Change update frequency
   - Add custom calculations

## ✅ Everything You Need is Here!

This package is **complete and self-contained**:

✅ iRacing SDK (irsdk.py) - Included  
✅ Web server - Included  
✅ Producer panel - Included  
✅ OBS overlay - Included  
✅ Demo mode - Included  
✅ Documentation - Included  

**Only external requirement:** Python packages (installed via pip)

## 🚀 Ready to Start?

1. **New user?** Start with [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
2. **Just want to run it?** Double-click `START_BROADCAST.bat` (Windows)
3. **Need a quick reference?** Check [QUICK_START.md](QUICK_START.md)

Happy broadcasting! 🏁
