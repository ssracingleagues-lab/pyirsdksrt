# Sleek Overlay Features Guide

## Overview

The sleek overlay is a modern, professional broadcast overlay for iRacing with advanced features specifically designed for racing broadcasts.

## Features

### 1. **Standings Ticker** (Top Left)
- **Location:** Top left corner
- **Shows:** Live race positions with time gaps
- **Styling:** Blue gradient with cyan border
- **Content:**
  - Position number
  - Driver name
  - Gap to leader
- **Scrollable:** Yes, for races with many drivers

### 2. **Driver Info Widget** (Top Right)
- **Location:** Top right corner
- **Shows:** Your car's live data
- **Styling:** Purple/magenta gradient
- **Content:**
  - Current position (P#)
  - Driver name
  - Speed (MPH)
  - Current gear (large display)
  - RPM with mini progress bar
- **Real-time:** Updates at 60 FPS

### 3. **Battle Box** (Middle Right)
- **Location:** Middle right side
- **Shows:** Speed comparison with nearby cars
- **Styling:** Gold gradient
- **Content:**
  - Car ahead: Position, name, speed
  - Delta/gap between cars
  - Your car: Position, name, speed
  - **Overtake projection:** Calculates laps until potential overtake based on speed difference
- **Smart:** Only shows when battle is relevant

### 4. **Lap Times** (Bottom Left)
- **Location:** Bottom left corner
- **Shows:** Lap timing information
- **Styling:** Green gradient
- **Content:**
  - Current lap time (live)
  - Best lap time (highlighted in gold)
  - Last lap time
- **Format:** MM:SS.mmm

### 5. **Fuel Indicator** (Bottom Center)
- **Location:** Bottom center
- **Shows:** Fuel status
- **Styling:** Orange gradient
- **Content:**
  - Fuel icon (⛽)
  - Fuel amount in liters
  - Visual fuel bar (color-coded: red→yellow→green)

### 6. **Track Info** (Bottom Right)
- **Location:** Bottom right corner
- **Shows:** Session information
- **Styling:** Cyan gradient
- **Content:**
  - Track name
  - Current lap number

### 7. **Connection Status** (Top Left Mini)
- **Location:** Small circle near standings ticker
- **Shows:** Connection to iRacing
- **Styling:** Minimal, transparent
- **Indicator:**
  - Green = Connected
  - Red = Disconnected

## Color Scheme

Each widget has a distinct color for easy identification:

| Widget | Border Color | Gradient |
|--------|--------------|----------|
| Standings Ticker | Cyan (#00d4ff) | Blue gradient |
| Driver Info | Magenta (#ff0080) | Purple gradient |
| Battle Box | Gold (#ffd700) | Yellow gradient |
| Lap Times | Green (#00ff88) | Green gradient |
| Fuel | Orange (#ff6600) | Red gradient |
| Track Info | Cyan (#00d4ff) | Blue gradient |

## Usage

### For OBS Studio:
1. Select "Sleek" overlay in producer panel
2. Add Browser Source in OBS
3. URL: `http://localhost:5000/overlay-sleek`
4. Width: 1920, Height: 1080
5. Check "Shutdown source when not visible"

### Toggle Widgets:
In the producer panel, under "Sleek Display Elements":
- ☑ Show Standings Ticker
- ☑ Show Driver Info Widget
- ☑ Show Battle Box
- ☑ Show Lap Times
- ☑ Show Fuel Indicator
- ☑ Show Track Info

Uncheck any widget to hide it from the overlay.

## Technical Details

### Data Updates
- **Update Rate:** 60 FPS via WebSocket
- **Latency:** < 50ms from iRacing
- **Fallback:** Graceful handling of missing data

### Battle Box Logic
The battle box calculates overtake projection using:
```
Speed Difference = Your Speed - Leader Speed
Time Gap = Current gap in seconds
Laps to Overtake = Gap / (Speed Difference × Track Factor)
```

If speed difference is negative (you're slower), shows "Losing ground".
If projection > 20 laps, shows "No overtake projected".

### Standings Ticker
Shows a contextual view:
- Your position (highlighted)
- 2 positions ahead
- 2 positions behind

Full standings available via scroll (max 10 drivers visible).

## Customization

### Colors
Edit `static/css/overlay-sleek.css` to change:
- Widget border colors
- Gradient backgrounds
- Text colors
- Highlight colors

### Layout
Adjust widget positions in CSS:
- `.standings-ticker { top: 20px; left: 20px; }`
- `.driver-info { top: 20px; right: 20px; }`
- etc.

### Fonts
Change font in CSS:
```css
font-family: 'Rajdhani', 'Segoe UI', sans-serif;
```

## Comparison: Classic vs Sleek

| Feature | Classic | Sleek |
|---------|---------|-------|
| Style | Simple, centered | Modern, distributed |
| Widgets | 4 areas | 7 widgets |
| Standings | Position only | Full ticker with gaps |
| Battle Info | No | Yes, with projection |
| Color Coding | Minimal | Full, per-widget |
| Animations | Slide-in | Slide-in with stagger |
| Data Density | Low | High |
| Use Case | Minimal overlay | Full broadcast |

## Best For

**Classic Overlay:**
- Simple streams
- Clean look
- Minimal distraction
- Focus on gameplay

**Sleek Overlay:**
- Professional broadcasts
- Detailed race coverage
- Multi-driver battles
- Esports productions

## Tips

1. **Test before going live:** Use demo mode to verify layout
2. **Hide unused widgets:** Toggle off widgets you don't need
3. **Match your style:** Choose overlay that fits your brand
4. **Consider resolution:** Works best at 1920x1080
5. **Check performance:** Monitor CPU usage with 60 FPS updates

## Screenshots

(The overlay features gradient backgrounds with glowing borders, modern typography, and smooth animations. Each widget is clearly separated and color-coded for instant recognition.)

---

**Ready to broadcast!** 🏁
