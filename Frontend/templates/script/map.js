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

function getRandomLocationNearUser(lat, lng) {
    const maxDistanceInDegrees = 5 / 111;  // Approximate value for 5km in degrees
    return {
        lat: lat + (Math.random() * 2 - 1) * maxDistanceInDegrees,
        lng: lng + (Math.random() * 2 - 1) * maxDistanceInDegrees
    };
}

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            let serviceProviderLocation = getRandomLocationNearUser(userLat, userLng); // Set service provider to a random location near the user
            const customerLocation = { lat: userLat, lng: userLng }; // Set customer to the user's location

            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: serviceProviderLocation,
            });

            const serviceProviderMarker = new google.maps.Marker({
                position: serviceProviderLocation,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red marker for service provider
            });

            const customerMarker = new google.maps.Marker({
                position: customerLocation,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue marker for customer
            });

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            directionsRenderer.setMap(map);
            
            let originalPath = [];
            let pathPolyline = null; 
            let currentIndex = 0;

            function updateRoute() {
                const request = {
                    origin: serviceProviderLocation,
                    destination: customerLocation,
                    travelMode: 'WALKING',
                };
                directionsService.route(request, function(response, status) {
                    if (status === 'OK') {
                        originalPath = response.routes[0].overview_path;
                        if (pathPolyline) {
                            pathPolyline.setMap(null); 
                        }
                        pathPolyline = new google.maps.Polyline({
                            path: originalPath,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        pathPolyline.setMap(map);
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                });
            }

            updateRoute();

            const interval = setInterval(() => {
                if (currentIndex < originalPath.length) {
                    serviceProviderLocation = {
                        lat: originalPath[currentIndex].lat(),
                        lng: originalPath[currentIndex].lng()
                    };
                    serviceProviderMarker.setPosition(serviceProviderLocation);
                    currentIndex++;

                    const newPath = originalPath.slice(currentIndex);
                    pathPolyline.setPath(newPath); 

                    const distanceToCustomer = calculateDistance(serviceProviderLocation.lat, serviceProviderLocation.lng, customerLocation.lat, customerLocation.lng);
                    if (distanceToCustomer < 0.1) {
                        clearInterval(interval);
                        console.log("Service provider has reached the customer!");
                    }
                } else {
                    clearInterval(interval);
                    console.log("Service provider has reached the customer!");
                }
            }, 1000);

        }, function(error) {
            console.error("Error retrieving user location:", error);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

