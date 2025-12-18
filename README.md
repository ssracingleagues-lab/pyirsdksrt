# Python iRacing SDK

Python 3 implementation of iRacing SDK can:

- Get session data (WeekendInfo, SessionInfo, etc...)
- Get live telemetry data (Speed, FuelLevel, etc...)
- Broadcast messages (camera, replay, chat, pit and telemetry commands)

## 🎥 NEW: Broadcast Overlay Application

**Ready-to-use broadcast overlay system with OBS integration!**

This repository now includes a complete web-based broadcast overlay application perfect for streaming iRacing content. Features include:

- 🎛️ **Producer Control Panel** - Web interface to control what's displayed
- 📺 **OBS Browser Source** - Professional transparent overlay ready for OBS Studio
- 📊 **Real-time Telemetry** - Live speed, RPM, gear, fuel, lap times, and more
- 🔄 **60 FPS Updates** - Smooth, real-time data via WebSocket
- 📹 **Camera Controls** - Switch cameras directly from the control panel
- 🎨 **Modern Design** - Beautiful, customizable interface

### Quick Start - Broadcast Overlay

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python start_broadcast.py
```

Then:
1. Open the **Producer Panel** at `http://localhost:5000/`
2. Add **Browser Source** in OBS: `http://localhost:5000/overlay`
3. Start iRacing and race!

📖 **[Full Broadcast App Documentation →](BROADCAST_README.md)**

---

## SDK Library Installation

- [Python 3.7+](https://www.python.org/downloads/)
- [PyYaml 5.3+](http://www.lfd.uci.edu/~gohlke/pythonlibs/#pyyaml)
- add `X:\Python37\Scripts` directory to your `PATH` environment variable
- `pip install pyirsdk`

## SDK Library Usage

```python
#!python3
import irsdk
ir = irsdk.IRSDK()
ir.startup()
print(ir['Speed'])
```

Go to [tutorials](tutorials) for more SDK examples.
