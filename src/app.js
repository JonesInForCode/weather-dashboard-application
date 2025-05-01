// api.js - Module for handling API interactions

// API configuration - using OpenWeatherMap as an example
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch weather data for a given city.
 * @param {string} city - The name of the city to fetch weather data for.
 * @returns {Promise} - A promise that resolves to the weather data for the city.
 */

export async function getCurrentWeather(location) {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${location}&units=metric&appid=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`Weather data not found for ${location}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
}

/**
 * Fetches 5-day forecast data for a given city.
 * @param {string} city - The name of the city to fetch forecast data for.
 * @returns {Promise} - A promise that resolves to the forecast data for the city.
 */

export async function getForecast(location) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${location}&units=metric&appid=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`Forecast data not found for ${location}`);
        }

        const data = await response.json();
        
        // Process the data to get daily forecasts instead of 3-hour intervals
        const dailyForecasts = processForecastData(data);
        return dailyForecasts;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        throw error;
    }
}
/**
 * Processes the forecast data to extract daily forecasts.
 * @param {Object} data - The raw forecast data from the API.
 * @returns {Array} - An array of daily forecast objects.
 */

function processForecastData(forecastData) {
    // API returns data in 3-hour intervals, we need to group it by date
    const dailyData = {};

    // Group the forecast data by day
    forecastData.list.forEach(item => {
        // Get the date (without time)
        const date = item.dt_txt.split(' ')[0];


    })
};