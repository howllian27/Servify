document.addEventListener("DOMContentLoaded", function () {
    let serviceProviderData = JSON.parse(localStorage.getItem('serviceProviderData')); // Retrieve the data from localStorage
    console.log(serviceProviderData); // This should log the array of JSON objects if the first script has run and stored the data
});
