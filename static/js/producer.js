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

// Overlay style switching
const overlayStyleRadios = document.querySelectorAll('input[name="overlayStyle"]');
const classicControls = document.getElementById('classicControls');
const sleekControls = document.getElementById('sleekControls');
const nascarControls = document.getElementById('nascarControls');
const openOverlayBtn = document.getElementById('openOverlayBtn');

overlayStyleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const style = e.target.value;
        if (style === 'classic') {
            classicControls.classList.remove('hidden');
            sleekControls.classList.add('hidden');
            nascarControls.classList.add('hidden');
            openOverlayBtn.href = '/overlay';
            openOverlayBtn.textContent = 'Open Classic Overlay';
        } else if (style === 'sleek') {
            classicControls.classList.add('hidden');
            sleekControls.classList.remove('hidden');
            nascarControls.classList.add('hidden');
            openOverlayBtn.href = '/overlay-sleek';
            openOverlayBtn.textContent = 'Open Sleek Overlay';
        } else if (style === 'nascar') {
            classicControls.classList.add('hidden');
            sleekControls.classList.add('hidden');
            nascarControls.classList.remove('hidden');
            openOverlayBtn.href = '/overlay-nascar';
            openOverlayBtn.textContent = 'Open NASCAR Overlay';
        }
    });
});

// Overlay settings controls
const settingCheckboxes = {
    showSpeed: document.getElementById('showSpeed'),
    showRpm: document.getElementById('showRpm'),
    showGear: document.getElementById('showGear'),
    showFuel: document.getElementById('showFuel'),
    showPosition: document.getElementById('showPosition'),
    showLapTime: document.getElementById('showLapTime'),
};

const sleekSettingCheckboxes = {
    showStandings: document.getElementById('showStandings'),
    showDriverInfo: document.getElementById('showDriverInfo'),
    showBattleBox: document.getElementById('showBattleBox'),
    showLapInfo: document.getElementById('showLapInfo'),
    showFuelSleek: document.getElementById('showFuelSleek'),
    showTrackInfo: document.getElementById('showTrackInfo'),
};

const nascarSettingCheckboxes = {
    showStandingsNascar: document.getElementById('showStandingsNascar'),
    showDriverPanelNascar: document.getElementById('showDriverPanelNascar'),
    showBattleBoxNascar: document.getElementById('showBattleBoxNascar'),
    showRaceInfoNascar: document.getElementById('showRaceInfoNascar'),
};

// Listen for checkbox changes - Classic
Object.keys(settingCheckboxes).forEach(key => {
    const checkbox = settingCheckboxes[key];
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            updateSettings();
        });
    }
});

// Listen for checkbox changes - Sleek
Object.keys(sleekSettingCheckboxes).forEach(key => {
    const checkbox = sleekSettingCheckboxes[key];
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            updateSleekSettings();
        });
    }
});

// Listen for checkbox changes - NASCAR
Object.keys(nascarSettingCheckboxes).forEach(key => {
    const checkbox = nascarSettingCheckboxes[key];
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            updateNascarSettings();
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

function updateSleekSettings() {
    const settings = {};
    Object.keys(sleekSettingCheckboxes).forEach(key => {
        const checkbox = sleekSettingCheckboxes[key];
        if (checkbox) {
            const settingKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            settings[settingKey] = checkbox.checked;
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

function updateNascarSettings() {
    const settings = {};
    Object.keys(nascarSettingCheckboxes).forEach(key => {
        const checkbox = nascarSettingCheckboxes[key];
        if (checkbox) {
            const settingKey = key.replace(/([A-Z])/g, '_$1').toLowerCase().replace('_nascar', '');
            settings[settingKey] = checkbox.checked;
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
        const checkbox = settingCheckboxes[camelKey] || sleekSettingCheckboxes[camelKey];
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
