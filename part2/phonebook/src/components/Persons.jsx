const Persons = ({displayedList}) => {
    return (
        <ul>
        {displayedList.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
      </ul>
    )
}
export default Persons