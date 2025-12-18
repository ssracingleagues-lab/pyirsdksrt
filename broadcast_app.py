#!/usr/bin/env python3
"""
iRacing Broadcast Overlay Application
A web-based broadcast overlay system for iRacing with OBS integration
"""

import eventlet
eventlet.monkey_patch()

import irsdk
import time
import json
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from threading import Thread, Lock

app = Flask(__name__)
app.config['SECRET_KEY'] = 'iracing-broadcast-overlay-secret'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Global state
class BroadcastState:
    def __init__(self):
        self.ir_connected = False
        self.ir = irsdk.IRSDK()
        self.running = False
        self.data_lock = Lock()
        self.current_data = {}
        self.overlay_settings = {
            'show_speed': True,
            'show_rpm': True,
            'show_gear': True,
            'show_fuel': True,
            'show_position': True,
            'show_lap_time': True,
            'show_delta': True,
        }

state = BroadcastState()

def check_iracing():
    """Check if connected to iRacing and manage connection state"""
    if state.ir_connected and not (state.ir.is_initialized and state.ir.is_connected):
        state.ir_connected = False
        state.ir.shutdown()
        print('iRacing disconnected')
        socketio.emit('iracing_status', {'connected': False}, namespace='/')
    elif not state.ir_connected and state.ir.startup() and state.ir.is_initialized and state.ir.is_connected:
        state.ir_connected = True
        print('iRacing connected')
        socketio.emit('iracing_status', {'connected': True}, namespace='/')

def get_telemetry_data():
    """Retrieve and format telemetry data from iRacing"""
    if not state.ir_connected:
        return None
    
    try:
        state.ir.freeze_var_buffer_latest()
        
        # Get telemetry data
        data = {
            'speed': state.ir['Speed'],
            'rpm': state.ir['RPM'],
            'gear': state.ir['Gear'],
            'fuel_level': state.ir['FuelLevel'],
            'fuel_level_pct': state.ir['FuelLevelPct'],
            'lap': state.ir['Lap'],
            'lap_current': state.ir['LapCurrentLapTime'],
            'lap_last': state.ir['LapLastLapTime'],
            'lap_best': state.ir['LapBestLapTime'],
            'session_time': state.ir['SessionTime'],
            'session_state': state.ir['SessionState'],
            'player_car_idx': state.ir['PlayerCarIdx'],
            'is_on_track': state.ir['IsOnTrack'],
            'track_temp': state.ir['TrackTempCrew'],
            'air_temp': state.ir['AirTemp'],
        }
        
        # Get position data if available
        if state.ir['CarIdxLap'] and state.ir['PlayerCarIdx'] is not None:
            player_idx = state.ir['PlayerCarIdx']
            laps = state.ir['CarIdxLap']
            if laps and player_idx < len(laps):
                data['position'] = sum(1 for lap in laps if lap > laps[player_idx]) + 1
        
        # Get session info
        session_info = state.ir['SessionInfo']
        if session_info and 'Sessions' in session_info:
            data['session_info'] = {
                'track_name': state.ir['WeekendInfo']['TrackDisplayName'] if state.ir['WeekendInfo'] else 'Unknown',
            }
        
        return data
    except Exception as e:
        print(f"Error getting telemetry: {e}")
        return None

def telemetry_loop():
    """Main telemetry loop that runs in a separate thread"""
    print("Starting telemetry loop")
    while state.running:
        check_iracing()
        
        if state.ir_connected:
            data = get_telemetry_data()
            if data:
                with state.data_lock:
                    state.current_data = data
                
                # Emit data to all connected clients
                socketio.emit('telemetry_update', data, namespace='/')
        
        # Update rate: 60 fps max (iRacing updates at 60 fps)
        eventlet.sleep(1.0 / 60.0)

# Web routes
@app.route('/')
def index():
    """Main producer control panel"""
    return render_template('producer.html')

@app.route('/overlay')
def overlay():
    """OBS browser source overlay - Classic"""
    return render_template('overlay.html')

@app.route('/overlay-sleek')
def overlay_sleek():
    """OBS browser source overlay - Sleek"""
    return render_template('overlay-sleek.html')

@app.route('/overlay-nascar')
def overlay_nascar():
    """OBS browser source overlay - NASCAR Style"""
    return render_template('overlay-nascar.html')

@app.route('/api/status')
def api_status():
    """API endpoint for current connection status"""
    return jsonify({
        'connected': state.ir_connected,
        'running': state.running,
    })

@app.route('/api/telemetry')
def api_telemetry():
    """API endpoint for current telemetry data"""
    with state.data_lock:
        return jsonify(state.current_data)

@app.route('/api/settings', methods=['GET', 'POST'])
def api_settings():
    """API endpoint for overlay settings"""
    if request.method == 'POST':
        settings = request.get_json()
        state.overlay_settings.update(settings)
        socketio.emit('settings_update', state.overlay_settings, namespace='/')
        return jsonify({'success': True})
    return jsonify(state.overlay_settings)

# SocketIO events
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('iracing_status', {'connected': state.ir_connected})
    emit('settings_update', state.overlay_settings)

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

@socketio.on('camera_switch')
def handle_camera_switch(data):
    """Handle camera switch command from producer panel"""
    if state.ir_connected:
        car_num = data.get('car_num', 1)
        camera = data.get('camera', 0)
        state.ir.cam_switch_num(car_num, 0, camera)
        print(f'Switched camera to car #{car_num}, camera {camera}')

@socketio.on('pit_command')
def handle_pit_command(data):
    """Handle pit command from producer panel"""
    if state.ir_connected:
        command = data.get('command')
        # Add pit command handling here if needed
        print(f'Pit command: {command}')

def start_server(host='0.0.0.0', port=5000):
    """Start the broadcast overlay server"""
    state.running = True
    
    # Start telemetry thread
    telemetry_thread = Thread(target=telemetry_loop, daemon=True)
    telemetry_thread.start()
    
    print(f"\n{'='*60}")
    print("iRacing Broadcast Overlay Server")
    print(f"{'='*60}")
    print(f"Producer Panel:  http://localhost:{port}/")
    print(f"OBS Overlay:     http://localhost:{port}/overlay")
    print(f"{'='*60}\n")
    
    try:
        socketio.run(app, host=host, port=port, debug=False)
    except KeyboardInterrupt:
        print("\nShutting down...")
        state.running = False
        if state.ir_connected:
            state.ir.shutdown()

if __name__ == '__main__':
    start_server()
