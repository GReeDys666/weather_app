// const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

const API_KEY = '30cff0b97c5ec76bcab324f7405cb064';
const API = 'b11d772481c444ee5e84f9dba50829ec';
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Satur'];

getDefaultData = async () => {
  const URL = 'https://api.openweathermap.org/data/2.5/weather';
  const Full_Url = `${URL}?q=Lviv,UA&appid=${API_KEY}&units=metric`;
  const weatherPromise = fetch(Full_Url);

  return weatherPromise.then((response) => {
    return response.json();
  });
};

(function defaultCity() {
  getDefaultData()
    .then((response) => {
      showWeatherData(response);
    })
    .catch((err) => {
      console.log(err);
    });
})();

showWeatherData = (weatherData) => {
  document.querySelector('.location-and-date__location').innerText = weatherData.name;

  // Current data
  const currentData = new Date();
  let month = months[currentData.getMonth()];
  let day = days[currentData.getDay()];
  document.querySelector('.current-month').innerHTML = month;
  document.querySelector('.current-day').innerHTML = currentData.getDate() + 'th';
  document.querySelector('.current-date').innerHTML = day + 'day';

  //Icons
  let currentIcon = document.querySelector('.current-temperature__icon');
  let iconBaseUrl = 'http://openweathermap.org/img/wn/';
  let iconFormat = '.png';
  let iconCodeToday = weatherData.weather[0].icon;
  let iconFullUrlToday = `${iconBaseUrl}${iconCodeToday}${iconFormat}`;
  currentIcon.src = iconFullUrlToday;

  //Weather daily data
  document.querySelector('.value').innerText = Math.round(weatherData.main.temp) + '°';
  document.querySelector('.summary').innerText = weatherData.weather[0].description;
  document.querySelector('.current-stats__temp-max').innerText =
    Math.round(weatherData.main.temp_max) + ' °C';
  document.querySelector('.current-stats__temp-min').innerText =
    Math.round(weatherData.main.temp_min) + ' °C';
  document.querySelector('.current-stats__wind-speed').innerText =
    Math.round(weatherData.wind.speed) + 'mph';
  document.querySelector('.current-stats__humidity').innerText = weatherData.main.humidity + '%';
  // Get sunrise & sunset
  let sunriseDate = new Date(weatherData.sys.sunrise * 1000);
  let sunsetDate = new Date(weatherData.sys.sunset * 1000);
  let sunsetHours = sunsetDate.getHours();
  let sunsetMinutes = sunsetDate.getMinutes();
  let sunriseHours = sunriseDate.getHours();
  let sunriseMinutes = sunriseDate.getMinutes();
  if (sunriseMinutes < 10) {
    document.querySelector('.current-stats__sunrise').innerText =
      sunriseHours + ':' + '0' + sunriseMinutes;
    document.querySelector('.current-stats__sunset').innerText = sunsetHours + ':' + sunsetMinutes;
  } else if (sunsetMinutes < 10) {
    document.querySelector('.current-stats__sunrise').innerText =
      sunriseHours + ':' + sunriseMinutes;
    document.querySelector('.current-stats__sunset').innerText =
      sunsetHours + ':' + '0' + sunsetMinutes;
  } else {
    document.querySelector('.current-stats__sunrise').innerText =
      sunriseHours + ':' + sunriseMinutes;
    document.querySelector('.current-stats__sunset').innerText = sunsetHours + ':' + sunsetMinutes;
  }
};
// ****************************************************************

getHoursData = async () => {
  const URL = 'https://pro.openweathermap.org/data/2.5/forecast/hourly';
  const fullUrl = `${URL}?lat=49.84&lon=24.03&cnt=24&appid=${API_KEY}&units=metric`;
  const weatherPromise = fetch(fullUrl);

  return weatherPromise.then((response) => response.json());
};

(function showsData() {
  getHoursData()
    .then((response) => {
      console.log(response);
      showHoursData(response);
    })
    .catch((err) => {
      console.log(err);
    });
})();

showHoursData = (data) => {
  let iconBaseUrl = 'http://openweathermap.org/img/wn/';
  let iconFormat = '.png';
  for (let i = 0; i < data.list.length; i++) {
    document.querySelectorAll('.weather-by-hour__item img')[
      i
    ].src = `${iconBaseUrl}${data.list[i].weather[0].icon}${iconFormat}`;
    document.querySelectorAll('.degree')[i].innerText = Math.round(data.list[i].main.temp) + ' °';
    let date = new Date(data.list[i].dt * 1000);
    let date1 = date.getHours();
    document.querySelectorAll('.weather-by-hour__hour')[i].innerText = date1 + ':00';
  }
};

// ****************************************************************
getFiveDaysData = async () => {
  const URL = 'https://api.openweathermap.org/data/2.5/forecast/daily';
  const fullUrl = `${URL}?lat=49.84&lon=24.03&cnt=7&appid=${API_KEY}&units=metric`;
  const weatherPromise = fetch(fullUrl);

  return weatherPromise.then((response) => response.json());
};

(function showData() {
  getFiveDaysData()
    .then((response) => {
      showDefaultData(response);
    })
    .catch((err) => {
      console.log(err);
    });
})();

showDefaultData = (data) => {
  let iconBaseUrl = 'http://openweathermap.org/img/wn/';
  let iconFormat = '.png';
  for (let i = 0; i < data.list.length; i++) {
    let date = new Date(data.list[i].dt * 1000);
    let day = days[date.getDay()];
    document.getElementsByClassName('next-6-days__date')[i].innerText = day;
    document.querySelectorAll('.low-temperature')[i].innerText =
      Math.round(data.list[i].temp.min) + '°';
    document.querySelectorAll('.high-temperature')[i].innerText =
      Math.round(data.list[i].temp.max) + '°';
    document.querySelectorAll('.humidity')[i].innerText = data.list[i].humidity + '%';
    document.querySelectorAll('.next-6-days__wind .wind-speed')[i].innerText =
      data.list[i].speed.toFixed(1) + 'mph';
    document.querySelectorAll('.next-6-days__icon .days-icon')[
      i
    ].src = `${iconBaseUrl}${data.list[i].weather[0].icon}${iconFormat}`;
    let mainWeather = data.list[i].weather[0].main;
    switch (mainWeather) {
      case 'Snow':
        document.querySelectorAll('.next-6-days__row')[i].style.backgroundImage =
          "url('../assets/img/snow.gif')";
        break;
      case 'Clouds':
        document.querySelectorAll('.next-6-days__row')[i].style.backgroundImage =
          "url('../assets/img/clouds.gif')";
        break;
      case 'Fog':
        document.querySelectorAll('.next-6-days__row')[i].style.backgroundImage =
          "url('../assets/img/fog.gif')";
        break;
      case 'Rain':
        document.querySelectorAll('.next-6-days__row')[i].style.backgroundImage =
          "url('../assets/img/rain.gif')";
        break;
      case 'Clear':
        document.querySelectorAll('.next-6-days__row')[i].style.backgroundImage =
          "url('../assets/img/clear.gif')";
        break;
      case 'Thunderstorm':
        document.querySelectorAll('.next-6-days__row')[i].style.backgroundImage =
          "url('../assets/img/thunderstorm.gif')";
        break;
      default:
        document.querySelectorAll('.next-6-days__row')[i].style.backgroundImage =
          "url('../assets/img/clear.gif')";
        break;
    }
  }
};

function getlocaleDate() {
  const currenttime = new Date().toLocaleTimeString();
  document.querySelector('.time').innerHTML = currenttime;
}

setInterval(getlocaleDate, 1000);
