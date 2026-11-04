import express from 'express';
import { addPatient, getNonSensitivePatientData } from '../services/patient.ts';
import parseNewPatientEntry from '../utils.ts';

const router = express.Router();

router.get('/', (_request, response) => {
  const patients = getNonSensitivePatientData();
  return response.status(200).json(patients);
});

router.post('/', (request, response) => {
  try {
    const newEntry = parseNewPatientEntry(request.body);
    const newPatient = addPatient(newEntry);
    return response.status(201).json(newPatient);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return response.status(400).json({ error: error.message });
    } else {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;