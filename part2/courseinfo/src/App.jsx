const Total = ({ parts }) => {
  let sum = 0
  for (let i = 0; i < parts.length; i++) {
    sum += parts[i].exercises
  }
  return (
    <p>total of {sum} exercises</p>
  )
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

const Header = ({ name }) =><h1>{name}</h1>

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  )
  
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App
