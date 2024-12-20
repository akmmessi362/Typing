let attempts = 0;
const maxAttempts = 3;
let timerInterval;
let timeLeft = 0; // Time in seconds
let isRunning = false;
let timeLimit = 3 * 60; // Default time limit in seconds (3 minutes)
let typingStarted = false;
let textToType = ''; // Will store the text to be typed
let typingArea = document.getElementById("typing-area"); // Textarea element for typing
let timeResult = document.getElementById("time-result"); // Element to show time taken
let accuracyResult = document.getElementById("accuracy-result"); // Element to show accuracy
let resultSection = document.getElementById("result-section"); // Element to show result
let progressBar = document.getElementById("progress-bar"); // Progress bar element
let startBtn = document.getElementById("start-btn");
let stopBtn = document.getElementById("stop-btn");
let resetBtn = document.getElementById("reset-btn");
let restartBtn = document.getElementById("restart-section");
let submitBtn = document.getElementById("submit-btn");
let readingArea = document.getElementById("reading-area");
let clock = document.getElementById("clock");
let resultDetails = document.getElementById("result-details");
let documentLimit = document.getElementById("time-limit");

// Function to fetch text for the test
function fetchTextForTest() {
    fetch('api/text/a.txt')  // Update the file path if necessary
        .then(response => response.text())  // Get the response as text
        .then(data => {
            const cleanedData = data.replace(/\s+/g, ' ').trim(); // Clean up text
            const words = cleanedData.split(' ').filter(word => word !== ''); // Remove empty strings

            if (words.length > 0) {
                const randomStartIndex = Math.floor(Math.random() * (words.length - 200));  // Random start
                textToType = words.slice(randomStartIndex, randomStartIndex + 200).join(' ');

                if (words.length > 200) textToType += '...'; // Add ellipsis if too long
                readingArea.innerText = textToType;
            } else {
                readingArea.innerText = 'No valid words available.';
            }
        })
        .catch(error => {
            console.error('Error fetching text file:', error);
            readingArea.innerText = 'Failed to load text.';
        });
}

fetchTextForTest();

// Disable submit button until text is typed
submitBtn.disabled = true;

typingArea.addEventListener('input', function () {
    // Check if the timer has not started yet and typingArea is not empty
    if (!typingStarted && typingArea.value.length > 0) {
        startTimer(); // Start the timer
        typingStarted = true; // Set the flag to true to prevent re-starting the timer
        submitBtn.disabled = false; // Enable the submit button once typing starts
    }
});

// Block paste event to ensure manual typing
typingArea.addEventListener('paste', function(event) {
    event.preventDefault();
    alert("Copy-paste is disabled. Please type the text manually.");
});

// Block the right-click context menu
typingArea.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    alert("Right-click is disabled to prevent copy-pasting.");
});

// Block keyboard paste shortcuts
typingArea.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        alert("Copy-paste is disabled. Please type the text manually.");
    }
});

// Set time limit based on dropdown selection
function setTimeLimit() {
    const selectedTime = documentLimit.value;
    timeLimit = selectedTime * 60; // Convert to seconds
    resetTimer(); // Reset the timer to apply the new time limit
}

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(number) {
    return number < 10 ? '0' + number : number;
}

// Start the timer
function startTimer() {
    if (isRunning) return; // Prevent starting multiple times
    isRunning = true;
    setTimeLimit();
    // Start the timer interval
    timerInterval = setInterval(function () {
        timeLeft++;
        clock.innerText = formatTime(timeLeft); // Update clock

        // Update progress bar
        let progress = (timeLeft / timeLimit) * 100;
        progressBar.style.width = `${progress}%`;

        // If time is up, stop timer and submit the test
        if (timeLeft >= timeLimit) {
            stopTimer();
            submitTest(); // Auto-submit when time is up
        }
    }, 1000);

    // Disable the start button and enable stop and reset buttons
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
}

