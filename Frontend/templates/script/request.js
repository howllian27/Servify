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
    let timingLabels = document.querySelectorAll('label > input[name="timing"]');
    
    let currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour <= 21) {
        let timeSlots = [
            ` ${currentHour}:00 to ${currentHour + 3}:00`,
            ` ${currentHour + 3}:00 to ${currentHour + 6}:00`,
            ` ${currentHour + 6}:00 to ${currentHour + 9}:00`,
        ];

        timingLabels.forEach((radioButton, index) => {
            let span = document.createElement('span');
            span.textContent = timeSlots[index];
            radioButton.insertAdjacentElement('afterend', span);
        });
    }
});

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
    const userLat = 1.3569175;
    const userLng = 103.9772318;
    const maxDistanceInDegrees = 10/111;  // Approximate value for 10km in degrees

    return {
        lat: userLat + (Math.random() * 2 - 1) * maxDistanceInDegrees,
        lng: userLng + (Math.random() * 2 - 1) * maxDistanceInDegrees
    };
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


// Send JSON Data and filter service providers based on location
document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Retrieve the data from localStorage
        let serviceProviderData = JSON.parse(localStorage.getItem('serviceProviderData'));

        // Assign random locations to each service provider
        serviceProviderData.forEach(provider => {
            const location = getRandomLocationNearUser();
            provider.lat = location.lat;
            provider.lng = location.lng;
            console.log(`Service Provider: ${provider.name}, Location: (${provider.lat.toFixed(2)}, ${provider.lng.toFixed(2)})`);
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
            nearbyProviders.forEach(provider => {
                // Extract the uploaded image source
                const imageElement = document.getElementById("imagePreview").querySelector("img");
                const uploadedImageSrc = imageElement ? imageElement.src : null;

                // Extract the selected time
                const selectedTimingElement = document.querySelector('input[name="timing"]:checked');
                const selectedTime = selectedTimingElement ? selectedTimingElement.value : null;

                provider.time = selectedTime;
                provider.picture = uploadedImageSrc;

                emailjs.send("service_ar6wyrk", "template_kj1pifv", {
                    serviceProviderName: provider.name,
                    recipient_email: "chanwick27@gmail.com",
                    userName: "Howell",  // Replace with the actual user's name
                    serviceType: provider.service_requested,  // Replace with the actual service type
                    selectedTime: selectedTime,
                    uploadedImageSrc: uploadedImageSrc
                }).then(function(response) {
                    console.log('Email sent successfully!', response.status, response.text);
                }, function(error) {
                    console.log('Failed to send the email.', error);
                });
            });

            // Store updated data back in localStorage
            localStorage.setItem('nearbyServiceProviderData', JSON.stringify(nearbyProviders));
            localStorage.removeItem('serviceProviderData');
            console.log("Updated Data:", serviceProviderData);

            // Show loading popup
            const loadingPopup = document.getElementById("loading-popup");
            loadingPopup.style.display = "flex";

            // Simulate loading time and then redirect
            setTimeout(function() {
                loadingPopup.style.display = "none";
                window.location.href = "./map.html";
            }, 5000);
        });
    });
});
