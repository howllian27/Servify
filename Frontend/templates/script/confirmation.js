document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the details from localStorage
    const name = localStorage.getItem('serviceProviderName'); // Assuming you stored the name with this key
    const serviceRequested = localStorage.getItem('serviceRequested');
    const timing = localStorage.getItem('timing');
    const location = localStorage.getItem('location');

    // Update the HTML elements with the retrieved data
    if (name) {
        document.querySelector(".green-box1 .text-container p:nth-child(2)").textContent = `Name: ${name}`;
    }
    if (serviceRequested) {
        document.querySelector(".green-box2 .text-container p:nth-child(2)").textContent = `Service Requested: ${serviceRequested} `;
    }
    if (timing) {
        document.querySelector(".green-box2 .text-container p:nth-child(3)").textContent = `Time: ${timing}`;
    }
    if (location) {
        document.querySelector(".green-box2 .text-container p:nth-child(4)").textContent = `Location: ${location} `;
    }
});

// Function to start the countdown timer
function startCountdown() {
    let countdown = 20; // Start countdown from 20 seconds

    // Display the countdown modal
    $('#countdownModal').modal('show');

    // Update the countdown every second
    const interval = setInterval(function() {
        countdown--;

        // Update the countdown value in the modal
        document.getElementById('countdown').innerText = countdown;

        // If countdown reaches 0, redirect to index.html and clear the interval
        if (countdown <= 0) {
            clearInterval(interval);
            window.location.href = "./index.html";
        }
    }, 1000);
}

// Start the countdown timer when the page loads
window.onload = startCountdown;
