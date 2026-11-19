import express from "express";
import diagnosesRouter from './routes/diagnoses.ts';
import patientsRouter from './routes/patients.ts';
import patientRouter from './routes/patient.ts';

const app = express();
app.use(express.json());

app.get('/api/ping', (_request, response) => {
  response.send('pong');
});
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/patients', patientRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});