// Restart the test
function restartTest() {
    resultSection.style.display = "none"; // Hide result section
    restartBtn.style.display = 'none';
    startBtn.style.display = 'inline-block'; // Show start button
    stopBtn.style.display = 'inline-block';  // Show stop button
    resetBtn.style.display = 'inline-block'; // Show reset button
    submitBtn.style.display = 'inline-block'; // Show submit button
    typingArea.style.display = 'inline-block';

    typingArea.value = ''; // Clear typing area
    progressBar.style.width = "0%"; // Reset progress bar
    typingStarted = false;
    timeLeft = 0;
    clock.innerText = formatTime(timeLeft); // Reset clock
    resetTimer();
    fetchTextForTest(); // Get new text
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);  // Clear any running timer
    isRunning = false;
    timeLeft = 0;
    progressBar.style.width = "0%";
    clock.innerText = formatTime(timeLeft);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
}

function checkTyping() {
    const typedText = typingArea.innerText.trim();  // Using innerText for contenteditable div
    const referenceWords = textToType.split(/\s+/); // Splitting reference text into words
    const typedWords = typedText.split(/\s+/); // Splitting typed text into words

    if (!typingStarted && typedText.length > 0) {
        startTimer(); // Start the timer when typing starts
        typingStarted = true;
    }

}


// Submit the test and display results
function submitTest() {

    stopTimer(); // Stop the timer when submitting the test

    resultSection.style.display = "block"; // Show result section
    resultSection.classList.add('fade-in');

    startBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    submitBtn.style.display = 'none';
    typingArea.style.display = 'none';
    restartBtn.style.display = 'block'; // Show restart button

    const timeTaken = timeLeft;
    const minutesTaken = Math.floor(timeTaken / 60);
    const secondsTaken = timeTaken % 60;
    const formattedTime = formatTime(timeTaken);

    const typedText = typingArea.value.trim();
    const totalWords = textToType.trim().split(/\s+/).length;
    const typedWords = typedText.split(/\s+/).length;

    let correctWords = 0;
    const typedWordsArray = typedText.split(/\s+/);
    const textWordsArray = textToType.trim().split(/\s+/);

    typedWordsArray.forEach((word, index) => {
        if (word === textWordsArray[index]) {
            correctWords++;
        }
    });

    const incorrectWords = typedWords - correctWords;
    let adjustedWords = correctWords;
    let penaltyExplanation = "";

    if (incorrectWords > 5) {
        const additionalErrors = incorrectWords - 5;
        const penaltyWords = additionalErrors * 5;
        adjustedWords -= penaltyWords;
        penaltyExplanation = `${additionalErrors} additional error(s) × 5 words penalty = ${penaltyWords} words deducted`;
        adjustedWords = Math.max(adjustedWords, 0);
    }

    const originalTypingSpeed = typedWords > 0 ? (typedWords / (timeTaken / 60)).toFixed(2) : 0;
    const adjustedTypingSpeed = adjustedWords > 0 ? (adjustedWords / (timeTaken / 60)).toFixed(2) : 0;
    const accuracy = (typedWords > 0) ? (correctWords / typedWords) * 100 : 0;

    const resultContent = `
        <div class="result-item"><strong>Time Taken:</strong> ${formattedTime}</div>
        <div class="result-item"><strong>Accuracy:</strong> ${accuracy.toFixed(2)}%</div>
        <div class="result-item"><strong>Original Typing Speed:</strong> ${originalTypingSpeed} WPM</div>
        <div class="result-item"><strong>Correct Words:</strong> ${correctWords}</div>
        <div class="result-item"><strong>Incorrect Words:</strong> ${incorrectWords}</div>
        <div class="result-item"><strong>Total Words Typed:</strong> ${typedWords}</div>
        <div class="result-item"><strong>Penalties Applied:</strong> ${penaltyExplanation || "No penalties applied"}</div>
        <div class="result-item"><strong>Correct Words After Penalty:</strong> ${adjustedWords}</div>
        <div class="result-item"><strong>Adjusted Typing Speed:</strong> ${adjustedTypingSpeed} WPM</div>
    `;

    resultDetails.innerHTML = resultContent;
    progressBar.style.width = "0%"; // Reset progress bar
}

// Attach the event listeners to buttons
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
restartBtn.addEventListener('click', restartTest);
documentLimit.addEventListener('change', setTimeLimit);
