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
