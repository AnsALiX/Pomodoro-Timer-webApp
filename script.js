// =========================================
// 1. HTML ELEMENTS & SETUP
// =========================================
const body = document.body;
const timeLabel = document.getElementById('time-label');
const modeLabel = document.getElementById('mode-label');
const primaryBtn = document.getElementById('primary-btn');
const resetBtn = document.getElementById('reset-btn');
const focusInput = document.getElementById('focus-time');
const breakInput = document.getElementById('break-time');
const historyList = document.getElementById('history-list');

// We use a free, generic beep sound URL for the audible cue
const chime = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

// =========================================
// 2. STATE VARIABLES
// =========================================
let timerInterval;
let timeLeft = 25 * 60; // Defaults to 25 minutes (in seconds)
let isFocusMode = true; // Tracks if we are in focus (true) or break (false)
let isRunning = false;  // Tracks if the timer is actively counting down


// =========================================
// 3. UI DISPLAY LOGIC
// =========================================
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // .padStart(2, '0') adds a leading zero to single digits (e.g., 9 becomes 09)
    timeLabel.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the status label beneath the numbers
    if (!isRunning && timeLeft === (isFocusMode ? focusInput.value * 60 : breakInput.value * 60)) {
        modeLabel.textContent = isFocusMode ? "Ready to Focus" : "Ready for Break";
    } else {
        modeLabel.textContent = isFocusMode ? "Focusing..." : "On Break...";
    }
    
    // Update the browser tab title so you can see the time from other tabs
    document.title = `${timeLabel.textContent} - ${isFocusMode ? 'Focus' : 'Break'}`;
}


// =========================================
// 4. CORE TIMER LOGIC
// =========================================
function toggleTimer() {
    if (isRunning) {
        // Pause the timer
        clearInterval(timerInterval);
        isRunning = false;
        primaryBtn.textContent = 'Resume';
    } else {
        // Start the timer
        isRunning = true;
        primaryBtn.textContent = 'Pause';
        
        // Loop this exact block of code every 1000 milliseconds (1 second)
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                handleCycleComplete();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isFocusMode = true;
    
    // Reset CSS theme to Focus (red)
    body.setAttribute('data-mode', 'focus'); 
    primaryBtn.textContent = 'Start';
    
    // Pull the fresh time from the input box
    timeLeft = parseInt(focusInput.value) * 60;
    updateDisplay();
}

function handleCycleComplete() {
    clearInterval(timerInterval);
    
    // Play the chime. The .catch prevents the app from crashing if the browser blocks auto-play audio
    chime.play().catch(e => console.log("Browser blocked audio")); 

    if (isFocusMode) {
        // Focus finished! Save it to the list and switch to break
        saveSession(); 
        isFocusMode = false;
        timeLeft = parseInt(breakInput.value) * 60;
        body.setAttribute('data-mode', 'break'); // Triggers green CSS theme
    } else {
        // Break finished! Switch back to focus
        isFocusMode = true;
        timeLeft = parseInt(focusInput.value) * 60;
        body.setAttribute('data-mode', 'focus'); // Triggers red CSS theme
    }
    
    updateDisplay();
    
    // Automatically start the next cycle as requested by the project requirements
    isRunning = false; 
    toggleTimer(); 
}


// =========================================
// 5. HISTORY & LOCAL STORAGE LOGIC
// =========================================
function getTodayDate() {
    return new Date().toLocaleDateString();
}

function saveSession() {
    const timeNow = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const text = `✓ ${focusInput.value}:00 focus — ${timeNow}`;
    
    // Grab existing history from the browser's memory, or start fresh if it's empty
    let data = JSON.parse(localStorage.getItem('pomodoroHistory')) || { date: '', sessions: [] };
    
    // If the saved date doesn't match today's date, wipe the session array clean
    if (data.date !== getTodayDate()) {
        data = { date: getTodayDate(), sessions: [] };
    }
    
    data.sessions.push(text);
    
    // Save it back to the browser's memory
    localStorage.setItem('pomodoroHistory', JSON.stringify(data));
    renderHistory(data.sessions);
}

function loadHistory() {
    const data = JSON.parse(localStorage.getItem('pomodoroHistory'));
    
    // Only load the history if the date stamped on it matches today
    if (data && data.date === getTodayDate()) {
        renderHistory(data.sessions);
    } else {
        renderHistory([]); // Clear the UI list if it's a new day
    }
}

function renderHistory(sessions) {
    historyList.innerHTML = '';
    
    sessions.forEach(sessionText => {
        const li = document.createElement('li');
        li.textContent = sessionText;
        historyList.prepend(li); // .prepend puts the newest sessions at the top of the list
    });
}


// =========================================
// 6. INITIALIZATION & EVENT LISTENERS
// =========================================

// Connect the HTML buttons to our JavaScript functions
primaryBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

// Listen for manual input changes so the timer updates if the user types a new number while idle
focusInput.addEventListener('change', () => { 
    if(!isRunning && isFocusMode) resetTimer(); 
});
breakInput.addEventListener('change', () => { 
    if(!isRunning && !isFocusMode) { 
        timeLeft = breakInput.value * 60; 
        updateDisplay(); 
    } 
});

// Boot up the app when the page loads
loadHistory();
updateDisplay();