import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const StatisticLine = ({text, value, suffix}) => <p>{text} {value}{suffix}</p>
const Statistics = ({good, neutral, bad, total, average, positive}) => {
  if(total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <StatisticLine text = 'good' value = {good}/>
      <StatisticLine text = 'neutral' value = {neutral}/>
      <StatisticLine text = 'bad' value = {bad}/>
      <StatisticLine text = 'all' value = {total}/>
      <StatisticLine text = 'average' value = {average}/>
      <StatisticLine text = 'positive' value = {positive} suffix = '%'/>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = total === 0 ? 0 : Number(((good - bad) / total).toFixed(2))
  const positive = total === 0 ? 0 : Number((good * 100 / total).toFixed(2))

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <Header text='give feedback' />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />

      <Header text='statistics' />
      <Statistics good = {good} neutral = {neutral} bad = {bad} total = {total} average = {average} positive = {positive} />
    </div>
  )
}

export default App
