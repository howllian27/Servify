function loadScript() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAUC_Uiorh11l8AXMjAoHnT4Qdu-f7sdBE&callback=initMap';
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

    // Define initial points for the service provider and the customer
    let serviceProviderLocation = { lat: 1.3521, lng: 103.8198 }; // Update with actual coordinates
    const customerLocation = { lat: 1.385782, lng: 103.8800055 }; // Update with actual coordinates

    const serviceProviderMarker = new google.maps.Marker({
        position: serviceProviderLocation,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue marker for service provider
    });

    const customerMarker = new google.maps.Marker({
        position: customerLocation,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red marker for customer
    });

    // Create a directions service and a directions renderer
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    // Set the directions renderer to use the map
    directionsRenderer.setMap(map);

    function updateRoute() {
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

    updateRoute(); // Initial route

    // Simulate real-time updates for the service provider's location
    setInterval(function() {
        // Fetch the updated location of the service provider (this is a mock, replace with actual data fetching)
        serviceProviderLocation = {
            lat: serviceProviderLocation.lat + (Math.random() - 0.5) * 0.01,
            lng: serviceProviderLocation.lng + (Math.random() - 0.5) * 0.01
        };

        // Update the marker's position on the map
        serviceProviderMarker.setPosition(serviceProviderLocation);

        // Update the route on the map
        updateRoute();
    }, 5000); // Update every 5 seconds
}
