const Persons = ({ displayedList, deleteUser}) => {
    return (
        <ul>
        {displayedList.map(person =>
          <li key={person.name}>
            {person.name} {person.number}
            <button onClick={() => deleteUser(person.id)}>delete</button>
          </li>)}
      </ul>
    )
}
export default Persons