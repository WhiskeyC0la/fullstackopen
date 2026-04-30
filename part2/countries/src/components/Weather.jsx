import {useState, useEffect} from 'react'
import weatherService from '../services/weather'
import weatherIcons from '../utils/weatherIcons'

const Weather = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        if(!country.capitalInfo || !country.capitalInfo.latlng) {
            return
        }

        const [lat, lon] = country.capitalInfo.latlng
        
        weatherService.getWeather(lat, lon)
        .then(data => setWeather(data))
    },[country])

    if(!weather) {
        return <div>Loading weather...</div>
    }

    return (
        <div>
            <h3>Weather in {country.capital}</h3>
            <p>Temperature {weather.current_weather.temperature} °C</p>
            <div style={{ fontSize: '48px'}}>
                {weatherIcons[weather.current_weather.weathercode]}
            </div>
            <p>Wind {weather.current_weather.windspeed} m/s</p>
        </div>
    )
}

export default Weather