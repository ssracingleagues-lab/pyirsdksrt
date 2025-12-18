// NASCAR-style Overlay JavaScript
const socket = io();

let settings = {
    show_standings: true,
    show_driver_panel: true,
    show_battle_box: true,
    show_race_info: true,
};

// Store full field data
let fullField = [];
let currentRotationIndex = 0;
let rotationInterval = null;

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
    toggleElement('standingsTower', settings.show_standings);
    toggleElement('driverPanel', settings.show_driver_panel);
    toggleElement('battleBox', settings.show_battle_box);
    toggleElement('raceInfoBar', settings.show_race_info);
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
    updateDriverPanel(data);
    updateStandingsTower(data);
    updateBattleBox(data);
    updateRaceInfo(data);
}

function updateDriverPanel(data) {
    // Driver number (would need from session data)
    const driverNumber = document.getElementById('driverNumber');
    if (driverNumber && !driverNumber.dataset.initialized) {
        driverNumber.textContent = '1';
        driverNumber.dataset.initialized = 'true';
    }
    
    // Driver name (would need from session data)
    const driverName = document.getElementById('driverName');
    if (driverName && !driverName.dataset.initialized) {
        driverName.textContent = 'YOUR NAME';
        driverName.dataset.initialized = 'true';
    }
    
    // Car model (would need from session data)
    const driverCar = document.getElementById('driverCar');
    if (driverCar && !driverCar.dataset.initialized) {
        driverCar.textContent = 'Car Model';
        driverCar.dataset.initialized = 'true';
    }
    
    // Fastest lap
    if (data.lap_best !== null && data.lap_best !== undefined && data.lap_best > 0) {
        const fastestLap = document.getElementById('fastestLap');
        if (fastestLap) fastestLap.textContent = formatTime(data.lap_best);
    }
    
    // Laps led (mock data - would need tracking)
    const lapsLed = document.getElementById('lapsLed');
    if (lapsLed && !lapsLed.dataset.value) {
        lapsLed.textContent = '0';
        lapsLed.dataset.value = '0';
    }
    
    // Started position (mock - would need from session start)
    const startPos = document.getElementById('startPos');
    if (startPos && !startPos.dataset.value) {
        startPos.textContent = data.position ? `P${data.position}` : 'P1';
        startPos.dataset.value = 'set';
    }
    
    // Current position
    if (data.position !== null && data.position !== undefined) {
        const currentPos = document.getElementById('currentPos');
        if (currentPos) currentPos.textContent = `P${data.position}`;
    }
}

function updateStandingsTower(data) {
    const towerContent = document.getElementById('towerContent');
    if (!towerContent) return;
    
    // Generate standings (in real implementation, this would come from backend with all cars)
    const standings = generateMockStandings(data);
    
    // Store full field
    fullField = standings;
    
    // Display top 20, rotate bottom 10 if more than 20 drivers
    displayStandings(standings);
    
    // Start rotation if we have more than 20 drivers
    if (standings.length > 20 && !rotationInterval) {
        rotationInterval = setInterval(() => {
            rotateStandings();
        }, 5000); // Rotate every 5 seconds
    }
}

function generateMockStandings(data) {
    const standings = [];
    const totalCars = 24; // Mock field size
    const playerPos = data.position || 1;
    
    for (let i = 1; i <= totalCars; i++) {
        const isPlayer = (i === playerPos);
        const gap = i === 1 ? 'LEADER' : (i === 2 ? `+${((i - 1) * 0.5).toFixed(3)}` : `+${((i - 1) * 0.8).toFixed(1)}s`);
        
        standings.push({
            position: i,
            name: isPlayer ? 'YOU' : `DRIVER ${i}`,
            number: isPlayer ? '1' : `${i}`,
            gap: gap,
            isPlayer: isPlayer,
            isLeader: i === 1
        });
    }
    
    return standings;
}

