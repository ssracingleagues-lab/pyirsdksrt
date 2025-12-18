# 🏁 iRacing Broadcast Overlay - Start Here!

**Welcome! You've found a complete, ready-to-use broadcast overlay system for iRacing.**

## 🚀 Quick Start (2 Steps)

### Step 1: Install Dependencies (One Time Only)
```bash
pip install -r requirements.txt
```

### Step 2: Start the Application
**Windows:** Double-click `START_BROADCAST.bat`  
**Any OS:** Run `python start_broadcast.py`

**That's it!** Open http://localhost:5000/ in your browser.

---

## 📖 Documentation Guide

| Document | When to Read |
|----------|--------------|
| **[README.md](README.md)** | Quick overview of features |
| **[ONE_STOP_SHOP.md](ONE_STOP_SHOP.md)** | Understand what's included |
| **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** | Complete setup from scratch |
| **[QUICK_START.md](QUICK_START.md)** | Quick reference & troubleshooting |
| **[BROADCAST_README.md](BROADCAST_README.md)** | Detailed feature documentation |
| **[PACKAGE_CONTENTS.md](PACKAGE_CONTENTS.md)** | What each file does |

---

## ✅ What's Included (No Separate Downloads!)

✓ **irsdk.py** - Full iRacing SDK (794 lines, 32KB)  
✓ **Web Server** - Flask-based application  
✓ **Producer Panel** - Control what's displayed  
✓ **OBS Overlay** - Professional transparent overlay  
✓ **Demo Mode** - Test without iRacing  
✓ **Complete Documentation** - 6 comprehensive guides  

---

## 🎯 I Just Want To...

**"Set this up for the first time"**  
→ Read [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

**"Start using it now"**  
→ Double-click `START_BROADCAST.bat` or run `python start_broadcast.py`

**"Test without iRacing"**  
→ Run `python demo_mode.py`

**"Use it with OBS"**  
→ Add Browser Source: `http://localhost:5000/overlay`

**"Understand what's included"**  
→ Read [ONE_STOP_SHOP.md](ONE_STOP_SHOP.md)

**"Get help"**  
→ Check [QUICK_START.md](QUICK_START.md) troubleshooting

---

## 🆘 Common Questions

**Q: Do I need to download the iRacing SDK separately?**  
A: **No!** It's included as `irsdk.py` in this package.

**Q: Do I need to install pyirsdk?**  
A: **No!** The SDK is already here. Just run `pip install -r requirements.txt`

**Q: What do I need installed?**  
A: Just Python 3.7+ and the packages in requirements.txt

**Q: Will this work on Windows?**  
A: Yes! That's the primary platform. Double-click `START_BROADCAST.bat`

**Q: Can I test without iRacing?**  
A: Yes! Run `python demo_mode.py` for simulated data.

---

## 🎬 URLs Once Running

- **Producer Panel:** http://localhost:5000/
- **OBS Overlay:** http://localhost:5000/overlay
- **API Status:** http://localhost:5000/api/status

---

**Ready to get started?** Follow the Quick Start above or read the [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed instructions.

Happy Broadcasting! 🏁
