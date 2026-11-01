import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_request, response) => {
  return response.send('Hello Full Stack!');
});

app.get('/bmi', (request, response) => {
  const height = request.query.height;
  const weight = request.query.weight;
  if ((typeof height !== 'string' || height.trim() === '' || !Number.isFinite(Number(height)) || Number(height) <= 0)
    || (typeof weight !== 'string' || weight.trim() === '' || !Number.isFinite(Number(weight)) || Number(weight) <= 0)) {
    return response.status(400).json({ error: 'malformatted parameters' });
  }
  const result = calculateBmi(Number(height), Number(weight));
  return response.status(200).json({ weight: Number(weight), height: Number(height), bmi: result });
});

app.post('/exercises', (request, response) => {
  const body: unknown = request.body;

  if (typeof body !== 'object'
    || body === null
    || !('daily_exercises' in body)
    || !('target' in body)) {
      return response.status(400).json({ error: 'parameters missing'});
    }
  if (!Array.isArray(body.daily_exercises)
    || body.daily_exercises.length === 0
    || !body.daily_exercises.every(exercise => typeof exercise === 'number')
    || !body.daily_exercises.every(exercise => Number.isFinite(exercise) && exercise >= 0)
    || typeof body.target !== 'number'
    || !Number.isFinite(body.target)
    || body.target <= 0
  ) {
    return response.status(400).json({ error: 'malformatted parameters' });
  };

  return response.status(200).json(calculateExercises(body.daily_exercises, body.target));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});