function displayStandings(standings) {
    const towerContent = document.getElementById('towerContent');
    if (!towerContent) return;
    
    // Show top 10 always
    const topTen = standings.slice(0, 10);
    
    // For positions 11-20, show next 10
    // If more than 20, rotate through the rest
    let bottomSection = [];
    if (standings.length > 20) {
        // Rotate through positions 11+
        const remaining = standings.slice(10);
        const startIdx = currentRotationIndex % Math.max(1, remaining.length - 10);
        bottomSection = remaining.slice(startIdx, startIdx + 10);
    } else {
        bottomSection = standings.slice(10, 20);
    }
    
    const displayedStandings = [...topTen, ...bottomSection];
    
    towerContent.innerHTML = displayedStandings.map(driver => `
        <div class="tower-item ${driver.isLeader ? 'leader' : ''} ${driver.isPlayer ? 'you' : ''}">
            <div class="tower-position">${driver.position}</div>
            <div class="tower-driver">
                <div class="tower-driver-name">${driver.name}</div>
                <div class="tower-driver-number">#${driver.number}</div>
            </div>
            <div class="tower-gap">${driver.gap}</div>
        </div>
    `).join('');
}

function rotateStandings() {
    if (fullField.length > 20) {
        currentRotationIndex++;
        displayStandings(fullField);
    }
}

function updateBattleBox(data) {
    const playerPos = data.position || 3;
    
    // Mock battle data (in real implementation, would use actual car data)
    const leaderPos = Math.max(1, playerPos - 1);
    const chaserPos = playerPos;
    
    // Leader (car ahead)
    const battleLeaderPos = document.getElementById('battleLeaderPos');
    const battleLeaderName = document.getElementById('battleLeaderName');
    const battleLeaderGap = document.getElementById('battleLeaderGap');
    const battleLeaderTime = document.getElementById('battleLeaderTime');
    
    if (battleLeaderPos) battleLeaderPos.textContent = `P${leaderPos}`;
    if (battleLeaderName) battleLeaderName.textContent = leaderPos === 1 ? 'LEADER' : `DRIVER ${leaderPos}`;
    if (battleLeaderGap) battleLeaderGap.textContent = 'AHEAD';
    
    // Chaser (you)
    const battleChaserPos = document.getElementById('battleChaserPos');
    const battleChaserName = document.getElementById('battleChaserName');
    const battleChaserGap = document.getElementById('battleChaserGap');
    const battleChaserTime = document.getElementById('battleChaserTime');
    
    if (battleChaserPos) battleChaserPos.textContent = `P${chaserPos}`;
    if (battleChaserName) battleChaserName.textContent = 'YOU';
    if (battleChaserGap) battleChaserGap.textContent = 'CHASING';
    
    // Lap times (use best lap as reference)
    if (data.lap_best && data.lap_best > 0) {
        const leaderTime = data.lap_best - 0.234; // Mock: leader is faster
        const chaserTime = data.lap_best;
        
        if (battleLeaderTime) battleLeaderTime.textContent = formatTime(leaderTime);
        if (battleChaserTime) battleChaserTime.textContent = formatTime(chaserTime);
        
        // Calculate delta and projection
        const delta = chaserTime - leaderTime;
        const battleDelta = document.getElementById('battleDelta');
        if (battleDelta) battleDelta.textContent = `+${delta.toFixed(3)}`;
        
        // Projection (mock calculation)
        const gap = 0.5; // seconds gap
        const battleProjection = document.getElementById('battleProjection');
        if (battleProjection) {
            if (delta < 0.1) {
                const lapsToPass = Math.ceil(gap / Math.abs(delta) * 0.05);
                battleProjection.textContent = `PASS IN ${lapsToPass} LAPS`;
            } else {
                battleProjection.textContent = 'LOSING GROUND';
            }
        }
    }
}

function updateRaceInfo(data) {
    // Track name
    if (data.session_info && data.session_info.track_name) {
        const trackName = document.getElementById('trackName');
        if (trackName) trackName.textContent = data.session_info.track_name;
    }
    
    // Current lap
    if (data.lap !== null && data.lap !== undefined) {
        const currentLap = document.getElementById('currentLap');
        if (currentLap) {
            // Mock total laps
            const totalLaps = 50;
            currentLap.textContent = `${data.lap} / ${totalLaps}`;
        }
    }
    
    // Race time (session time)
    if (data.session_time !== null && data.session_time !== undefined) {
        const raceTime = document.getElementById('raceTime');
        if (raceTime) raceTime.textContent = formatRaceTime(data.session_time);
    }
}

function formatTime(seconds) {
    if (seconds <= 0 || isNaN(seconds)) return '--:--.-';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

function formatRaceTime(seconds) {
    if (seconds <= 0 || isNaN(seconds)) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Initialize
console.log('NASCAR overlay initialized');
applySettings();

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    if (rotationInterval) {
        clearInterval(rotationInterval);
    }
});
