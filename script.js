let cityInput = document.getElementById('city_input'),
searchButton = document.getElementById('searchButton'),
locationButton = document.getElementById('locationButton'),
apiKey = 'YOUR API KEY',
currentWeather = document.querySelectorAll('.weatherleft .card')[0],
fiveDayForecastCard = document.querySelector('.dayforecast'),
aqi = document.querySelectorAll('.highlights .card')[0],
sunriseCard = document.querySelectorAll('.highlights .card')[1],
humidityVal = document.getElementById('humidityVal'),
pressureVal = document.getElementById('pressureVal'),
visibilityVal = document.getElementById('visibilityVal'),
windSpeedVal = document.getElementById('windSpeedVal'),
feelsVal = document.getElementById('feelsVal'),
hourlyForecastCard = document.querySelector('.hourly'),
aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(city, lat, lon, country, state){
    let forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    airIndex_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    fetch(weather_url).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeather.innerHTML = `
            <div class="currentweather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(0)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weatherIcon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="cardfooter">
                <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i> ${city}, ${country}</p>
            </div>`;

            let {sunset, sunrise} = data.sys,
            {timezone, visibility} = data,
            {humidity, pressure, feels_like} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'X').add(timezone, 's').format('hh:mm A'),
            sSetTime = moment.utc(sunset, 'X').add(timezone, 's').format('hh:mm A');

            sunriseCard.innerHTML = `
            <div class="cardHead">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunset fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
            `;

            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hPa`;
            visibilityVal.innerHTML = `${visibility / 1000} km`;
            windSpeedVal.innerHTML = `${speed} m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(0)}&deg;C`;
    }).catch(() => {
        alert('failed to fetch current weather');
    });

    fetch(airIndex_url).then(res => res.json()).then(data => {
        console.log(data);
        let {pm2_5, pm10, so2, co, no, no2, nh3, o3} = data.list[0].components;
        aqi.innerHTML = `
            <div class="cardHead">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>
        `;
    }).catch(() => {
        alert('failed to fetch air quality index');
    })

    fetch(forecast_url).then(res => res.json()).then(data => {
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for (i = 0; i <= 7; i++) {
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'PM';
            if (hr < 12) a = 'AM';
            if (hr == 0) hr = 12;
            if (hr > 12) hr -= 12;
            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(0)}&deg;C</p>
                </div>
            `;
        }
        let uniqueForecastDays = [];
        let fiveDayForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        fiveDayForecastCard.innerHTML = '';
        for (i = 1; i < fiveDayForecast.length; i++) {
            let date = new Date(fiveDayForecast[i].dt_txt);
            fiveDayForecastCard.innerHTML += `
                <div class="forecastitem">
                    <div class="iconwrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDayForecast[i].weather[0].icon}.png" alt="">
                        <span>${(fiveDayForecast[i].main.temp - 273.15).toFixed(0)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert('failed to fetch weather forecast');
    });
}

function getCityCoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return;
    let geocoding_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(geocoding_url).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoodinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let reverse_geocoding_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

        fetch(reverse_geocoding_url).then(res => res.json()).then(data => {
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert('failed to fetch user coordinates');
        });
    
    });
}

searchButton.addEventListener('click', getCityCoordinates);
locationButton.addEventListener('click', getUserCoodinates);