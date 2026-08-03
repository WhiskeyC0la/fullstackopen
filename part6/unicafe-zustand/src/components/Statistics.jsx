import { useFeedbackCounters } from "./store"

const Statistics = () => {
  const good = useFeedbackCounters('good')
  const neutral = useFeedbackCounters('neutral')
  const bad = useFeedbackCounters('bad')
  const all = good + neutral + bad
  const average = all === 0 ? 0 : Number(((good - bad) / all).toFixed(2))
  const positive = all === 0 ? 0 : Number((good * 100 / all).toFixed(2))

  if(all === 0) {
    return <p>No feedback given</p>
  }
  
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive}</td><td>%</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
