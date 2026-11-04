import patientsData from '../data/patients.ts';
import type { PatientInfoWithoutSSN, NewPatientEntry, Patient } from '../types.ts';
import { v1 as uuid } from 'uuid';

export const getNonSensitivePatientData = (): PatientInfoWithoutSSN[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

export const addPatient = (patient: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...patient
  };
  patientsData.push(newPatient);
  return newPatient;
};