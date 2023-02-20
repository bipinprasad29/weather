// function for selecting dom element
const id = (id) => document.getElementById(id),
  cl = (cl) => document.querySelector(cl);

// getting all dom element
let inp = id("serchfield"),
  city = id("city"),
  icons = id("icons"),
  countryName = id("country"),
  desc = id("desc"),
  desc1 = id("desc1"),
  refresh = id("refresh"),
  temper = id("temp"),
  getloc = id("geoLocation"),
  hum = cl(".hum"),
  wind = cl(".wind"),
  pres = cl(".pres");

// adding Event Listener to Search bar
icons.addEventListener("click", () => {
  getWeatherData();
  refresh.classList.remove("hide");
});

// adding Enter Event Listener to Search input field
inp.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeatherData();
    refresh.classList.remove("hide");
  }
});

// getting time and date function
setInterval(() => {
  const today = new Date(),
    day = today.getDay(),
    daylist = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday ",
      "Thursday",
      "Friday",
      "Saturday",
    ];

  let hour = today.getHours(),
    minute = today.getMinutes(),
    second = today.getSeconds(),
    dates = today.getDate(),
    months = today.getMonth(),
    years = today.getFullYear();

  let prepand = hour >= 12 ? " PM " : " AM ";

  hour = hour >= 12 ? hour - 12 : hour;

  if (hour === 0 && prepand === " PM ") {
    if (minute === 0 && second === 0) {
      hour = 12;

      prepand = " Noon";
    } else {
      hour = 12;
      prepand = " PM";
    }
  }
  if (hour === 0 && prepand === " AM ") {
    if (minute === 0 && second === 0) {
      hour = 12;
      prepand = " Midnight";
    } else {
      hour = 12;
      prepand = " AM";
    }
  }
  months < 12 ? (months = months + 1) : (months = 1);
  second < 10 ? (second = "0" + second) : second;
  minute < 10 ? (minute = "0" + minute) : minute;
  hour < 10 ? (hour = "0" + hour) : hour;

  let timess = id("time"),
    datess = id("date");
  datess.innerHTML = `${daylist[day]}, ${dates}-${months}-${years}`;
  timess.innerHTML = `${hour} : ${minute} : ${second} ${prepand}`;
}, 1000);

// function for calling Api and then getting data in our browser
function getWeatherData(arg) {
  // api key for calling
  let API_key = "8108a250c0440589ecc77d7a89be8f55";

  //fetching data using current position
  if (arg === "geo") {
    navigator.geolocation.getCurrentPosition((success) => {
      let { latitude: lat, longitude: lon } = success.coords;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.envAPI_key}`
      )
        .then((res) => res.json())
        .then((data) => {
          ShowWeatherData(data);
        });
    });
  }
  // else part for fetching data using search input value
  else {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inp.value}&units=metric&appid=${API_key}`
    )
      .then((res) => res.json())
      .then((data) => {
        ShowWeatherData(data);
      });
  }
}

// setting page initial value
window.onload = () => {
  inp.value = "delhi";
  return getWeatherData();
};

// adding Event  listener to refesh button
refresh.addEventListener("click", () => {
  inp.value === "" ? getWeatherData("geo") : getWeatherData();
});

// adding Event  listener to gps button
getloc.addEventListener("click", () => getWeatherData("geo"));

// function for showing all data of api on our dom
const ShowWeatherData = (data) => {
  // condition for if api return valid data
  if (data.name) {
    //destructuring object and getting all the value from api data
    let { temp, humidity, pressure } = data.main;
    let { description, main } = data.weather[0];
    let { speed } = data.wind;
    let { country, sunrise, sunset } = data.sys;

    // converting sunset and sunrise value in time format
    let sec1 = sunrise,
      date1 = new Date(sec1 * 1000),
      time1 = `${date1.getHours()}: ${date1.getMinutes()}`;

    let sec2 = sunset,
      date2 = new Date(sec2 * 1000),
      time2 = `${date2.getHours()}: ${date2.getMinutes()}`;

    // Changing the dom data
    
    countryName.innerHTML = " -" + country;
    city.innerHTML = data.name;
    temper.innerHTML = temp + "°C";
    desc.innerHTML = `Sunrise at <span class="rise">&#9728;</span> ${time1}AM and Sunset at <span class="set">&#9728;</span> ${time2}PM`;
    desc1.innerHTML = `it will be ${description} today`;
    hum.innerHTML = `Humidity - ${humidity}`;
    pres.innerHTML = `Pressure- ${pressure} p`;
    wind.innerHTML = `Wind-${speed} m/s`;
    let arr = [hum, pres, wind];
    arr.map((e) => e.classList.add("border"));
  } else {
    city.innerHTML = data.message;
    countryName.innerHTML = " ";
    temper.innerHTML = " ";
    desc.innerHTML = " ";
    desc1.innerHTML = " ";
    hum.innerHTML = ``;
    pres.innerHTML = ``;
    wind.innerHTML = ``;
  }
};
