//Mengambil semua elemen dari DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

//Default kota ketika di load
let cityInput = "London";

//Menambahkan event click untuk setiap kota di panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        //Mengubah dari default kota ke kota yang diklik
        cityInput = e.target.innerHTML;
        //function yang mengambil dan menampilkan semua data dari weather API
        fetchWeatherData();
        //simple animation,,fade out the app
        app.style.opacity = "0";
    });
})

//Menambahkan event submit ke form
form.addEventListener('submit', (e) => {
    //jika field input nya kosong maka akan muncul alert
    if (search.value.length == 0) {
        alert('Please type in a city name');
    } else {
        //Mengubah dari default city ke yang diinputkan
        cityInput = search.value;
        //function yang mengambil dan menampilkan semua data dari weather API
        fetchWeatherData();
        //Menghapus text dari field input
        search.value = "";
        //simple animation
        app.style.opacity = "0";
    }

    //Mencegah default behaviour pada form
    e.preventDefault();
});

//function yang mengembalikan hari dalam seminggu
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

//function yang mengambil dan menampilkan data dari weather API
function fetchWeatherData() {
    //Mengambil data
    fetch(`https://api.weatherapi.com/v1/current.json?key=80558643391740e3b5b62829222606&q=${cityInput}`)
        //Mengambil data dalam format JSON kemudian di convert ke object
        .then(response => response.json())
        .then(data => {
            //Menampilkan data yang available
            console.log(data);
            //Menambahkan temperatur dan cuaca
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;
            //Mengambil tanggal dan waktu
            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);
            //Reformat tanggal
            //Original-> 2022-6-26 17:53
            //New format-> 17:53 - Friday 26,6 2022
            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
            timeOutput.innerHTML = time;
            //Menambah nama kota ke page
            nameOutput.innerHTML = data.location.name;
            //Mengambil icon
            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
            //Reformat icon url ke local folder
            icon.src = "./icons/" + iconId;

            //Menambah detail cuaca ke page
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            //Mengatur waktu sehari
            let timeOfDay = "day";
            //Mengambil unique id untuk setiap kondisi cuaca
            const code = data.current.condition.code;

            //Mengubah ke malam jika kotanya sedang malam
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            if (code == 1000) {
                //Mengatur background image ke cerah jika cuacanya cerah
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg`;
                //Mengubah button bg color berdasarkan waktu siang dan malam
                btn.style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            }
            //Jika cuacanya sama2 cloudy
            else if (
                code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1087 ||
                code == 1135 ||
                code == 1273 ||
                code == 1276 ||
                code == 1279 ||
                code == 1282
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
                //Ketika cuacanya hujan
            } else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252
            ) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = "#647d75";
                if (timeOfDay == "night") {
                    btn.style.background = "#325c80";
                }
                //Ketika salju
            } else {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
                btn.style.background = "#4d72aa";
                if (timeOfDay == "night") {
                    btn.style.background = "#1b1b1b";
                }
            }
            //fade ke page
            app.style.opacity = "1";
        })
        //jika user mengetikkan kota yang tidak ada maka akan muncul alert
        .catch(() => {
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}
//memanggil fungsi 
fetchWeatherData();

//fade in the page
app.style.opacity = "1";
