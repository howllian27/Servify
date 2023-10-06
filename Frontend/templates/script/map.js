function loadScript() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAnSoZr9Bm97EohSU7s3jhtaK2_hdYdX_o&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

window.onload = loadScript;

function initMap() {
    const singapore = { lat: 1.3521, lng: 103.8198 };
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: singapore,
    });
    const marker = new google.maps.Marker({
        position: singapore,
        map: map,
    });

    // Define points for the service provider and the customer
    const serviceProviderLocation = { lat: 1.3521, lng: 103.8198 }; // Update with actual coordinates
    const customerLocation = { lat: 1.385782, lng: 103.8800055 }; // Update with actual coordinates

    // Create a directions service and a directions renderer
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    // Set the directions renderer to use the map
    directionsRenderer.setMap(map);

    // Create a request object with the origin, destination, and travel mode
    const request = {
        origin: serviceProviderLocation,
        destination: customerLocation,
        travelMode: 'DRIVING', // Change the travel mode as necessary
    };

    // Get the route from the directions service and display it on the map using the directions renderer
    directionsService.route(request, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
}
