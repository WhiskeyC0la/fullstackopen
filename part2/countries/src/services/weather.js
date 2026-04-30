import axios from 'axios'

const getWeather = (lat, lon) => {
    return axios
    .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.data)
}

export default { getWeather }