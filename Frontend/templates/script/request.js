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
    const nextButton = document.querySelector(".next-button");
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
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const radioButtons = document.querySelectorAll('input[name="timing"]');
    const submitButton = document.getElementById('submitButton');

    function updateSubmitButton() {
      // Use the Array.from method instead of spreading (...) the NodeList
      const isAnyRadioButtonChecked = Array.from(radioButtons).some(rb => rb.checked);
      submitButton.disabled = !isAnyRadioButtonChecked;
    }

    radioButtons.forEach(radioButton => {
      radioButton.addEventListener('change', updateSubmitButton);
    });

    // Initial state
    updateSubmitButton();
  });
</script>

  
