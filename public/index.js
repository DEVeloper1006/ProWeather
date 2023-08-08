const city = document.getElementById('city');
    const cityName = document.getElementById('cityName');
    const getCurrentLocation = document.getElementById('location');

    getCurrentLocation.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
                        const state = data.address.state || data.address.province;
                        const country = data.address.country;
                        cityName.textContent = `${city}, ${state}, ${country}`;
                    })
                    .catch(error => {
                        console.error('Error fetching city:', error);
                        cityName.textContent = 'Error fetching city';
                    });
            }, (error) => {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        alert("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        alert("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("An unknown error occurred.");
                        break;
                }
            });
        } else {
            cityName.textContent = "Location not supported on this browser."
        }
});