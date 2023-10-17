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
            let serviceProviderLocation = { lat: userLat, lng: userLng };
            const customerLocation = getRandomLocationNearUser(userLat, userLng);

            // ... [Rest of your code with no changes]
            const singapore = { lat: userLat, lng: userLng };
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: singapore,
            });

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

            // function updateRoute() {
            //     const request = {
            //         origin: serviceProviderLocation,
            //         destination: customerLocation,
            //         travelMode: 'DRIVING',
            //     };
            //     directionsService.route(request, function(response, status) {
            //         if (status === 'OK') {
            //             directionsRenderer.setDirections(response);
            //         } else {
            //             console.error('Directions request failed due to ' + status);
            //         }
            //     });
            // }

            // updateRoute();

            // const interval = setInterval(() => {
            //     serviceProviderLocation.lat += (customerLocation.lat - serviceProviderLocation.lat) * 0.01;
            //     serviceProviderLocation.lng += (customerLocation.lng - serviceProviderLocation.lng) * 0.01;
            //     serviceProviderMarker.setPosition(serviceProviderLocation);
            //     updateRoute();

            //     const distanceToCustomer = calculateDistance(serviceProviderLocation.lat, serviceProviderLocation.lng, customerLocation.lat, customerLocation.lng);
            //     if (distanceToCustomer < 0.1) {
            //         clearInterval(interval);
            //         console.log("Service provider has reached the customer!");
            //     }
            // }, 1000);
            let pathPoints = []; // Array to store the overview_path points
            let currentIndex = 0; // Index to keep track of the current point in the pathPoints array

            function updateRoute() {
                const request = {
                    origin: serviceProviderLocation,
                    destination: customerLocation,
                    travelMode: 'WALKING', // Changed to WALKING for more accuracy
                };
                directionsService.route(request, function(response, status) {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(response);
                        pathPoints = response.routes[0].overview_path; // Store the overview_path points in the pathPoints array
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                });
            }

            updateRoute();

            const interval = setInterval(() => {
                if (currentIndex < pathPoints.length) {
                    serviceProviderLocation = {
                        lat: pathPoints[currentIndex].lat(),
                        lng: pathPoints[currentIndex].lng()
                    };
                    serviceProviderMarker.setPosition(serviceProviderLocation);
                    currentIndex++;

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