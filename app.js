const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
const endBaseURL = "&units=imperial&appid=35b0242376c730106a1ead757ba5708a";
const themes = {
  black: {
    main: "#727272",
    light: "#eee",
    dark: "#333"
  },
  green: {
    main: "#00897B",
    light: "#B2DFDB",
    dark: "#00695C"
  },
  purple: {
    main: "#5E35B1",
    light: "#9575CD",
    dark: "#4527A0"
  },
  yellow: {
    main: "#FB8C00",
    light: "#FFCC80",
    dark: "#EF6C00"
  }
};
let forecastDisplay = $("#forecast-div");
let uvIndexDisplay = $("#uvindex-div");
let previousCityDisplay = $("#previous-search-city");

function changeTheme(color) {
  document.documentElement.style.setProperty(
    "--theme-color",
    themes[color].main
  );
  document.documentElement.style.setProperty(
    "--theme-color-light",
    themes[color].light
  );
  document.documentElement.style.setProperty(
    "--theme-color-dark",
    themes[color].dark
  );
}

function cityUvIndex(latitude, longitude) {
  let uvQueryURL = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=7a5cc2c363f8a0be0f35d5a738f74ef7&lat=${latitude}&lon=${longitude}&cnt=5`;
  $.ajax({
    url: uvQueryURL,
    method: "GET"
  }).then(function(uvIndex) {
    displayUvIndex(uvIndex);
  });
}

function searchCity(city, lat, lng) {
  forecastDisplay.html("");
  previousCityDisplay.html("");
  uvIndexDisplay.html("");
  let queryURL =
    forecastURL + (city ? `q=${city}` : `lat=${lat}&lon=${lng}`) + endBaseURL;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    let latitude = response.city.coord.lat;
    let longitude = response.city.coord.lon;
    cityUvIndex(latitude, longitude);
    displayCityInfo(response);
    displayForecast(response);
    cityStorage(response.city.name);
  });
}

function cityStorage(cityName) {
  let cityList = localStorage.getItem("cityList")
    ? JSON.parse(localStorage.getItem("cityList"))
    : [];

  cityList = cityList.concat(cityName);
  let nonDuplicateCity = new Set(cityList);
  showPreviousCity([...nonDuplicateCity]);
  localStorage.setItem("cityList", JSON.stringify([...nonDuplicateCity]));
}

function showPreviousCity(cityList) {
  for (i = 0; i < cityList.length; i++) {
    showCityListDiv = $(
      `<li class="clickable" onclick="searchCity('${cityList[i]}')">${cityList[i]}
      </li>`
    );
    previousCityDisplay.prepend(showCityListDiv);
  }
}

function displayCityInfo(response) {
  let createDiv = $(
    `<div>
      ${moment().format("MMM, D")}
    </div>
    <h2>
      ${response.city.name},<span class=small-country> ${
      response.city.country
    }</span>
    </h2>
    <div class="card-temperature">
      ${Math.round(response.list[0].main.temp)}°F
    </div>
    <img class="weather-icons" src="http://openweathermap.org/img/wn/${
      response.list[0].weather[0].icon
    }@2x.png">
    <div>
      Humidity: ${response.list[0].main.humidity}%
    </div>
    <div>
      Wind: ${response.list[0].wind.speed}MPH
    </div>
    <div class="city-uv">
    </div>`
  );

  $("#searched-city-info").html(createDiv);
}

function displayForecast(response) {
  for (var i = 0; i < 5; i++) {
    forecastDiv = $(
      `<div class="col-md-1-5">
        <div class="forecast-box shadow-light">
          <div class="card-date">
            ${moment()
              .add(i < 1 ? 1 : i + 1, "days")
              .format("MMM D")}
          </div>
          <div class="p-15">
            <div class="frow row-center nowrap">
              <img class="weather-icons" src="http://openweathermap.org/img/wn/${
                response.list[5 + 8 * i].weather[0].icon
              }@2x.png">
              <div class="card-temperature shrink-0">
                ${Math.round(response.list[5 + 8 * i].main.temp)}°F
              </div>
            </div>
            <div class="card-info">
              <span>Humidity</span> ${response.list[5 + 8 * i].main.humidity}%
            </div>
            <div class="card-info">
              <span>Wind</span> ${response.list[5 + 8 * i].wind.speed}MPH
            </div>
            <div class="UVI-add${[i]} card-info"></div>
          </div>
        </div>
      </div>`
    );
    forecastDisplay.append(forecastDiv);
  }
}

function displayUvIndex(uvIndex) {
  for (var u = 1; u < 6; u++) {
    uVIndexDiv = $(`
      <div>
        <span>UV Index</span> ${uvIndex[u].value} of 10
      </div>`);
    $(`.UVI-add${u - 1}`).prepend(uVIndexDiv);
  }
  citySearchUvIndex = $(`
      <div>
        <span>UV Index:</span> ${uvIndex[0].value} of 10
      </div>`);
  $(`.city-uv`).prepend(citySearchUvIndex);
}

$("#city-search").submit(function(event) {
  event.preventDefault();
  let city = $(":text").val();
  searchCity(city);
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    searchCity(null, position.coords.latitude, position.coords.longitude);
  });
} else {
  console.log("this browser does not support geolocation");
}
