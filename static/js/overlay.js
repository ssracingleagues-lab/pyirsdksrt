// Overlay JavaScript
const socket = io();

let settings = {
    show_speed: true,
    show_rpm: true,
    show_gear: true,
    show_fuel: true,
    show_position: true,
    show_lap_time: true,
};

// Connection status
const connectionStatus = document.getElementById('connectionStatus');

socket.on('connect', () => {
    console.log('Connected to server');
    connectionStatus.classList.add('connected');
    connectionStatus.querySelector('.status-text').textContent = 'Connected';
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    connectionStatus.classList.remove('connected');
    connectionStatus.querySelector('.status-text').textContent = 'Disconnected';
});

// iRacing status updates
socket.on('iracing_status', (data) => {
    if (data.connected) {
        console.log('iRacing connected');
    } else {
        console.log('iRacing disconnected');
    }
});

// Settings updates
socket.on('settings_update', (newSettings) => {
    settings = newSettings;
    applySettings();
});

function applySettings() {
    // Show/hide elements based on settings
    toggleElement('speedDisplay', settings.show_speed);
    toggleElement('rpmDisplay', settings.show_rpm);
    toggleElement('gearDisplay', settings.show_gear);
    toggleElement('fuelDisplay', settings.show_fuel);
    toggleElement('positionDisplay', settings.show_position);
    toggleElement('lapTimeDisplay', settings.show_lap_time);
}

function toggleElement(id, show) {
    const element = document.getElementById(id);
    if (element) {
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    }
}

// Telemetry updates
socket.on('telemetry_update', (data) => {
    updateOverlay(data);
});

function updateOverlay(data) {
    // Speed - convert from m/s to mph
    if (data.speed !== null && data.speed !== undefined) {
        const speedMph = (data.speed * 2.23694).toFixed(0);
        document.getElementById('speed').textContent = speedMph;
    }
    
    // RPM
    if (data.rpm !== null && data.rpm !== undefined) {
        const rpm = data.rpm;
        document.getElementById('rpm').textContent = rpm.toFixed(0);
        
        // Update RPM bar (assuming max RPM of 10000 for visualization)
        const maxRpm = 10000;
        const rpmPercent = Math.min((rpm / maxRpm) * 100, 100);
        const rpmBar = document.getElementById('rpmBar');
        if (rpmBar) {
            rpmBar.style.width = rpmPercent + '%';
        }
    }
    
    // Gear
    if (data.gear !== null && data.gear !== undefined) {
        let gearText = data.gear;
        if (data.gear === 0) gearText = 'N';
        else if (data.gear === -1) gearText = 'R';
        document.getElementById('gear').textContent = gearText;
    }
    
    // Position
    if (data.position !== null && data.position !== undefined) {
        document.getElementById('position').textContent = data.position;
    }
    
    // Fuel
    if (data.fuel_level !== null && data.fuel_level !== undefined) {
        document.getElementById('fuel').textContent = data.fuel_level.toFixed(1) + 'L';
        
        // Update fuel bar
        if (data.fuel_level_pct !== null && data.fuel_level_pct !== undefined) {
            const fuelBar = document.getElementById('fuelBar');
            if (fuelBar) {
                const fuelPercent = Math.max(0, Math.min(data.fuel_level_pct * 100, 100));
                fuelBar.style.width = fuelPercent + '%';
            }
        }
    }
    
    // Lap times
    if (data.lap_current !== null && data.lap_current !== undefined) {
        document.getElementById('lapCurrent').textContent = formatTime(data.lap_current);
    }
    
    if (data.lap_best !== null && data.lap_best !== undefined && data.lap_best > 0) {
        document.getElementById('lapBest').textContent = formatTime(data.lap_best);
    }
    
    if (data.lap_last !== null && data.lap_last !== undefined && data.lap_last > 0) {
        document.getElementById('lapLast').textContent = formatTime(data.lap_last);
    }
    
    // Track name
    if (data.session_info && data.session_info.track_name) {
        document.getElementById('trackName').textContent = data.session_info.track_name;
    }
}

function formatTime(seconds) {
    if (seconds <= 0 || isNaN(seconds)) return '00:00.000';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// Initialize
console.log('Overlay initialized');
applySettings();
