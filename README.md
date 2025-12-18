# Python iRacing SDK - Complete Broadcast Overlay Package

**🎉 Ready-to-use, all-in-one broadcast overlay system for iRacing!**

This is a **complete, self-contained package** that includes everything you need to create professional iRacing broadcasts with OBS Studio. No separate installations or complex setup required - just Python and you're ready to go!

## 🚀 What's Included

✅ **Full iRacing SDK** (`irsdk.py`) - Already included, no separate install needed  
✅ **Web-based Broadcast Overlay** - Professional overlay for OBS Studio  
✅ **Producer Control Panel** - Easy-to-use web interface  
✅ **Real-time Telemetry** - 60 FPS live data streaming  
✅ **Demo Mode** - Test everything without iRacing running  
✅ **Complete Documentation** - Step-by-step guides for beginners  

## 🏁 Quick Start (3 Steps!)

### 1. Install Python & Dependencies
```bash
# Download Python from https://python.org (if not installed)
# Then install dependencies:
pip install -r requirements.txt
```

### 2. Start the Server
**Windows:** Double-click `START_BROADCAST.bat`  
**Or:** `python start_broadcast.py`

### 3. Open in Browser
- **Producer Panel:** http://localhost:5000/
- **OBS Overlay:** http://localhost:5000/overlay

That's it! 🎉

## 📖 Documentation

- **[Complete Installation Guide](INSTALLATION_GUIDE.md)** - For absolute beginners
- **[Quick Start Reference](QUICK_START.md)** - Quick commands and tips
- **[Detailed Documentation](BROADCAST_README.md)** - Full feature documentation
- **[SDK Tutorials](tutorials/)** - Advanced SDK usage examples

## 🎥 Broadcast Overlay Features

This package includes a complete web-based broadcast overlay system:

- 🎛️ **Producer Control Panel** - Web interface to control what's displayed
- 📺 **OBS Browser Source** - Professional transparent overlay ready for OBS Studio
- 📊 **Real-time Telemetry** - Live speed, RPM, gear, fuel, lap times, and more
- 🔄 **60 FPS Updates** - Smooth, real-time data via WebSocket
- 📹 **Camera Controls** - Switch cameras directly from the control panel
- 🎨 **Modern Design** - Beautiful, customizable interface

## 🎬 Using with OBS Studio

1. Start the broadcast app
2. In OBS, add a **Browser Source**
3. Set URL to: `http://localhost:5000/overlay`
4. Set dimensions: **1920x1080**
5. Done! The overlay will show live telemetry data

## 🧪 Testing Without iRacing

Run the demo mode to test your setup:
```bash
python demo_mode.py
```

This simulates telemetry data so you can verify everything works before going live.

## 📦 What You Get

```
pyirsdksrt/
├── irsdk.py                  ✅ iRacing SDK (INCLUDED!)
├── broadcast_app.py          ✅ Main broadcast application
├── demo_mode.py             ✅ Test mode (no iRacing needed)
├── START_BROADCAST.bat      ✅ Windows launcher
├── templates/               ✅ Producer panel & overlay HTML
├── static/                  ✅ CSS & JavaScript
└── Complete documentation   ✅ Step-by-step guides
```

**Everything you need is in this package!** No hunting for additional components.

---

## 🔧 SDK Library Usage (For Developers)

This package also serves as a Python library for iRacing SDK:

### Installation as Library
```bash
pip install pyirsdk
```

### Basic Usage
```python
import irsdk
ir = irsdk.IRSDK()
ir.startup()
print(ir['Speed'])
```

Go to [tutorials](tutorials) for more SDK examples.

---

## 💡 Why This Package?

**For Broadcasters:**
- Complete broadcast overlay solution
- No technical knowledge required
- Professional looking output
- Easy to customize

**For Developers:**
- Full iRacing SDK implementation
- Python 3.7+ compatible
- Get session data and live telemetry
- Send broadcast messages (camera, replay, chat, pit commands)

## 📋 Requirements

- **Windows** (iRacing runs on Windows only)
- **Python 3.7+** ([Download here](https://www.python.org/downloads/))
- **iRacing** (for live data)
- **OBS Studio** (for streaming - optional but recommended)

## 🆘 Support

**New to this?** Start with [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - it walks you through everything!

**Quick issues?** Check [QUICK_START.md](QUICK_START.md) for troubleshooting.

**Need details?** See [BROADCAST_README.md](BROADCAST_README.md) for complete documentation.

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Credits

Built on [pyirsdk](https://github.com/kutu/pyirsdk) - Python implementation of iRacing SDK
