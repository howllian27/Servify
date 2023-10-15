function loadScript() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAUC_Uiorh11l8AXMjAoHnT4Qdu-f7sdBE&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}


window.onload = loadScript;

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    const distance = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R;
    return distance; // Returns distance in kilometers
}

function initMap() {
    const singapore = { lat: 1.3521, lng: 103.8198 };
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: singapore,
    });

    let serviceProviderLocation = { lat: 1.3521, lng: 103.8198 };
    const customerLocation = { lat: 1.385782, lng: 103.8800055 };

    const serviceProviderMarker = new google.maps.Marker({
        position: serviceProviderLocation,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    const customerMarker = new google.maps.Marker({
        position: customerLocation,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    directionsRenderer.setMap(map);

    function updateRoute() {
        const request = {
            origin: serviceProviderLocation,
            destination: customerLocation,
            travelMode: 'DRIVING',
        };
        directionsService.route(request, function(response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                console.error('Directions request failed due to ' + status);
            }
        });
    }

    updateRoute();

    const interval = setInterval(() => {
        serviceProviderLocation.lat += (customerLocation.lat - serviceProviderLocation.lat) * 0.01;
        serviceProviderLocation.lng += (customerLocation.lng - serviceProviderLocation.lng) * 0.01;
        serviceProviderMarker.setPosition(serviceProviderLocation);
        updateRoute();

        const distanceToCustomer = calculateDistance(serviceProviderLocation.lat, serviceProviderLocation.lng, customerLocation.lat, customerLocation.lng);
        if (distanceToCustomer < 0.1) {
            clearInterval(interval);
            console.log("Service provider has reached the customer!");
        }
    }, 1000);
}