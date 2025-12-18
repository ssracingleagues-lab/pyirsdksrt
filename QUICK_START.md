# Quick Reference Guide - iRacing Broadcast Overlay

## Installation (One-time Setup)

```bash
# Clone the repository (if not already done)
git clone https://github.com/ssracingleagues-lab/pyirsdksrt.git
cd pyirsdksrt

# Install dependencies
pip install -r requirements.txt
```

## Running the Application

### Option 1: Using the Launcher (Recommended)
```bash
python start_broadcast.py
```

### Option 2: Direct Start
```bash
python broadcast_app.py
```

### Option 3: Demo Mode (Test without iRacing)
```bash
python demo_mode.py
```

## Quick Setup Checklist

- [ ] Install Python 3.7 or higher
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Start the server: `python start_broadcast.py`
- [ ] Open Producer Panel: http://localhost:5000/
- [ ] Add OBS Browser Source: http://localhost:5000/overlay
- [ ] Configure OBS Browser Source:
  - Width: 1920
  - Height: 1080
  - FPS: 60 (optional)
- [ ] Start iRacing and join a session
- [ ] Control overlay from Producer Panel

## OBS Browser Source Settings

```
URL: http://localhost:5000/overlay
Width: 1920
Height: 1080
FPS: 60 (optional)
☑ Shutdown source when not visible
☑ Refresh browser when scene becomes active
```

## URLs

| Purpose | URL |
|---------|-----|
| Producer Control Panel | http://localhost:5000/ |
| OBS Overlay | http://localhost:5000/overlay |
| API Status | http://localhost:5000/api/status |
| API Telemetry | http://localhost:5000/api/telemetry |

## Troubleshooting Quick Fixes

### Server won't start
```bash
# Check if port 5000 is already in use
# On Windows:
netstat -ano | findstr :5000

# On Linux/Mac:
lsof -i :5000

# Kill the process or change port in broadcast_app.py
```

### iRacing not connecting
1. Make sure iRacing is running
2. Make sure you're in an active session (not in the menu)
3. Check the console for connection messages
4. Try restarting the server

### Overlay not visible in OBS
1. Verify the URL is correct: `http://localhost:5000/overlay`
2. Check that broadcast_app.py is running
3. Right-click the browser source → "Refresh cache of current page"
4. Make sure OBS can access localhost

### No telemetry data
1. Ensure iRacing is running AND you're in a session
2. Check that iRacing SDK is enabled (it should be by default)
3. Look at the console output for errors
4. Try the demo mode to verify the overlay works

## Keyboard Shortcuts

When in Producer Panel:
- Use tab to navigate between controls
- Use checkboxes to toggle overlay elements
- Enter car number and click "Switch to Car" to change camera

## Performance Tips

1. **Reduce Update Rate** - Edit `broadcast_app.py`, change sleep time:
   ```python
   eventlet.sleep(1.0 / 30.0)  # 30 FPS instead of 60
   ```

2. **Minimize Elements** - Toggle off unused overlay elements in Producer Panel

3. **OBS Settings** - In OBS Browser Source properties:
   - Set FPS to 30 if 60 is too much
   - Enable "Shutdown source when not visible"

## Customization Ideas

### Change Colors
Edit `static/css/overlay.css` to change gradient colors, text colors, etc.

### Add More Telemetry
1. Edit `get_telemetry_data()` in `broadcast_app.py`
2. Add desired iRacing variables (see `vars.txt`)
3. Update `overlay.html` and `overlay.js` to display new data

### Modify Layout
Edit `templates/overlay.html` and `static/css/overlay.css` to change positioning

## Available iRacing Data

See `vars.txt` for full list. Common ones:
- Speed, RPM, Gear
- FuelLevel, FuelLevelPct
- LapCurrentLapTime, LapBestLapTime, LapLastLapTime
- SessionTime, SessionState
- TrackTemp, AirTemp
- Position data via CarIdxLap
- And many more!

## Support

For issues or questions:
1. Check BROADCAST_README.md for detailed documentation
2. Review the tutorials/ directory for SDK usage examples
3. Check the GitHub repository for updates

## Version Info

- Python: 3.7+
- Flask: 2.0.0+
- Flask-SocketIO: 5.0.0+
- iRacing SDK: 1.3.5
