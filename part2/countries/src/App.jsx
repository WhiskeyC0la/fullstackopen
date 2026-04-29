import { useState, useEffect } from 'react'
import axios from 'axios'
import CountriesList from './components/CountriesList.jsx'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

useEffect(() => {
  axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
    })
}, [])

const handleFilter = (event) => {
  setFilter(event.target.value)
  setSelectedCountry(null)
}

const handleSelectedCountry = (country) => {
  setSelectedCountry(country)
}

const filteredCountries = countries.filter(
  country => country.name.common.toLowerCase().includes(filter.toLowerCase())
)

  return (
    <div>
      <form>
        find countries <input value={filter} onChange={handleFilter}/>
      </form>
      <div>
        <CountriesList filteredCountries={filteredCountries} filter={filter} selectedCountry={selectedCountry} handleSelectedCountry={handleSelectedCountry}/>
      </div>
    </div>
  )
}

export default App
