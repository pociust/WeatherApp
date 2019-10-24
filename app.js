const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
const endBaseURL = "&units=imperial&appid=35b0242376c730106a1ead757ba5708a";
let forecastDisplay = $("#forecast-div");
let previousCityDisplay = $("#previous-search-city");

function cityUvIndex(latitude, longitude) {
  let uvQueryURL = `http://api.openweathermap.org/data/2.5/uvi/forecast?appid=7a5cc2c363f8a0be0f35d5a738f74ef7&lat=${latitude}&lon=${longitude}&cnt=5`;
  console.log("lat", latitude);
  console.log("long", longitude);
  $.ajax({
    url: uvQueryURL,
    method: "GET"
  }).then(function(uvIndex) {
    console.log("2", uvIndex);
  });
}

function searchCity(city, lat, lng) {
  let queryURL =
    forecastURL + (city ? `q=${city}` : `lat=${lat}&lon=${lng}`) + endBaseURL;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    let latitude = response.city.coord.lat;
    let longitude = response.city.coord.lon;

    cityUvIndex(latitude, longitude);
    displayCityInfo(response);
    displayForecast(response);
    cityStorage(response.city.name);
  });
}

function cityStorage(cityName) {
  let cityList = localStorage.getItem("key")
    ? JSON.parse(localStorage.getItem("key"))
    : [];

  cityList = cityList.concat(cityName);
  showPreviousCity(cityList);

  localStorage.setItem("key", JSON.stringify(cityList));
}

function showPreviousCity(cityList) {
  for (i = 0; i < cityList.length; i++) {
    showCityListDiv = $(
      `<ul class="previous-city-display">
        <li>${cityList[i]}
        </li>
      </ul>`
    );
    previousCityDisplay.prepend(showCityListDiv);
  }
}

function displayCityInfo(response) {
  let createDiv = $(
    `<h2>
      ${response.city.name}
    </h2>
    <div>
      Temperature: ${response.list[0].main.temp}°F
    </div>
    <div>
      Humidity: ${response.list[0].main.humidity}%
    </div>
    <div>
      Wind: ${response.list[0].wind.speed}MPH
    </div>`
  );
  $("#searched-city-info").html(createDiv);
}

function displayForecast(response) {
  for (i = 5; i < response.list.length; i += 8) {
    forecastDiv = $(
      `<div class="forecast-box shadow-light">
        <h2>
          ${response.city.name}
        </h2>
        <div>
          Temperature: ${response.list[i].main.temp}°F
        </div>
        <div>
          Humidity: ${response.list[i].main.humidity}%
        </div>
        <div>
          Wind: ${response.list[i].wind.speed}MPH
        </div>
    </div>`
    );
    forecastDisplay.append(forecastDiv);
  }
}

$("#city-search").on("click", function() {
  let city = $(":text").val();
  forecastDisplay.html("");
  previousCityDisplay.html("");
  searchCity(city);
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    searchCity(null, position.coords.latitude, position.coords.longitude);
  });
} else {
  console.log("this browser does not support geolocation");
}
