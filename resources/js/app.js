    // Quench Quest App Main JS
// Handles device ID, check-in modal, map, and location logic
// DRY, readable, and fully commented

// --- Device ID logic (used for check-in uniqueness) ---
function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
function getOrSetDeviceId() {
    const cookieName = 'device_id';
    const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        const uuid = generateUUID();
        document.cookie = cookieName + '=' + uuid + '; path=/; max-age=31536000'; // 1 year
        return uuid;
    }
}

// --- DOMContentLoaded: main app logic ---
document.addEventListener('DOMContentLoaded', function() {
    // --- Check-in Modal Logic ---
    const checkInBtn = document.getElementById('check-in');
    const checkinModalEl = document.getElementById('checkinModal');
    const checkinForm = document.getElementById('checkin-form');
    const checkinError = document.getElementById('checkin-error');
    const deviceId = getOrSetDeviceId();

    // Bootstrap modal instance
    let checkinModal = null;
    if (checkinModalEl && typeof bootstrap !== 'undefined') {
        checkinModal = new bootstrap.Modal(checkinModalEl);
    }

    if (checkInBtn && checkinModal) {
        checkInBtn.addEventListener('click', function() {
            checkinError.classList.add('d-none');
            checkinForm.reset();
            checkinModal.show();
        });
    }

    if (checkinForm) {
        checkinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            checkinError.classList.add('d-none');
            const submitBtn = document.getElementById('checkin-submit-btn');
            const submitText = document.getElementById('checkin-submit-text');
            const submitSpinner = document.getElementById('checkin-submit-spinner');
            if (submitBtn && submitText && submitSpinner) {
                submitBtn.disabled = true;
                submitText.style.display = 'none';
                submitSpinner.classList.remove('d-none');
            }
            const formData = new FormData(checkinForm);
            formData.append('device_id', deviceId);

            fetch('/api/checkin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData
            })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Check-in failed.');
                }
                return data;
            })
            .then(data => {
                checkinModal.hide();
                Toastify({
                    text: data.message || 'Check-in successful!',
                    duration: 4000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: '#28a745',
                    stopOnFocus: true
                }).showToast();
                setTimeout(() => window.location.reload(), 1500);
            })
            .catch(err => {
                checkinError.textContent = err.message;
                checkinError.classList.remove('d-none');
                Toastify({
                    text: err.message || 'Check-in failed.',
                    duration: 4000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: '#ff3b3f',
                    stopOnFocus: true
                }).showToast();
            })
            .finally(() => {
                if (submitBtn && submitText && submitSpinner) {
                    submitBtn.disabled = false;
                    submitText.style.display = '';
                    submitSpinner.classList.add('d-none');
                }
            });
        });
    }

    // --- Map & Location Logic ---
    const mapContainer = document.getElementById('map');
    const mapLoadingSpinner = document.getElementById('map-loading-spinner');
    if (mapContainer) {
        if (mapLoadingSpinner) mapLoadingSpinner.style.display = '';
        fetch('/api/locations')
            .then(res => res.json())
            .then(locations => {
                if (!locations['locations'] || !locations['locations'].length) {
                    if (mapLoadingSpinner) mapLoadingSpinner.style.display = 'none';
                    return;
                }
                const lastIdx = locations['locations'].length - 1;
                const current = locations['locations'][lastIdx];

                // Update location info in DOM
                const locName = document.getElementById('location-name');
                const locDesc = document.getElementById('location-desc');
                const locDate = document.getElementById('location-date');
                if (locName) locName.textContent = current.name;
                if (locDesc) locDesc.textContent = current.description;
                if (locDate) locDate.textContent = 'Posted on ' + new Date(current.created_at).toLocaleDateString();

                // Initialize Leaflet map
                if (mapLoadingSpinner) mapLoadingSpinner.style.display = 'none';
                const map = L.map('map').setView([50.471, -4.721], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                // Pin all locations
                locations['locations'].forEach(loc => {
                    const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
                    marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.description}`);
                });

                // Geolocation-based check-in (if modal not used)
                if (checkInBtn && !checkinModal) {
                    checkInBtn.addEventListener('click', function() {
                        if (!navigator.geolocation) {
                            Toastify({
                                text: 'Geolocation not supported by your browser.',
                                duration: 4000,
                                gravity: 'top',
                                position: 'center',
                                backgroundColor: '#ff3b3f',
                                stopOnFocus: true
                            }).showToast();
                            return;
                        }
                        navigator.geolocation.getCurrentPosition(function(pos) {
                            const userLat = pos.coords.latitude;
                            const userLng = pos.coords.longitude;
                            // Haversine formula
                            function toRad(deg) { return deg * (Math.PI / 180); }
                            function distance(lat1, lon1, lat2, lon2) {
                                const R = 6371e3;
                                const φ1 = toRad(lat1), φ2 = toRad(lat2);
                                const Δφ = toRad(lat2 - lat1);
                                const Δλ = toRad(lon2 - lon1);
                                const a = Math.pow(Math.sin(Δφ / 2), 2) + Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2);
                                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                return R * c;
                            }
                            const dist = distance(userLat, userLng, current.latitude, current.longitude);
                            if (dist <= 50) {
                                const name = prompt("You're within 50 meters! Enter your name to claim the prize:");
                                if (!name) return alert('Name is required to check in.');
                                const email = prompt('Enter your email address:');
                                if (!email) return alert('Email is required to check in.');
                                const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
                                if (!emailPattern.test(email)) return alert('Please enter a valid email address.');
                                const socialTag = prompt('Enter your social tag (optional):');
                                const deviceId = getOrSetDeviceId();
                                fetch('/api/checkin', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                    body: JSON.stringify({
                                        location_id: current.id,
                                        name,
                                        email,
                                        social_tag: socialTag,
                                        device_id: deviceId
                                    })
                                })
                                .then(async response => {
                                    const data = await response.json();
                                    if (!response.ok) throw new Error(data.message || 'Check-in failed.');
                                    return data;
                                })
                                .then(data => {
                                    Toastify({
                                        text: data.message,
                                        duration: 4000,
                                        gravity: 'top',
                                        position: 'center',
                                        backgroundColor: '#28a745',
                                        stopOnFocus: true
                                    }).showToast();
                                    setTimeout(() => window.location.reload(), 1500);
                                })
                                .catch(err => {
                                    Toastify({
                                        text: err.message || 'Check-in failed.',
                                        duration: 4000,
                                        gravity: 'top',
                                        position: 'center',
                                        backgroundColor: '#ff3b3f',
                                        stopOnFocus: true
                                    }).showToast();
                                });
                            } else {
                                Toastify({
                                    text: `You're too far from the location (${Math.round(dist)}m away).`,
                                    duration: 4000,
                                    gravity: 'top',
                                    position: 'center',
                                    backgroundColor: '#ff3b3f',
                                    stopOnFocus: true
                                }).showToast();
                            }
                        }, function() {
                            Toastify({
                                text: 'Could not get your location.',
                                duration: 4000,
                                gravity: 'top',
                                position: 'center',
                                backgroundColor: '#ff3b3f',
                                stopOnFocus: true
                            }).showToast();
                        });
                    });
                }
            });
    }
});
