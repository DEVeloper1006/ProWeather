import countries from './countries';

const cityInput = document.getElementById('city');
const cityName = document.getElementById('cityName');
const getCurrentLocation = document.getElementById('location');
const searchIcon = document.getElementById('searchIcon');

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError
      );
    } else {
      updateCityName("Location not supported on this browser.");
    }
}

function getLocationWeather () {
    const userInput = cityInput.value.trim();
    const isValidFormat = validateLocationFormat(userInput);

    if (isValidFormat) fetchWeatherData(userInput);
    else updateCityName(`Invalid format of ${userInput}`);
}

function validateLocationFormat(input) {
    const parts = input.split(',');
    return (parts.length === 1 || parts.length === 3);
}
  
function handleLocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    fetchLocationData(latitude, longitude);
}

function handleLocationError(error) {
    switch (error.code) {
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
}

function fetchLocationData(latitude, longitude) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
                const state = data.address.state || data.address.province;
                const country = data.address.country;
                const formattedLocation = `${city}, ${state ? state + ', ' : ''}${country}`;
                updateCityName(formattedLocation);
                fetchWeatherData(formattedLocation);
            } else {
                updateCityName('Location data not available');
            }
        })
        .catch(error => {
            console.error('Error fetching city:', error);
            updateCityName('Error fetching city');
        });
}

function fetchWeatherData(location) {
    const apiKey = "d4bb3287f300f3eb0ffde66cc48bf67d";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            // Process the weather data here
            const city = data.name;
            const countryCode = data.sys.country;
            const country = countries.find(item => item.code === countryCode);
            const countryName = country ? country.name : countryCode;
            const formattedLocation = `${city}, ${countryName}`;
            updateCityName(formattedLocation);
            console.log(data);
        })
            .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateCityName(city) {
    cityName.textContent = city;
}

getCurrentLocation.addEventListener('click', getCurrentLocationWeather);
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') getLocationWeather();
})
searchIcon.addEventListener('click', () => {
    getLocationWeather();
});
