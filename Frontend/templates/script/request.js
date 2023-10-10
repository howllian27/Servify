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

document.addEventListener("DOMContentLoaded", function () {
    let serviceProviderData = JSON.parse(localStorage.getItem('serviceProviderData')); // Retrieve the data from localStorage
    console.log(serviceProviderData); // This should log the array of JSON objects if the first script has run and stored the data
});


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


//Javascript for the loading button
document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("submitButton");
    const loadingPopup = document.getElementById("loading-popup");

    nextButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the link action
    loadingPopup.style.display = "flex"; // Show the loading popup

    //change this such that only when there is serviceprovider acceptance then move to next page
    setTimeout(function() {
    // Hide the loading popup and navigate to map.html after 2 seconds
    loadingPopup.style.display = "none";
    window.location.href = "./map.html";
    }, 2000);
    });
});

//Auto time slot calculator
document.addEventListener("DOMContentLoaded", function () {
    let timingButtons = document.querySelectorAll(".timing-button");

    // Get current hour
    let currentHour = new Date().getHours();

    // Define your time slots based on the current hour
    let timeSlots = [
        `${currentHour}:00 to ${currentHour + 3}:00`,
        `${currentHour + 3}:00 to ${currentHour + 6}:00`,
        `${currentHour + 6}:00 to ${currentHour + 9}:00`,
    ];

    // Assign the time slots to the buttons
    timingButtons.forEach((button, index) => {
        button.innerHTML = `<b>${timeSlots[index]}</b>`;
    });

    timingButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the link action
        timingButtons.forEach((btn) => btn.classList.remove("selected-timing"));
        this.classList.add("selected-timing");
        });
    });
});

// Submit button
document.addEventListener('DOMContentLoaded', function () {
  const timingButtons = document.querySelectorAll('.timing-button');
  const submitButton = document.getElementById('submitBtn'); // Updated the ID

  function updateSubmitButton() {
    const isAnyButtonSelected = [...timingButtons].some(button => button.classList.contains('selected-timing'));
    submitButton.disabled = !isAnyButtonSelected;
  }

  timingButtons.forEach(timingButton => {
    timingButton.addEventListener('click', function (event) {
      event.preventDefault();
      timingButtons.forEach(button => button.classList.remove('selected-timing'));
      this.classList.add('selected-timing');
      updateSubmitButton();
    });
  });

  // Initial state
  updateSubmitButton();
});
<script>
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
</script>


// Send JSON Data
document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById('submitBtn');

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Get selected service
        const selectedServiceElement = document.querySelector('.selected-service');
        const serviceRequested = selectedServiceElement ? selectedServiceElement.textContent.trim() : "";

        // Get selected time
        const selectedTimingElement = document.querySelector('.selected-timing');
        const selectedTime = selectedTimingElement ? selectedTimingElement.textContent.trim() : "";

        // Get uploaded image
        const imageElement = document.getElementById("imagePreview").querySelector("img");
        const uploadedImage = imageElement ? imageElement.src : "";

        // Get service provider name from local storage
        const serviceProviderName = localStorage.getItem("serviceProviderData");

        // Update the result JSON
        const result = {
            "service_provider_name": serviceProviderName,
            "service_requested": serviceRequested,
            "time": selectedTime,
            "location": "",
            "picture": uploadedImage
        };

        console.log(result); // You can see the updated result in the console

        // TODO: You can now send this result to your server or do whatever you want with it
    });
});
