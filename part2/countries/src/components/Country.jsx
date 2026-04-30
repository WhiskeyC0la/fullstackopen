import Weather from './Weather.jsx'

const Country = ({ country }) => {
    return (
        <div>
            <h2>
              {country.name.common}
            </h2>
            <p>Capital {country.capital[0]} </p>
            <p>Area {country.area} </p>
            <p>Population {country.population}</p>
            <h3>
              Languages
            </h3>
            <ul>
                {Object.values(country.languages)
                .map(language => <li key={language}>{language}</li>)}
            </ul>
            <img src={country.flags.png}
            alt={
              country.flags.alt
              || `Flag of ${country.name.common}`
            }/>
            <div>
              <Weather country={country} />
            </div>
        </div>
    )
}
export default Country