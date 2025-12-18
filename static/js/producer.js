// Producer Panel JavaScript
const socket = io();

// Connection status
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// iRacing status updates
socket.on('iracing_status', (data) => {
    const statusIndicator = document.getElementById('iracingStatus');
    const statusText = statusIndicator.querySelector('.status-text');
    
    if (data.connected) {
        statusIndicator.classList.add('connected');
        statusText.textContent = 'Connected to iRacing';
    } else {
        statusIndicator.classList.remove('connected');
        statusText.textContent = 'Disconnected';
    }
});

// Telemetry updates
socket.on('telemetry_update', (data) => {
    updateTelemetryDisplay(data);
});

function updateTelemetryDisplay(data) {
    // Speed
    if (data.speed !== null && data.speed !== undefined) {
        const speedMph = (data.speed * 2.23694).toFixed(0);
        document.getElementById('speed').textContent = speedMph;
    }
    
    // RPM
    if (data.rpm !== null && data.rpm !== undefined) {
        document.getElementById('rpm').textContent = data.rpm.toFixed(0);
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
    
    // Lap
    if (data.lap !== null && data.lap !== undefined) {
        document.getElementById('lap').textContent = data.lap;
    }
    
    // Fuel
    if (data.fuel_level !== null && data.fuel_level !== undefined) {
        document.getElementById('fuel').textContent = data.fuel_level.toFixed(1);
    }
    
    // Lap times
    if (data.lap_current !== null && data.lap_current !== undefined) {
        document.getElementById('lapCurrent').textContent = formatTime(data.lap_current);
    }
    
    if (data.lap_best !== null && data.lap_best !== undefined) {
        document.getElementById('lapBest').textContent = formatTime(data.lap_best);
    }
}

function formatTime(seconds) {
    if (seconds <= 0 || isNaN(seconds)) return '00:00.000';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// Overlay settings controls
const settingCheckboxes = {
    showSpeed: document.getElementById('showSpeed'),
    showRpm: document.getElementById('showRpm'),
    showGear: document.getElementById('showGear'),
    showFuel: document.getElementById('showFuel'),
    showPosition: document.getElementById('showPosition'),
    showLapTime: document.getElementById('showLapTime'),
};

// Listen for checkbox changes
Object.keys(settingCheckboxes).forEach(key => {
    const checkbox = settingCheckboxes[key];
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            updateSettings();
        });
    }
});

function updateSettings() {
    const settings = {};
    Object.keys(settingCheckboxes).forEach(key => {
        const checkbox = settingCheckboxes[key];
        if (checkbox) {
            settings[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = checkbox.checked;
        }
    });
    
    // Send to server
    fetch('/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
    }).catch(err => console.error('Error updating settings:', err));
}

// Settings update from server
socket.on('settings_update', (settings) => {
    // Update checkboxes based on server settings
    Object.keys(settings).forEach(key => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        const checkbox = settingCheckboxes[camelKey];
        if (checkbox) {
            checkbox.checked = settings[key];
        }
    });
});

// Camera controls
const switchCameraBtn = document.getElementById('switchCamera');
const carNumberInput = document.getElementById('carNumber');

if (switchCameraBtn) {
    switchCameraBtn.addEventListener('click', () => {
        const carNum = parseInt(carNumberInput.value, 10);
        if (!isNaN(carNum)) {
            socket.emit('camera_switch', {
                car_num: carNum,
                camera: 0
            });
            console.log(`Switching to car #${carNum}`);
        }
    });
}

// Copy overlay URL button
const copyOverlayUrlBtn = document.getElementById('copyOverlayUrl');
if (copyOverlayUrlBtn) {
    copyOverlayUrlBtn.addEventListener('click', () => {
        const url = window.location.origin + '/overlay';
        navigator.clipboard.writeText(url).then(() => {
            const originalText = copyOverlayUrlBtn.textContent;
            copyOverlayUrlBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyOverlayUrlBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy URL:', err);
            alert('URL: ' + url);
        });
    });
}

// Initialize
console.log('Producer panel initialized');
