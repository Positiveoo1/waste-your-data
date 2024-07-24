let isWasting = false;
let wastedData = 0;
let interval;
let totalBytesToWaste;
let wastedBytes = 0;

document.getElementById('startStopButton').addEventListener('click', function () {
    const dataAmount = parseInt(document.getElementById('dataAmount').value);

    if (!isWasting) {
        if (isNaN(dataAmount) || dataAmount <= 0) {
            alert("Please enter a valid amount of data to waste.");
            return;
        }
        this.textContent = 'Stop';
        isWasting = true;
        wastedData = 0;
        wastedBytes = 0;

        totalBytesToWaste = dataAmount * 1024 * 1024; // Convert MB to bytes

        startWastingData();
    } else {
        this.textContent = 'Start';
        isWasting = false;
        clearInterval(interval);
    }
});

function startWastingData() {
    interval = setInterval(() => {
        if (isWasting) {
            fetchLargeVideo();
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function fetchLargeVideo() {
    fetch('https://picsum.photos/1024/1024', { mode: 'cors' })
        .then(response => response.blob())
        .then(blob => {
            wastedBytes += blob.size;
            wastedData = (wastedBytes / (1024 * 1024)).toFixed(2); // Convert bytes to MB
            document.getElementById('wastedData').textContent = `Wasted Data: ${wastedData} MB`;

            if (wastedBytes >= totalBytesToWaste) {
                clearInterval(interval);
                document.getElementById('startStopButton').textContent = 'Start';
                isWasting = false;
                showCongratsModule(wastedData);
            }
        })
        .catch(error => console.error('Error fetching the file:', error));
}

function showCongratsModule(dataAmount) {
    const congratsModule = document.getElementById('congratsModule');
    const congratsMessage = document.getElementById('congratsMessage');
    congratsMessage.textContent = `You have wasted ${dataAmount} MB of data.`;
    congratsModule.classList.remove('hidden');
}

document.getElementById('modeToggleButton').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// Set initial mode based on user's system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.add('light-mode');
}
