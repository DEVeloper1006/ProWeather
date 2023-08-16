const cityInput = document.getElementById('city');
const cityName = document.getElementById('cityName');
const getCurrentLocation = document.getElementById('location');
const searchIcon = document.getElementById('searchIcon');
const info = document.querySelector('.current-info');
const topMenu = document.querySelector('.topMenu');
const errScreen = document.querySelector('.search-something');
const temp = document.querySelector('.temp');
const weatherIcon = document.querySelector('.weather-img');
const toggleUnit = document.getElementById('unit-switch');
const weatherDescr = document.querySelector('.weather-type');
const feelsLikeTemp = document.getElementById("feels-like");
const sunsetTime = document.getElementById('sunset');
const sunriseTime = document.getElementById('sunrise');

function loadCountries() {
    return fetch('countries.json')
        .then(response => response.json())
        .catch(error => {
            console.error(`${error}: Unable to load JSON file.`);
            return []; // Return an empty array in case of an error
        });
}

let countries;

const countriesPromise = loadCountries();
countriesPromise.then(data => {
    countries = data;
});

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

    if (!location) {
        cityInput.value = "";
        return;
    }

    const apiKey = "d4bb3287f300f3eb0ffde66cc48bf67d";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            //Process the weather data here
            if (data && data.sys && data.sys.country){
                info.classList.remove('hide');
                const city = data.name;
                const countryCode = data.sys.country;
                const country = countries.find(item => item.code === countryCode);
                const countryName = country ? country.name : countryCode;
                const formattedLocation = `${city}, ${countryName}`;
                updateCityName(formattedLocation);
                //errScreen.classList.add('hide');
                cityInput.value = "";
                updateWeatherInfo(data);
                console.log(data); 
            } else {
                alert("City Not Found.");
                cityInput.value = "";
            }
        }).catch(error => {
            console.error('Error fetching weather data:', error);
            cityInput.value = "";
        });
}

function updateCityName(city) {
    cityName.textContent = city;
}

function updateWeatherInfo (data) {
    updateTemperature(data.main);
    const system = data.sys;
    updateWeatherIcon(data.weather[0]);
    setSunsetSunrise(system.sunrise, system.sunset);
}

function updateTemperature (tempObject) {
    let kelvinTemp = tempObject.temp;
    let kelvinFeelsLikeTemp = tempObject.feels_like;
    temp.innerHTML = kelvinToCelsius(kelvinTemp) + "°C";
    feelsLikeTemp.innerHTML = "Feels Like " + kelvinToCelsius(kelvinFeelsLikeTemp) + "°C";
}

function updateDescription (description) {
    weatherDescr.innerText = description;
}

function updateWeatherIcon(weatherObject) {
    let description = weatherObject.description;
    weatherIcon.src = `openweathermap/${weatherObject.icon}.svg`;
    const parts = description.split(' ');
    let newDescription = "";
    for (let part of parts) {
        newDescription += `${part[0].toUpperCase()}${part.slice(1)} `;
    }
    updateDescription(newDescription);
}

function kelvinToCelsius (kelvin) {
    return (Math.round(kelvin - 273.15));
}

function celsiusToFahrenheit (celsius) {
    return Math.round((celsius * 9/5) + 32); 
}

function fahrenheitToCelsius (fahrenheit) {
    return Math.round(((fahrenheit - 32) * 5) / 9);
}

function unixTo12Hour (timeStamp) {
    const date = new Date(timeStamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = hours % 12 || 12;
    const formattedTime = `${twelveHourFormat}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    return formattedTime;
}

function setSunsetSunrise (sunrise, sunset) {
    sunriseTime.innerHTML = unixTo12Hour(sunrise);
    sunsetTime.innerHTML = unixTo12Hour(sunset);
}

getCurrentLocation.addEventListener('click', getCurrentLocationWeather);
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') getLocationWeather();
})

searchIcon.addEventListener('click', () => {
    getLocationWeather();
});

function changeUnits () {
    const oldTemp = temp.innerHTML;
    const parts = feelsLikeTemp.textContent.split(' ');
    if (oldTemp.endsWith("°C")) {
        let celsiusFeelsLike = Number(parts[2].replace("°C", ""));
        feelsLikeTemp.textContent = "Feels Like " + celsiusToFahrenheit(celsiusFeelsLike) + "°F";
        temp.innerHTML = celsiusToFahrenheit(spliceTemperature(oldTemp)) + "°F";
    } else {
        let fahrenheitFeelsLike = Number(parts[2].replace("°F", ""));
        feelsLikeTemp.textContent = "Feels Like " + fahrenheitToCelsius(fahrenheitFeelsLike) + "°C";
        temp.innerHTML = fahrenheitToCelsius(spliceTemperature(oldTemp)) + "°C";
    }
}

function spliceTemperature (temperature){
    let numericPart = '';
    for (let i = 0; i < temperature.length; i++) {
        if (!isNaN(temperature[i])) numericPart += temperature[i];
    }
    return numericPart;
}

toggleUnit.addEventListener('change', changeUnits);

