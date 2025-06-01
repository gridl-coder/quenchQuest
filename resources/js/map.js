$(document).ready(function () {
    // Initialize Bootstrap tooltips

    // Fetch locations via API
    $.getJSON("/api/locations", function (locations) {
        if (!locations['locations'].length) return
        var lastIdx = locations['locations'].length - 1;
        console.log("Locations loaded:", locations['locations'][lastIdx]);

        var current = locations['locations'][lastIdx];


        $("#location-name").text(current.name);
        $("#location-desc").text(current.description);
        $("#location-date").text("Posted on " + new Date(current.created_at).toLocaleDateString());

        // Initialize Leaflet map
        var map = L.map("map").setView([50.471, -4.721], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Pin all locations
        locations['locations'].forEach(function (loc) {
            var marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
            marker.bindPopup("<strong>".concat(loc.name, "</strong><br>").concat(loc.description));
        });

        // Check-in logic
        $("#check-in").on("click", function () {
            if (!navigator.geolocation) {
                alert("Geolocation not supported by your browser.");
                return;
            }
            navigator.geolocation.getCurrentPosition(function (pos) {
                var userLat = pos.coords.latitude;
                var userLng = pos.coords.longitude;
                var toRad = function toRad(deg) {
                    return deg * (Math.PI / 180);
                };
                var distance = function distance(lat1, lon1, lat2, lon2) {
                    var R = 6371e3; // meters
                    var φ1 = toRad(lat1),
                        φ2 = toRad(lat2);
                    var Δφ = toRad(lat2 - lat1);
                    var Δλ = toRad(lon2 - lon1);
                    var a = Math.pow(Math.sin(Δφ / 2), 2) + Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                };

                // Compute distance to current location
                var dist = distance(userLat, userLng, current.latitude, current.longitude);
                if (dist <= 50) {
                    var name = prompt("You're within 50 meters! Enter your name to claim the prize:");
                    if (!name) return alert("Name is required to check in.");

                    // Prompt for email
                    var email = prompt("Enter your email address:");
                    if (!email) return alert("Email is required to check in.");
                    // Simple email validation
                    var emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                    if (!emailPattern.test(email)) return alert("Please enter a valid email address.");

                    // Optionally prompt for social tag
                    var socialTag = prompt("Enter your social tag (optional):");

                    // Device ID logic (same as in Blade)
                    function generateUUID() {
                        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                        );
                    }
                    function getOrSetDeviceId() {
                        var cookieName = 'device_id';
                        var match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
                        if (match) {
                            return match[2];
                        } else {
                            var uuid = generateUUID();
                            document.cookie = cookieName + '=' + uuid + '; path=/; max-age=31536000'; // 1 year
                            return uuid;
                        }
                    }
                    var deviceId = getOrSetDeviceId();

                    $.post("/api/checkin", {
                        location_id: current.id,
                        name: name,
                        email: email,
                        social_tag: socialTag,
                        device_id: deviceId
                    }, function (res) {
                        alert(res.message);
                        location.reload();
                    }, "json").fail(function (xhr) {
                        var msg = "Check-in failed.";
                        if (xhr.responseJSON && xhr.responseJSON.message) {
                            msg = xhr.responseJSON.message;
                        }
                        alert(msg);
                    });
                } else {
                    alert("You're too far from the location (".concat(Math.round(dist), "m away)."));
                }
            }, function () {
                alert("Could not get your location.");
            });
        });
    });
});
