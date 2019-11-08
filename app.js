const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
const endBaseURL = "&units=imperial&appid=35b0242376c730106a1ead757ba5708a";
let forecastDisplay = $("#forecast-div");
let uvIndexDisplay = $("#uvindex-div");
let previousCityDisplay = $("#previous-search-city");

function cityUvIndex(latitude, longitude) {
  let uvQueryURL = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=7a5cc2c363f8a0be0f35d5a738f74ef7&lat=${latitude}&lon=${longitude}&cnt=5`;
  $.ajax({
    url: uvQueryURL,
    method: "GET"
  }).then(function(uvIndex) {
    console.log("uvindex", uvIndex);
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
    console.log("response", response);
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
    <div>
      Temperature: ${response.list[0].main.temp}°F
    </div>
    <img src="http://openweathermap.org/img/wn/${
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
        <div class="forecast-box shadow-light height-100 p-5">
          <div>${moment()
            .add(i < 1 ? 1 : i + 1, "days")
            .format("MMM, D")}
          </div>
          <h2>
            ${response.city.name}
          </h2>
          <div>
            Temperature: ${response.list[5 + 8 * i].main.temp}°F
          </div>
          <img class="weather-icons" src="http://openweathermap.org/img/wn/${
            response.list[5 + 8 * i].weather[0].icon
          }@2x.png">
          <div>
            Humidity: ${response.list[5 + 8 * i].main.humidity}%
          </div>
          <div>
            Wind: ${response.list[5 + 8 * i].wind.speed}MPH
          </div>
          <div class="UVI-add${[i]}">
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
        UV Index: ${uvIndex[u].value} of 10
      </div>`);
    $(`.UVI-add${u - 1}`).prepend(uVIndexDiv);
  }
  citySearchUvIndex = $(`
      <div>
        UV Index: ${uvIndex[0].value} of 10
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
