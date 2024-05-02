const weatherApi = {
  key: "c74047f67a59f4ba1ee21b869f2b0639",
  base: "https://api.openweathermap.org/data/2.5/"
 }
 
 const searchInput = document.querySelector('.search-box');
 searchInput.addEventListener('keypress', initiateSearch);
 
// Function to fetch weather data based on user's location
function fetchWeatherDataFromLocation() {
  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(position => {
       const { latitude, longitude } = position.coords;
       fetchWeatherDataCoord(`lat=${latitude}&lon=${longitude}`);
     }, error => {
       console.error("Error fetching location:", error);
     });
  } else {
     console.error("Geolocation is not supported by this browser.");
  }
 }

 //Code for Search Box. fetches weather data after pressing "ENTER" key
 function initiateSearch(event) {
  if (event.keyCode == 13) {
     fetchWeatherData(searchInput.value);
  }
 }
 
 //fetches weather data based on latitude and longitude
 function fetchWeatherDataCoord(query) {
  fetch(`${weatherApi.base}weather?${query}&units=metric&appid=${weatherApi.key}`)
     .then(response => {
       return response.json();
     }).then(showWeatherDetails);
 }

 //fetches weather data based on name
 function fetchWeatherData(query) {
  fetch(`${weatherApi.base}weather?q=${query}&units=metric&APPID=${weatherApi.key}`)
     .then(response => {
       return response.json();
     }).then(showWeatherDetails);
 }
 
 //JSON parsing and html element updation based on json weather data
 function showWeatherDetails(weatherData) {
  let cityElement = document.querySelector('.location .city');
  cityElement.innerText = `${weatherData.name}, ${weatherData.sys.country}`;
 
  let currentDate = new Date();
  let dateElement = document.querySelector('.location .date');
  dateElement.innerText = formatDate(currentDate);
 
  let temperatureElement = document.querySelector('.current .temp');
  temperatureElement.innerHTML = `${Math.round(weatherData.main.temp)}<span>°c</span>`;
 
  let weatherDescriptionElement = document.querySelector('.current .weather');
  weatherDescriptionElement.innerText = weatherData.weather[0].description;
 
  let highLowTemperatureElement = document.querySelector('.hi-low');
  highLowTemperatureElement.innerText = `${Math.round(weatherData.main.temp_min)}°c / ${Math.round(weatherData.main.temp_max)}°c`;

  //extra
  let pressureElement = document.querySelector('.pressure');
  pressureElement.innerText = `${Math.round(weatherData.main.pressure)} hPa`;

  let humidityElement = document.querySelector('.humidity');
  humidityElement.innerText = `${Math.round(weatherData.main.humidity)} %`;
  //Added by Jatin
  let humidityElementValue = Math.round(weatherData.main.humidity);
  document.documentElement.style.setProperty('--dynamic-width-h', humidityElementValue +'%');

  let sunriseElement = document.querySelector('.sunrise-time');
  sunriseElement.innerText = `${convertUnixToTime(weatherData.sys.sunrise)}`;

  let sunsetElement = document.querySelector('.sunset-time');
  sunsetElement.innerText = `${convertUnixToTime(weatherData.sys.sunset)}`;

  let dayPercentage = calculateDayPercentage(weatherData.sys.sunrise,weatherData.sys.sunset).toFixed(0)

  let dayPercentageElement = document.querySelector('.sun');
  dayPercentageElement.innerText = `${dayPercentage} % completed`;

  let dayPercentageElementValue = dayPercentage;
  document.documentElement.style.setProperty('--dynamic-width-s', dayPercentageElementValue +'%');
  // till hear
  let visibilityElement = document.querySelector('.visibility');
  visibilityElement.innerText = `${Math.round(weatherData.visibility)} m`;

  let timezoneElement = document.querySelector('.timezone');
  timezoneElement.innerText = `UTC + ${convertUnixToTime(weatherData.timezone)} `;

  // Dynamically change the weather icon based on the weather condition
  let weatherIconElement = document.querySelector('.current .icon img');
  let weatherIconCode = weatherData.weather[0].icon;
  weatherIconElement.src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
 
  // Dynamically change the background based on weather name
  const weatherBackgroundMap = {
    "Clear": "images/clear.jpg",
    "Clouds": "images/cloudy.jpg",
    "Rain": "images/rainy.jpg",
    "Snow": "images/snowy.jpg",
    "Haze": "images/haze.jpg",
    "Thunderstorm": "images/thunder.jpg",
    "Drizzle": "images/rainy.jpg",
    "Mist": "images/haze.jpg",
    "Smoke": "images/haze.jpg",
    "Dust": "images/dust.jpg",
    "Fog": "images/haze.jpg",
    "Sand": "images/dust.jpg",
    "Ash": "images/ash.jpg",
    "Squall": "images/ash.jpg",
    "Tornado": "images/tornado.jpg",
  };
 
  //Changes Background variables and fetches weather name
  const weatherName = weatherData.weather[0].main;
  if (weatherBackgroundMap[weatherName]) {
    document.body.style.backgroundImage = `url(${weatherBackgroundMap[weatherName]})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  }
 }
 
 fetchWeatherDataFromLocation();

 //Changes Date
 function formatDate(date) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
 
  let day = days[date.getDay()];
  let dateValue = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
 
  return `${day} ${dateValue} ${month} ${year}`;
 }
 
 //time Conversions

 function convertUnixToTime(unixTimestamp) {
  let timestampMs = unixTimestamp * 1000;
  let date = new Date(timestampMs);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let formattedHours = (hours < 10 ? '0' : '') + hours;
  let formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
  let timeString = formattedHours + ':' + formattedMinutes ;
  return timeString;
}

function calculateDayPercentage(sunriseTime, sunsetTime) {
  let currentTime = Math.floor(Date.now() / 1000);
  if (sunriseTime >= sunsetTime || currentTime < sunriseTime || currentTime > sunsetTime) {
      return 0; 
  }
  let totalDaylightDuration = sunsetTime - sunriseTime;
  let elapsedTimeSinceSunrise = currentTime - sunriseTime;
  let dayPercentage = (elapsedTimeSinceSunrise / totalDaylightDuration) * 100;
  return Math.min(100, Math.max(0, dayPercentage));
}