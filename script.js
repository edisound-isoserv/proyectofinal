// --- REFERENCIAS A ELEMENTOS DEL DOM ---
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const messageBox = document.getElementById('message-box');

const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weather-desc');
const windspeed = document.getElementById('windspeed');
const humidity = document.getElementById('humidity');

// --- DICCIONARIO PARA TRADUCIR CÓDIGOS DE CLIMA DE OPEN-METEO ---
const weatherCodes = {
    0: "Cielo despejado",
    1: "Principalmente despejado", 2: "Parcialmente nublado", 3: "Nublado",
    45: "Niebla", 48: "Niebla escarchada",
    51: "Llovizna ligera", 53: "Llovizna moderada", 55: "Llovizna densa",
    61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia fuerte",
    71: "Nieve ligera", 73: "Nieve moderada", 75: "Nieve fuerte",
    80: "Lluvia ligera intermitente", 81: "Lluvia moderada intermitente", 82: "Lluvia violenta",
    95: "Tormenta eléctrica ligera", 96: "Tormenta con granizo"
};

// --- FUNCIÓN PARA MOSTRAR MENSAJES DE ERROR O ESTADO ---
function showMessage(text) {
    messageBox.textContent = text;
    messageBox.classList.remove('hidden');
    weatherCard.classList.add('hidden'); 
}

// --- FUNCIÓN PRINCIPAL PARA CONSULTAR LAS APIS ---
async function fetchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showMessage("Por favor, ingresa el nombre de una ciudad.");
        return;
    }

    try {
        showMessage("Buscando ciudad...");

        // 1. Obtener coordenadas mediante la API de Geocodificación (con modo cors explícito)
        const geoUrl = `https://open-meteo.com{encodeURIComponent(city)}&count=1&language=es&format=json`;
        const geoResponse = await fetch(geoUrl, { mode: 'cors' });
        
        if (!geoResponse.ok) throw new Error(`Error en geocodificación: ${geoResponse.status}`);
        
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            showMessage("No se encontró la ciudad. Intenta con otra.");
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Obtener datos del clima usando las coordenadas obtenidas
        const weatherUrl = `https://open-meteo.com{latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl, { mode: 'cors' });
        
        if (!weatherResponse.ok) throw new Error(`Error en clima: ${weatherResponse.status}`);
        
        const weatherData = await weatherResponse.json();

        // 3. Renderizar los datos en el DOM
        const current = weatherData.current;
        cityName.textContent = `${name}, ${country}`;
        temperature.textContent = Math.round(current.temperature_2m);
        windspeed.textContent = current.wind_speed_10m;
        humidity.textContent = current.relative_humidity_2m;
        
        weatherDesc.textContent = weatherCodes[current.weather_code] || "Condiciones desconocidas";

        messageBox.classList.add('hidden');
        weatherCard.classList.remove('hidden');

    } catch (error) {
        // Esto imprimirá el error real en tu consola (F12) para diagnosticarlo mejor
        console.error("Detalle del error:", error);
        showMessage("Ocurrió un error al conectar con el servidor. Inténtalo de nuevo.");
    }
}

// --- ASIGNACIÓN DE EVENTOS ---
searchBtn.addEventListener('click', fetchWeather);

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});