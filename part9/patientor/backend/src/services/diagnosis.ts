import diagnosesData from '../data/diagnoses.ts';
import type { Diagnosis } from '../types.ts';

export const getDiagnoses = (): Diagnosis[] => {
  return diagnosesData;
};