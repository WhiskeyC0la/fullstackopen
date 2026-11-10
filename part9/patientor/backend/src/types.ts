import { z } from 'zod';

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const newPatientEntrySchema = z.object({
  name: z.string().trim().min(1),
  dateOfBirth: z.iso.date(),
  ssn: z.string().trim().length(11),
  gender: z.enum(Gender),
  occupation: z.string().trim().min(1)
});

export type Patient = NewPatientEntry & {
  id: string;
};

export type PatientInfoWithoutSSN = Omit<Patient, 'ssn'>;

export type NewPatientEntry = z.infer<typeof newPatientEntrySchema>;