#!/usr/bin/env python3
"""
Quick start script for iRacing Broadcast Overlay Application
Checks dependencies and starts the server
"""

import sys
import subprocess
import os

def check_dependencies():
    """Check if all required packages are installed"""
    required_packages = [
        'flask',
        'flask_socketio',
        'eventlet',
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    # Check if irsdk.py exists in current directory
    if not os.path.exists('irsdk.py'):
        print("Error: irsdk.py not found in current directory!")
        return False
    
    if missing:
        print("Missing required packages:", ", ".join(missing))
        print("\nInstalling dependencies...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("\n✓ Dependencies installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("\n✗ Failed to install dependencies")
            print("Please manually run: pip install -r requirements.txt")
            return False
    return True

def main():
    print("""
╔════════════════════════════════════════════════════════════╗
║      iRacing Broadcast Overlay Application - Launcher      ║
╚════════════════════════════════════════════════════════════╝
""")
    
    # Check if we're in the right directory
    if not os.path.exists('broadcast_app.py'):
        print("Error: broadcast_app.py not found!")
        print("Please run this script from the pyirsdksrt directory")
        sys.exit(1)
    
    # Check dependencies
    print("Checking dependencies...")
    if not check_dependencies():
        sys.exit(1)
    
    print("\n✓ All dependencies are installed")
    print("\nStarting broadcast overlay server...\n")
    
    # Start the application
    try:
        import broadcast_app
        broadcast_app.start_server()
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except Exception as e:
        print(f"\n\nError starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
