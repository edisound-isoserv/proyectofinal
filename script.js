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

        // 1. Obtener coordenadas mediante la API alternativa y estable de Nominatim (OpenStreetMap)
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
        const geoResponse = await fetch(geoUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'WeatherAppTest/1.0' // Buenas prácticas de identificación requeridas por OpenStreetMap
            }
        });
        
        if (!geoResponse.ok) throw new Error("Fallo en el servidor de mapas.");
        
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
            showMessage("No se encontró la ciudad. Intenta con otra o revisa la ortografía.");
            return;
        }

        // Extraer latitud, longitud y nombre formateado
        const latitude = geoData[0].lat;
        const longitude = geoData[0].lon;
        const displayName = geoData[0].display_name.split(',')[0]; // Toma solo el nombre de la ciudad
        const countryName = geoData[0].display_name.split(',').pop().trim(); // Toma el nombre del país

        // 2. Obtener datos del clima usando las coordenadas mediante Open-Meteo
        const weatherUrl = `https://open-meteo.com{latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) throw new Error("Fallo al obtener datos meteorológicos.");
        
        const weatherData = await weatherResponse.json();

        // 3. Renderizar los datos obtenidos en el DOM
        const current = weatherData.current;
        cityName.textContent = `${displayName}, ${countryName}`;
        temperature.textContent = Math.round(current.temperature_2m);
        windspeed.textContent = current.wind_speed_10m;
        humidity.textContent = current.relative_humidity_2m;
        
        // Traducir código climático
        weatherDesc.textContent = weatherCodes[current.weather_code] || "Condiciones desconocidas";

        // Intercambiar visibilidad de las tarjetas
        messageBox.classList.add('hidden');
        weatherCard.classList.remove('hidden');

    } catch (error) {
        console.error("Detalle del error técnico:", error);
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
