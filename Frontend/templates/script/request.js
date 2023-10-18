import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCkp2U4ZVKiWTpQB-KQlCSsYzat3x8Ixmc",
    authDomain: "servify-clicks.firebaseapp.com",
    databaseURL: "https://servify-clicks-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "servify-clicks",
    storageBucket: "servify-clicks.appspot.com",
    messagingSenderId: "520072688967",
    appId: "1:520072688967:web:86991d7762dfc0e05a0862",
    measurementId: "G-GZBVJC33KP"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

emailjs.init("oqcrp_MJgCRFTuFxL");

//Image Upload Functionality
document.getElementById("imageUpload").addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById("imagePreview").innerHTML = `<img src="${event.target.result}" alt="Uploaded Image">`;
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById("uploadButton").addEventListener("click", function() {
    document.getElementById("imageUpload").click();
});

// Retrieve Service Provider Data
document.addEventListener("DOMContentLoaded", function () {
    let serviceProviderData = JSON.parse(localStorage.getItem('serviceProviderData')); // Retrieve the data from localStorage
    console.log(serviceProviderData); // This should log the array of JSON objects if the first script has run and stored the data
});

// Function to check if any time slot button is selected
function checkTimeSlots() {
    const timingButtons = document.querySelectorAll('.timing-button');
    return Array.from(timingButtons).some((button) => button.classList.contains('selected-timing'));
}


// Time Slot Selection Functionality
document.addEventListener("DOMContentLoaded", function () {
    let timingButtons = document.querySelectorAll(".timing-button");
    timingButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the link action
        timingButtons.forEach((btn) => btn.classList.remove("selected-timing"));
        this.classList.add("selected-timing");
    });
    });
});

// Auto Time Slot Calculator
document.addEventListener("DOMContentLoaded", function () {
    let timingSpans = document.querySelectorAll('.time-slot');
    
    let currentHour = new Date().getHours();

    let timeSlots = [
        formatTimeSlot(currentHour, currentHour + 3),
        formatTimeSlot(currentHour + 3, currentHour + 6),
        formatTimeSlot(currentHour + 6, currentHour + 9),
    ];

    timingSpans.forEach((span, index) => {
        span.textContent = timeSlots[index];
    });
});


function formatTimeSlot(startHour, endHour) {
    startHour = startHour % 24; // Ensure the hour is between 0 and 23
    endHour = endHour % 24;     // Ensure the hour is between 0 and 23

    // Format hours to always have two digits
    const formattedStartHour = startHour.toString().padStart(2, '0');
        const formattedEndHour = endHour.toString().padStart(2, '0');

    return `${formattedStartHour}:00 to ${formattedEndHour}:00`;
}

// Submit button
document.addEventListener('DOMContentLoaded', function () {
    const timingButtons = document.querySelectorAll('input[name="timing"]');
    const submitButton = document.getElementById('submitButton');

    function updateSubmitButton() {
        const isAnyButtonSelected = Array.from(timingButtons).some(button => button.checked);
        if (isAnyButtonSelected) {
            submitButton.removeAttribute('disabled');
        } else {
            submitButton.setAttribute('disabled', 'true');
        }
    }

    timingButtons.forEach(timingButton => {
        timingButton.addEventListener('change', function () {
            updateSubmitButton();
        });
    });

    // Check before proceeding
    submitButton.addEventListener('click', function(event) {
        const isAnyButtonSelected = Array.from(document.querySelectorAll('input[name="timing"]')).some(button => button.checked);
        if (!isAnyButtonSelected) {
            event.preventDefault();
            alert('Please select at least one time slot before proceeding.');
        }
    });

    updateSubmitButton();
});

// Get references to the radio buttons and the submit button
const radioButtons = document.querySelectorAll('input[type="radio"]');
const submitButton = document.getElementById('submitButton');

// Function to check if any radio button is selected
function checkRadioButtons() {
const isAnyRadioButtonSelected = Array.from(radioButtons).some((radio) => radio.checked);
submitButton.disabled = !isAnyRadioButtonSelected;
}

// Add event listeners to the radio buttons
radioButtons.forEach((radioButton) => {
radioButton.addEventListener('change', checkRadioButtons);
});

// Disable the submit button by default
submitButton.disabled = true;

// timer
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to generate a random latitude and longitude
function getRandomLocationNearUser() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const maxDistanceInDegrees = 10/111;  // Approximate value for 10km in degrees

                const randomLocation = {
                    lat: userLat + (Math.random() * 2 - 1) * maxDistanceInDegrees,
                    lng: userLng + (Math.random() * 2 - 1) * maxDistanceInDegrees
                };

                resolve(randomLocation);
            }, function(error) {
                reject(error);
            });
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    // Convert degrees to radians
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;

    const distance = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R;

    return distance; // Returns distance in kilometers
}

