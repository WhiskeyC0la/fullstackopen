import express from 'express';
import { getPatientDataById } from '../services/patient.ts';
import { z } from 'zod';

const router = express.Router();

router.get('/:id', (request, response) => {
  try{
    const paramsId = z.string().trim().min(1).parse(request.params.id);
    const patient = getPatientDataById(paramsId);
    if (patient !== undefined) {
      return response.status(200).json(patient);
    }
    return response.status(404).json({ error: 'Patient not found'});
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({error: error.issues});
    } else {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;