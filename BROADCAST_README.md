# iRacing Broadcast Overlay Application

A professional web-based broadcast overlay system for iRacing with OBS Studio integration. This application provides real-time telemetry display with a producer control panel for managing the overlay.

## Features

- 🎥 **OBS Browser Source Compatible** - Transparent overlay ready for OBS Studio
- 🎛️ **Producer Control Panel** - Web-based interface to control what's displayed
- 📊 **Real-time Telemetry** - Live speed, RPM, gear, fuel, lap times, and more
- 🔄 **WebSocket Updates** - Instant data updates at 60 FPS
- 📹 **Camera Controls** - Switch cameras directly from the producer panel
- 🎨 **Modern UI** - Beautiful gradient designs with smooth animations

## Installation

1. **Install Dependencies**

```bash
pip install -r requirements.txt
```

2. **Verify iRacing SDK is installed**

The application uses the pyirsdk library which should already be installed in this repository.

## Usage

### Starting the Server

```bash
python broadcast_app.py
```

The server will start on `http://localhost:5000` by default.

You'll see:
```
============================================================
iRacing Broadcast Overlay Server
============================================================
Producer Panel:  http://localhost:5000/
OBS Overlay:     http://localhost:5000/overlay
============================================================
```

### Producer Control Panel

1. Open your web browser and go to `http://localhost:5000/`
2. The producer panel shows:
   - Real-time connection status to iRacing
   - Live telemetry data (Speed, RPM, Gear, Position, Fuel, Lap Times)
   - Toggle controls for overlay elements
   - Camera switch controls
   - OBS setup instructions

### Setting up OBS Studio

1. **Open OBS Studio**

2. **Add Browser Source**
   - In your scene, click the `+` button under Sources
   - Select `Browser`
   - Name it "iRacing Overlay"

3. **Configure the Browser Source**
   - URL: `http://localhost:5000/overlay`
   - Width: `1920`
   - Height: `1080`
   - Check ✅ "Shutdown source when not visible"
   - Check ✅ "Refresh browser when scene becomes active"
   - FPS: `60` (optional, for smoothest updates)

4. **Click OK**

The overlay should now appear in your OBS scene!

### Customizing the Overlay

Use the Producer Control Panel to:
- Toggle display elements on/off (Speed, RPM, Gear, Fuel, Position, Lap Times)
- Switch cameras to different cars
- Monitor live telemetry data

Changes made in the producer panel will instantly update the overlay in OBS.

## Requirements

- **Python 3.7+**
- **iRacing** (must be running for telemetry data)
- **Windows** (iRacing SDK only works on Windows)

### Python Packages
- PyYAML >= 5.3
- Flask >= 2.0.0
- Flask-SocketIO >= 5.0.0
- python-socketio >= 5.0.0
- eventlet >= 0.30.0

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   iRacing SDK   │────────▶│  broadcast_app   │
│   (Telemetry)   │         │   (Python/Flask) │
└─────────────────┘         └────────┬─────────┘
                                     │
                            WebSocket│(60 FPS)
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
            ┌───────▼────────┐              ┌────────▼────────┐
            │ Producer Panel │              │  OBS Overlay    │
            │  (Control UI)  │              │ (Browser Source)│
            └────────────────┘              └─────────────────┘
```

## Overlay Elements

The overlay displays:

**Top Bar:**
- Current position in race
- Track name

**Bottom Left:**
- Speed (MPH)
- Current gear
- RPM with colored bar

**Bottom Right:**
- Fuel level with bar
- Current lap time
- Best lap time
- Last lap time

**Top Right:**
- Connection status indicator

## Troubleshooting

### "iRacing Disconnected" in Producer Panel

- Make sure iRacing is running
- Make sure you're in a session (practice, race, etc.)
- The connection will automatically establish when you enter a session

### Overlay not showing in OBS

- Check that the URL is correct: `http://localhost:5000/overlay`
- Verify the broadcast app is running
- Try clicking "Refresh cache of current page" in the OBS browser source properties

### No telemetry data updating

- Ensure iRacing is running and you're in an active session
- Check the console output of the broadcast app for errors
- Verify your iRacing installation has the SDK enabled

### Port 5000 already in use

Edit `broadcast_app.py` and change the port:

```python
if __name__ == '__main__':
    start_server(port=8080)  # Change to any available port
```

Then update your browser URLs accordingly.

## Advanced Configuration

### Changing Update Rate

Edit the sleep time in the `telemetry_loop()` function in `broadcast_app.py`:

```python
# 60 FPS (default)
eventlet.sleep(1.0 / 60.0)

# 30 FPS (less CPU usage)
eventlet.sleep(1.0 / 30.0)
```

### Adding Custom Telemetry Data

1. Edit `get_telemetry_data()` in `broadcast_app.py` to add more iRacing variables
2. Update the overlay HTML/CSS/JS to display the new data
3. See `vars.txt` for available iRacing telemetry variables

## Development

### File Structure

```
pyirsdksrt/
├── broadcast_app.py          # Main Flask application
├── requirements.txt          # Python dependencies
├── templates/
│   ├── producer.html        # Producer control panel
│   └── overlay.html         # OBS overlay
└── static/
    ├── css/
    │   ├── producer.css     # Producer panel styles
    │   └── overlay.css      # Overlay styles
    └── js/
        ├── producer.js      # Producer panel logic
        └── overlay.js       # Overlay logic
```

## Credits

Built on top of [pyirsdk](https://github.com/kutu/pyirsdk) - Python implementation of iRacing SDK

## License

MIT License - See LICENSE file for details
