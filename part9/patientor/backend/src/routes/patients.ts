import express from 'express';
import { addPatient, getNonSensitivePatientData } from '../services/patient.ts';
import { newPatientEntrySchema } from '../types.ts';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_request, response) => {
  const patients = getNonSensitivePatientData();
  return response.status(200).json(patients);
});

router.post('/', (request, response) => {
  try {
    const newEntry = newPatientEntrySchema.parse(request.body);
    const newPatient = addPatient(newEntry);
    return response.status(200).json(newPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error(error.issues);
      return response.status(400).json({ error: error.issues });
    } else {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;