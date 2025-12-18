#!/usr/bin/env python3
"""
Demo mode for iRacing Broadcast Overlay
Simulates telemetry data when iRacing is not running
Useful for testing the overlay and producer panel setup
"""

import eventlet
eventlet.monkey_patch()

import time
import random
import math
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'demo-mode-secret'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

class DemoState:
    def __init__(self):
        self.running = False
        self.lap_time = 0
        self.best_lap = 87.543
        self.last_lap = 88.123
        self.fuel = 50.0
        self.position = 3
        self.lap = 1

demo = DemoState()

def generate_demo_data():
    """Generate realistic demo telemetry data"""
    t = time.time()
    
    # Simulate varying speed (50-180 mph pattern)
    speed_base = 120 + 60 * math.sin(t / 3)
    speed_mps = (speed_base / 2.23694) + random.uniform(-2, 2)
    
    # Simulate RPM (4000-8500)
    rpm_base = 6000 + 2000 * math.sin(t / 2.5)
    rpm = rpm_base + random.uniform(-200, 200)
    
    # Simulate gear changes
    if speed_base < 70:
        gear = random.choice([2, 3])
    elif speed_base < 100:
        gear = random.choice([3, 4])
    elif speed_base < 140:
        gear = random.choice([4, 5])
    else:
        gear = random.choice([5, 6])
    
    # Update lap time
    demo.lap_time += 1.0/60.0
    
    # Simulate fuel consumption
    demo.fuel = max(0, demo.fuel - 0.001)
    
    return {
        'speed': speed_mps,
        'rpm': rpm,
        'gear': gear,
        'fuel_level': demo.fuel,
        'fuel_level_pct': demo.fuel / 100.0,
        'lap': demo.lap,
        'lap_current': demo.lap_time,
        'lap_last': demo.last_lap,
        'lap_best': demo.best_lap,
        'position': demo.position,
        'is_on_track': True,
        'session_info': {
            'track_name': 'Watkins Glen International - Boot',
        }
    }

def demo_telemetry_loop():
    """Demo telemetry loop"""
    print("Starting demo telemetry loop")
    while demo.running:
        data = generate_demo_data()
        socketio.emit('telemetry_update', data, namespace='/')
        
        # Simulate lap completion
        if demo.lap_time > 90:
            demo.lap += 1
            demo.last_lap = demo.lap_time
            if demo.lap_time < demo.best_lap:
                demo.best_lap = demo.lap_time
            demo.lap_time = 0
            demo.position = random.randint(1, 5)
        
        eventlet.sleep(1.0 / 60.0)

@app.route('/')
def index():
    return render_template('producer.html')

@app.route('/overlay')
def overlay():
    return render_template('overlay.html')

@app.route('/api/status')
def api_status():
    return jsonify({
        'connected': True,
        'running': demo.running,
    })

@socketio.on('connect')
def handle_connect():
    print('Client connected (Demo Mode)')
    socketio.emit('iracing_status', {'connected': True})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('camera_switch')
def handle_camera_switch(data):
    print(f"Demo: Camera switch to car #{data.get('car_num')}")

def start_demo_server(host='0.0.0.0', port=5000):
    """Start the demo broadcast overlay server"""
    demo.running = True
    
    # Start demo telemetry thread
    eventlet.spawn(demo_telemetry_loop)
    
    print(f"\n{'='*60}")
    print("iRacing Broadcast Overlay - DEMO MODE")
    print(f"{'='*60}")
    print("⚠️  Running with simulated data (iRacing not required)")
    print(f"\nProducer Panel:  http://localhost:{port}/")
    print(f"OBS Overlay:     http://localhost:{port}/overlay")
    print(f"\n{'='*60}")
    print("Press Ctrl+C to stop\n")
    
    try:
        socketio.run(app, host=host, port=port, debug=False)
    except KeyboardInterrupt:
        print("\nShutting down demo server...")
        demo.running = False

if __name__ == '__main__':
    start_demo_server()
