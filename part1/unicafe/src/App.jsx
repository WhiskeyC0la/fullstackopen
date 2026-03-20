import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
const Statistic = ({text, value, suffix}) => value === 0 ? null : <p>{text} {value}{suffix}</p>

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
      <Statistic text = 'good' value = {good}/>
      <Statistic text = 'neutral' value = {neutral}/>
      <Statistic text = 'bad' value = {bad}/>
      <Statistic text = 'all' value = {total}/>
      <Statistic text = 'average' value = {average}/>
      <Statistic text = 'positive' value = {positive} suffix = '%'/>
    </div>
  )
}

export default App
