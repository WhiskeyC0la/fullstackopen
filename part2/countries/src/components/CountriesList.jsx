import Country from './Country'

const CountriesList = ({ filteredCountries, filter }) => {
  if(filter !== '') {
      if(filteredCountries.length > 10) {
        return <>Too many matches, specify another filter</>
      }
      else if(filteredCountries.length >= 2 && filteredCountries.length <= 10) {
        return <ul>{filteredCountries.map(country => <li key={country.name.common}>{country.name.common}</li>)}</ul>
      }
      else if(filteredCountries.length === 1) {
        return <Country country={filteredCountries[0]} />
      }
      else return <>No matches found</>
  }
  return null
}

export default CountriesList