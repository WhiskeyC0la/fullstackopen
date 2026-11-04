import express from 'express';
import { getDiagnoses } from '../services/diagnosis.ts';

const router = express.Router();

router.get('/', (_request, response) => {
  const diagnoses = getDiagnoses();

  response.send(diagnoses);
});

export default router;