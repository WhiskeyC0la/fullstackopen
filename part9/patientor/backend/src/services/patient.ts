import patientsData from '../data/patients.ts';
import type { NonSensitivePatient, NewPatientEntry, Patient } from '../types.ts';
import { v1 as uuid } from 'uuid';

export const getNonSensitivePatientData = (): NonSensitivePatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

export const getPatientDataById = (id: string): Patient | undefined=> {
  const found = patientsData.find(patient => patient.id === id);
  if (found) {
    return found;
  }
  return;
};

export const addPatient = (patient: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...patient,
    entries: []
  };
  patientsData.push(newPatient);
  return newPatient;
};