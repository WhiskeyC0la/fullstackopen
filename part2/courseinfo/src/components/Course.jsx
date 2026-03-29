const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
return <p>
          <strong>
            total of {total} exercises
          </strong>
        </p>
}
const Part = ({ part }) => {
  return(
    <p>{part.name} {part.exercises}</p>
  )
} 
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
      <Total parts={parts}/>
    </div>
  )
}

const Header = ({ name }) => <h2>{name}</h2>


const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} /> 
    </div>
  )
}

export default Course