// Get customer address 
async function getReadableAddress(lat, lng) {
    const apiKey = 'AIzaSyAUC_Uiorh11l8AXMjAoHnT4Qdu-f7sdBE'; // Replace with your API key
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "OK") {
        return data.results[0].formatted_address; // Return the first result
    } else {
        console.error("Failed to get address:", data.status);
        return null;
    }
}


// Registering acceptance clicks
const responsesRefAccepted = ref(database, 'responses/accepted');
const responsesRefDeclined = ref(database, 'responses/declined');

function hideLoadingScreen() {
    const loadingPopup = document.getElementById("loading-popup");
    if (loadingPopup) {
        loadingPopup.style.display = "none";
        console.log("Loading popup should be hidden now.");
    } else {
        console.error("Couldn't find the loading popup element.");
    }

    // Redirect to map.html
    window.location.href = "./map.html";
}

// Global variable to store the initial count of accepted responses
let initialAcceptedCount = null;

// Function to monitor changes in the accepted responses count
function monitorAcceptedResponses() {
    const responsesRefAccepted = ref(database, 'responses/accepted');
    onValue(responsesRefAccepted, (snapshot) => {
        const currentCount = snapshot.val() || 0;
        if (initialAcceptedCount === null) {
            initialAcceptedCount = currentCount;
        } else if (currentCount > initialAcceptedCount) {
            console.log("The current count is " + currentCount);
            hideLoadingScreen();
        }
    });
}

// Send JSON Data and filter service providers based on location
document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();

        // Show loading popup
        const loadingPopup = document.getElementById("loading-popup");
        if (loadingPopup) {
            loadingPopup.style.display = "flex";
            console.log("Loading popup should be visible now.");
        } else {
            console.error("Couldn't find the loading popup element.");
        }

        const isAnyButtonSelected = Array.from(document.querySelectorAll('input[name="timing"]')).some(button => button.checked);
        if (!isAnyButtonSelected) {
            alert('Please select at least one time slot before proceeding.');
            return;
        }

        // Retrieve the data from localStorage
        let serviceProviderData = JSON.parse(localStorage.getItem('serviceProviderData'));

        // Create an array of promises for each provider
        const locationPromises = serviceProviderData.map(async provider => {
            const location = await getRandomLocationNearUser();
            return {
                ...provider,
                lat: location.lat,
                lng: location.lng
            };
        });

        // Wait for all promises to resolve
        const updatedProviders = await Promise.all(locationPromises);

        // Update the serviceProviderData with the new locations
        serviceProviderData = updatedProviders;

        // Log the updated providers
        serviceProviderData.forEach(provider => {
            console.log(`Service Provider: ${provider.service_provider_name}, Location: (${provider.lat}, ${provider.lng})`);
        });

        // Get user's location
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(`User's Location: (${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)})`);

            // Filter service providers based on proximity
            const MAX_DISTANCE = 10; // Maximum distance in kilometers
            const nearbyProviders = serviceProviderData.filter(provider => {
                const distance = calculateDistance(userLocation.lat, userLocation.lng, provider.lat, provider.lng);
                console.log(`Service provider ${provider.name} is ${distance} away`)
                return distance <= MAX_DISTANCE;
            });

            console.log("Nearby Providers:", nearbyProviders);

            // Send emails to nearby service providers
            nearbyProviders.forEach(async provider => {
                // Extract the uploaded image source
                const imageElement = document.getElementById("imagePreview").querySelector("img");
                const uploadedImageSrc = imageElement ? imageElement.src : null;

                // Extract the selected time
                const selectedTimingElement = document.querySelector('input[name="timing"]:checked');
                const selectedTime = selectedTimingElement ? selectedTimingElement.nextElementSibling.textContent : null; // Extracting the time from the adjacent <span> element


                provider.time = selectedTime;
                provider.picture = uploadedImageSrc;

                const readableAddress = await getReadableAddress(userLocation.lat, userLocation.lng);

                emailjs.send("service_ar6wyrk", "template_kj1pifv", {
                    serviceProviderName: provider.service_provider_name,
                    serviceType: provider.service_requested,
                    selectedTime: selectedTime,
                    userLocation: readableAddress,
                    linkToDetailsPage: "https://yourwebsite.com/detailsPage" // Replace with the actual link to your details page
                }).then(function(response) {
                    console.log('Email sent successfully!', response.status, response.text);
                }, function(error) {
                    console.log('Failed to send the email.', error);
                });

                console.log(provider.service_requested, selectedTime, readableAddress);
                localStorage.setItem('serviceRequested', provider.service_requested);
                localStorage.setItem('timing', selectedTime);
                localStorage.setItem('location', readableAddress);
                
            });

            // Store updated data back in localStorage
            localStorage.setItem('nearbyServiceProviderData', JSON.stringify(nearbyProviders));
            localStorage.removeItem('serviceProviderData');
            console.log("Updated Data:", serviceProviderData);


            // Start monitoring accepted responses
            monitorAcceptedResponses();
        });
    });
});
