(function () {

    // Initialize the page
    window.onload = init;

    // Define variables for elements and map
    var startButton;
    var map;
    var startLocation = {
        latitude: 0,
        longitude: 0,
    };
    var currentLocation = {
        latitude: 0,
        longitude: 0,
    };
    var updateCounter = 0;
    var flightPath;
    var birdMarker;
    var previousLocation = null; // Store the previous location

    // Register the event handlers
    function init() {
        startButton = document.getElementById("startButton");
        startButton.onclick = startTrackingLocation;
    }

    function startTrackingLocation() {
        // Disable the "Start" button after clicking
        startButton.disabled = true;

        // Get the initial location using Geolocation API
        navigator.geolocation.getCurrentPosition(function (position) {
            startLocation.latitude = position.coords.latitude;
            startLocation.longitude = position.coords.longitude;

            // Initialize the map
            initMap();

            // Display the initial location on the map and in the HTML
            updateMapMarker(startLocation);
            updateLocationDetails(startLocation);

            // Update the location at regular intervals
            setInterval(updateMyLocation, 5000);
        });
    }

    function initMap() {
        // Create a new Google Map centered at the initial location
        map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: startLocation.latitude,
                lng: startLocation.longitude,
            },
            zoom: 8,
        });

        // Create an empty flight path
        flightPath = new google.maps.Polyline({
            path: [],
            geodesic: true,
            strokeColor: "#0000FF", // Blue color for lines
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        // Set the flight path on the map
        flightPath.setMap(map);

        const path = flightPath.getPath();
        path.push(new google.maps.LatLng(startLocation.latitude, startLocation.longitude));

        startLocationMarker = new google.maps.Marker({
            position: {
                lat: startLocation.latitude,
                lng: startLocation.longitude,
            },
            map: map,
            title: 'Start Location',
        });        

        // Create a marker for the bird's current location
        birdMarker = new google.maps.Marker({
            position: {
                lat: startLocation.latitude,
                lng: startLocation.longitude,
            },
            map: map,
            title: 'Bird Location',
        });
    }

    function updateMyLocation() {
        // Simulate changes in latitude and longitude for northwest direction
        const latChange = (Math.random() / 100); 
        const lngChange = (Math.random() / 100); 

        // Calculate the new current location based on the previous location
        currentLocation.latitude = previousLocation ? previousLocation.latitude + latChange : startLocation.latitude + latChange;
        currentLocation.longitude = previousLocation ? previousLocation.longitude - lngChange : startLocation.longitude - lngChange; // Negative value for west

        // Ensure the bird stays within boundaries (e.g., over the United States)
        if (currentLocation.latitude > 49.3457868) {
            currentLocation.latitude = 49.3457868;
        }
        if (currentLocation.longitude < -125.0000000) {
            currentLocation.longitude = -125.0000000;
        }

        // Store the current location as the previous location for the next iteration
        previousLocation = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
        };

        // Display the updated location on the map and in the HTML
        updateMapMarker(currentLocation);
        updateLocationDetails(currentLocation);

        // Add the new location to the flight path
        const path = flightPath.getPath();
        path.push(new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude));

        // Increment the update counter
        updateCounter++;
        document.getElementById("counter").textContent = "Update#: " + updateCounter;
    }

    function updateMapMarker(location) {
        // Update marker for the current location
        birdMarker.setPosition({
            lat: location.latitude,
            lng: location.longitude,
        });

        // Center the map on the new location
        map.setCenter({
            lat: location.latitude,
            lng: location.longitude,
        });
    }

    function updateLocationDetails(location) {
        // Update location details in HTML
        document.getElementById("latitude").textContent = "Start Latitude: " + startLocation.latitude.toFixed(6);
        document.getElementById("longitude").textContent = "Start Longitude: " + startLocation.longitude.toFixed(6);
        document.getElementById("currentLatitude").textContent = "Current Latitude: " + location.latitude.toFixed(6);
        document.getElementById("currentLongitude").textContent = "Current Longitude: " + location.longitude.toFixed(6);
    }


})();
