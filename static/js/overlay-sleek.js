// Overlay Sleek JavaScript
const socket = io();

let settings = {
    show_standings: true,
    show_driver_info: true,
    show_battle_box: true,
    show_lap_info: true,
    show_fuel: true,
    show_track_info: true,
};

// Store standings data
let standingsData = [];
let playerCarIdx = null;

// Connection status
const connectionStatus = document.getElementById('connectionStatus');

socket.on('connect', () => {
    console.log('Connected to server');
    if (connectionStatus) {
        connectionStatus.classList.add('connected');
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    if (connectionStatus) {
        connectionStatus.classList.remove('connected');
    }
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
    settings = {...settings, ...newSettings};
    applySettings();
});

function applySettings() {
    toggleElement('standingsTicker', settings.show_standings);
    toggleElement('driverInfo', settings.show_driver_info);
    toggleElement('battleBox', settings.show_battle_box);
    toggleElement('lapInfo', settings.show_lap_info);
    toggleElement('fuelIndicator', settings.show_fuel);
    toggleElement('trackInfoWidget', settings.show_track_info);
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
    // Update driver info widget
    updateDriverInfo(data);
    
    // Update lap times
    updateLapInfo(data);
    
    // Update fuel
    updateFuel(data);
    
    // Update track info
    updateTrackInfo(data);
    
    // Update standings (mock data for now - would need backend support for full standings)
    updateStandings(data);
    
    // Update battle box
    updateBattleBox(data);
}

function updateDriverInfo(data) {
    // Position
    if (data.position !== null && data.position !== undefined) {
        const driverPos = document.getElementById('driverPos');
        if (driverPos) driverPos.textContent = `P${data.position}`;
    }
    
    // Driver name (would need to come from session data)
    const driverName = document.getElementById('driverName');
    if (driverName && !driverName.dataset.initialized) {
        driverName.textContent = 'YOU';
        driverName.dataset.initialized = 'true';
    }
    
    // Speed
    if (data.speed !== null && data.speed !== undefined) {
        const speedMph = Math.round(data.speed * 2.23694);
        const driverSpeed = document.getElementById('driverSpeed');
        if (driverSpeed) driverSpeed.textContent = speedMph;
    }
    
    // Gear
    if (data.gear !== null && data.gear !== undefined) {
        let gearText = data.gear;
        if (data.gear === 0) gearText = 'N';
        else if (data.gear === -1) gearText = 'R';
        const driverGear = document.getElementById('driverGear');
        if (driverGear) driverGear.textContent = gearText;
    }
    
    // RPM
    if (data.rpm !== null && data.rpm !== undefined) {
        const driverRpm = document.getElementById('driverRpm');
        if (driverRpm) driverRpm.textContent = Math.round(data.rpm);
        
        // Update RPM bar
        const maxRpm = 10000;
        const rpmPercent = Math.min((data.rpm / maxRpm) * 100, 100);
        const rpmMiniFill = document.getElementById('rpmMiniFill');
        if (rpmMiniFill) {
            rpmMiniFill.style.width = rpmPercent + '%';
        }
    }
}

function updateLapInfo(data) {
    // Current lap time
    if (data.lap_current !== null && data.lap_current !== undefined) {
        const lapCurrent = document.getElementById('lapCurrent');
        if (lapCurrent) lapCurrent.textContent = formatTime(data.lap_current);
    }
    
    // Best lap time
    if (data.lap_best !== null && data.lap_best !== undefined && data.lap_best > 0) {
        const lapBest = document.getElementById('lapBest');
        if (lapBest) lapBest.textContent = formatTime(data.lap_best);
    }
    
    // Last lap time
    if (data.lap_last !== null && data.lap_last !== undefined && data.lap_last > 0) {
        const lapLast = document.getElementById('lapLast');
        if (lapLast) lapLast.textContent = formatTime(data.lap_last);
    }
}

function updateFuel(data) {
    if (data.fuel_level !== null && data.fuel_level !== undefined) {
        const fuelValue = document.getElementById('fuelValue');
        if (fuelValue) fuelValue.textContent = data.fuel_level.toFixed(1) + 'L';
        
        // Update fuel bar
        if (data.fuel_level_pct !== null && data.fuel_level_pct !== undefined) {
            const fuelBarFill = document.getElementById('fuelBarFill');
            if (fuelBarFill) {
                const fuelPercent = Math.max(0, Math.min(data.fuel_level_pct * 100, 100));
                fuelBarFill.style.width = fuelPercent + '%';
            }
        }
    }
}

function updateTrackInfo(data) {
    // Track name
    if (data.session_info && data.session_info.track_name) {
        const trackName = document.getElementById('trackName');
        if (trackName) trackName.textContent = data.session_info.track_name;
    }
    
    // Current lap
    if (data.lap !== null && data.lap !== undefined) {
        const sessionLap = document.getElementById('sessionLap');
        if (sessionLap) sessionLap.textContent = data.lap;
    }
}

function updateStandings(data) {
    // This is a simplified version - full implementation would need backend support
    // For now, we'll create mock standings based on position
    if (data.position !== null && data.position !== undefined) {
        const tickerContent = document.getElementById('tickerContent');
        if (!tickerContent) return;
        
        // Generate mock standings (in real implementation, this would come from backend)
        const mockStandings = [];
        const playerPos = data.position;
        
        // Show 5 positions: 2 ahead, player, 2 behind
        const startPos = Math.max(1, playerPos - 2);
        const endPos = startPos + 4;
        
        for (let i = startPos; i <= endPos; i++) {
            const isPlayer = (i === playerPos);
            const gap = i === 1 ? '—' : `+${((i - 1) * 1.5).toFixed(1)}s`;
            
            mockStandings.push({
                position: i,
                name: isPlayer ? 'YOU' : `Driver ${i}`,
                gap: gap,
                isPlayer: isPlayer
            });
        }
        
        // Update ticker
        tickerContent.innerHTML = mockStandings.map(driver => `
            <div class="ticker-item ${driver.isPlayer ? 'you' : ''}">
                <span class="ticker-pos">${driver.position}</span>
                <span class="ticker-name">${driver.name}</span>
                <span class="ticker-gap">${driver.gap}</span>
            </div>
        `).join('');
    }
}

function updateBattleBox(data) {
    // This is a simplified version - full implementation would need CarIdx data from backend
    if (data.position !== null && data.position !== undefined && data.speed !== null) {
        const playerPos = data.position;
        const playerSpeed = Math.round(data.speed * 2.23694);
        
        // Mock data for cars ahead and behind
        const aheadPos = Math.max(1, playerPos - 1);
        const behindPos = playerPos + 1;
        
        // Simulate speed difference (would be real data in full implementation)
        const aheadSpeed = playerSpeed + Math.floor(Math.random() * 3 - 1);
        const speedDiff = playerSpeed - aheadSpeed;
        
        // Update ahead driver
        const battleAheadPos = document.getElementById('battleAheadPos');
        const battleAheadName = document.getElementById('battleAheadName');
        const battleAheadSpeed = document.getElementById('battleAheadSpeed');
        
        if (battleAheadPos) battleAheadPos.textContent = `P${aheadPos}`;
        if (battleAheadName) battleAheadName.textContent = aheadPos === 1 ? 'Leader' : `Driver ${aheadPos}`;
        if (battleAheadSpeed) battleAheadSpeed.textContent = aheadSpeed;
        
        // Update player (behind)
        const battleBehindPos = document.getElementById('battleBehindPos');
        const battleBehindName = document.getElementById('battleBehindName');
        const battleBehindSpeed = document.getElementById('battleBehindSpeed');
        
        if (battleBehindPos) battleBehindPos.textContent = `P${playerPos}`;
        if (battleBehindName) battleBehindName.textContent = 'YOU';
        if (battleBehindSpeed) battleBehindSpeed.textContent = playerSpeed;
        
        // Update delta and projection
        const gap = 0.5 + Math.random() * 2; // Mock gap
        const battleDelta = document.getElementById('battleDelta');
        const battleProjection = document.getElementById('battleProjection');
        
        if (battleDelta) battleDelta.textContent = `+${gap.toFixed(1)}s`;
        
        // Calculate projection (laps until overtake based on speed difference)
        if (battleProjection) {
            if (speedDiff > 0) {
                const lapsToOvertake = Math.ceil(gap / (speedDiff * 0.1));
                if (lapsToOvertake < 20) {
                    battleProjection.textContent = `~${lapsToOvertake} laps to overtake`;
                } else {
                    battleProjection.textContent = 'No overtake projected';
                }
            } else {
                battleProjection.textContent = 'Losing ground';
            }
        }
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
console.log('Sleek overlay initialized');
applySettings();
