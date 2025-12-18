# Complete Setup Guide for New Producers

**Welcome!** This guide will help you set up the iRacing Broadcast Overlay from scratch, even if you've never used Python before.

## What You Need

✅ **Windows PC** (iRacing only runs on Windows)  
✅ **iRacing** (already installed)  
✅ **That's it!** Everything else is in this package or will be installed.

## Step-by-Step Installation

### Step 1: Install Python

1. Go to https://www.python.org/downloads/
2. Download **Python 3.7 or newer** (latest version recommended)
3. **IMPORTANT:** During installation, check the box that says **"Add Python to PATH"**
4. Click "Install Now"
5. Wait for installation to complete

**Verify Python is installed:**
- Open Command Prompt (press Windows key, type `cmd`, press Enter)
- Type: `python --version`
- You should see something like `Python 3.12.x`

### Step 2: Download This Package

**Option A - If you have Git:**
```bash
git clone https://github.com/ssracingleagues-lab/pyirsdksrt.git
cd pyirsdksrt
```

**Option B - Without Git (easier):**
1. Download the repository as a ZIP file from GitHub
2. Extract the ZIP to a folder like `C:\iRacing-Broadcast`
3. Open Command Prompt and navigate to that folder:
   ```bash
   cd C:\iRacing-Broadcast\pyirsdksrt
   ```

### Step 3: Install Dependencies

In the Command Prompt (in the pyirsdksrt folder), run:

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web server)
- Flask-SocketIO (real-time communication)
- PyYAML (data parsing)
- eventlet (async server)

**Note:** The iRacing SDK (irsdk.py) is already included in this package - no separate installation needed!

### Step 4: Start the Application

**Easy Way (Windows):**
- Double-click `START_BROADCAST.bat`

**Command Line Way:**
```bash
python start_broadcast.py
```

You should see:
```
============================================================
iRacing Broadcast Overlay Server
============================================================
Producer Panel:  http://localhost:5000/
OBS Overlay:     http://localhost:5000/overlay
============================================================
```

### Step 5: Open the Producer Panel

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: http://localhost:5000/
3. You should see the Producer Control Panel

### Step 6: Set Up OBS Studio

**If you don't have OBS Studio:**
1. Download from https://obsproject.com/
2. Install it (it's free!)

**Add the Overlay to OBS:**
1. Open OBS Studio
2. In your scene, click the **+** button under **Sources**
3. Select **Browser**
4. Name it "iRacing Overlay" and click OK
5. Set these properties:
   - **URL:** `http://localhost:5000/overlay`
   - **Width:** `1920`
   - **Height:** `1080`
   - **FPS:** `60` (optional)
   - ✅ Check **"Shutdown source when not visible"**
   - ✅ Check **"Refresh browser when scene becomes active"**
6. Click **OK**

### Step 7: Test It Out

**Without iRacing (Demo Mode):**
```bash
python demo_mode.py
```
This shows simulated data so you can test the overlay setup.

**With iRacing:**
1. Make sure the broadcast app is running (`START_BROADCAST.bat`)
2. Start iRacing
3. Join a session (practice, race, test, etc.)
4. The overlay should automatically connect and show data!

## File Structure

Here's what's in this package:

```
pyirsdksrt/
├── START_BROADCAST.bat       ← Double-click to start (Windows)
├── start_broadcast.py         ← Python launcher with dependency check
├── broadcast_app.py           ← Main application (connects to iRacing)
├── demo_mode.py              ← Test mode (no iRacing needed)
├── irsdk.py                  ← iRacing SDK (INCLUDED - no install needed)
├── requirements.txt          ← Python dependencies
│
├── templates/                ← HTML files
│   ├── producer.html         ← Producer control panel
│   └── overlay.html          ← OBS overlay
│
├── static/                   ← Styling and scripts
│   ├── css/
│   │   ├── producer.css
│   │   └── overlay.css
│   └── js/
│       ├── producer.js
│       └── overlay.js
│
└── Documentation/
    ├── README.md             ← Overview and quick start
    ├── BROADCAST_README.md   ← Detailed documentation
    ├── QUICK_START.md        ← Quick reference
    └── tutorials/            ← SDK usage examples
```

## What's Included (No Extra Downloads!)

✅ **irsdk.py** - Full iRacing SDK implementation  
✅ **Web Server** - Flask-based application  
✅ **Producer Panel** - Control interface  
✅ **OBS Overlay** - Professional broadcast overlay  
✅ **Demo Mode** - Test without iRacing  
✅ **Documentation** - Complete guides  

## Troubleshooting

### "Python is not recognized"
- You need to add Python to your PATH
- Reinstall Python and check "Add Python to PATH"
- Or manually add it: `C:\Users\YourName\AppData\Local\Programs\Python\Python3XX`

### "pip is not recognized"
- Run: `python -m pip install -r requirements.txt`

### "Cannot connect to iRacing"
- Make sure iRacing is running
- Make sure you're in an active session (not just the menu)
- Try restarting the broadcast app

### Port 5000 is already in use
- Close any other programs using port 5000
- Or edit `broadcast_app.py` and change the port number

### Overlay not showing in OBS
- Make sure the broadcast app is running
- Check the URL is exactly: `http://localhost:5000/overlay`
- Try right-clicking the source → "Refresh cache of current page"

## Getting Help

1. Read the **BROADCAST_README.md** for detailed documentation
2. Check the **QUICK_START.md** for quick reference
3. Try **demo_mode.py** to isolate issues
4. Check the console output for error messages

## Next Steps

Once everything is working:
1. Customize the overlay colors in `static/css/overlay.css`
2. Toggle which data shows using the Producer Panel
3. Add custom telemetry data (see `vars.txt` for available data)
4. Create custom layouts for different racing series

## Summary

You now have a complete, self-contained broadcast overlay system:
- ✅ No external installations required (except Python and pip packages)
- ✅ iRacing SDK included in the package
- ✅ Ready to use with OBS Studio
- ✅ Professional looking overlay
- ✅ Easy to customize and extend

**Happy Broadcasting! 🏁**
