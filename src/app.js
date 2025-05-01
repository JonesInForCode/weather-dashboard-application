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

        // If the date is not already in the dailyData object, create an entry
        if (!dailyData[date]) {
            dailyData[date]= {
                temps: [],
                humidity: [],
                weather: [],
                icon: null,
                date
            };
        }

        // Push the temperature, humidity, and weather data into the respective arrays
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidity.push(item.main.humidity);
        dailyData[date].weather.push(item.weather[0].main);

        if (item.dt_txt.includes('12:00')) {
            // Store the icon for the day (12:00 is usually the most representative)
            dailyData[date].icon = item.weather[0].icon;
        }
    });

    // Calculate average and prepare final data
    return Object.values(dailyData).map(day => {
        // Calculate average temperature
        const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;

        // Calculate average humidity
        const avgHumidity = day.humidity.reduce((sum, humidity) => sum + humidity, 0 )/ day.humidity.length;

        // Get the most common weather condition
        const weatherCounts = {};
        day.weather.forEach(weather => {
            weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
        });

        let mostCommonWeather = '';
        let maxCount = 0;

        Object.entries(weatherCounts).forEach(([weather, count]) => {
            if (count > maxCount) {
                mostCommonWeather = weather;
                maxCount = count;
            }
        });

        const icon = day.icon || day.weather[0].icon;

        return {
            date: day.date,
            temp: avgTemp.toFixed(1),
            humidity: avgHumidity.toFixed(1),
            weather: mostCommonWeather,
            icon
        };
    }).slice(0, 5); // Limit to 5 days
}