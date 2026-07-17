# App de Búsqueda del Clima 🌤️

Una aplicación web interactiva, moderna y responsive que permite a los usuarios buscar cualquier ciudad del mundo y conocer su estado climático actual en tiempo real.

## 🚀 Funcionalidades

- **Búsqueda Geográfica**: Encuentra coordenadas exactas a partir del nombre escrito por el usuario.
- **Datos en Tiempo Real**: Muestra temperatura (°C), descripción del cielo, velocidad del viento y porcentaje de humedad.
- **Gestión de Errores**: Notifica al usuario de forma clara si el campo está vacío, si la ciudad no existe o si hay fallas de red.
- **Diseño Adaptable (Responsive)**: Interfaz fluida optimizada tanto para computadoras de escritorio como para pantallas móviles.

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la página.
- **CSS3**: Diseño estilizado, efectos de desenfoque (*Glassmorphism*) y diseño adaptable.
- **JavaScript (Vanilla JS)**: Consumo asíncrono de APIs mediante `fetch`, manipulación dinámica del DOM y lógica de control.
- **API Utilizada**: [Open-Meteo API](https://open-meteo.com) (Servicio gratuito y libre de API keys tanto para geocodificación como para métricas meteorológicas).

## 📦 Instalación y Ejecución

Para ejecutar este proyecto de forma local en tu computadora, sigue estos pasos:

1. **Clona este repositorio** en tu máquina local:
   ```bash
   git clone https://github.com
   ```
2. **Navega al directorio** del proyecto:
   ```bash
   cd TU_REPOSITORIO
   ```
3. **Abre el archivo** `index.html` directamente en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari). Alternativamente, puedes usar extensiones como *Live Server* en VS Code.