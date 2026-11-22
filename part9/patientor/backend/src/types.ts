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
  occupation: z.string().trim().min(1),
});

interface BaseEntry {
  id: string,
  description: string,
  date: string,
  specialist: string,
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3
} as const;

export type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];
export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck',
  healthCheckRating: HealthCheckRating
}

export type SickLeave = {
  startDate: string;
  endDate: string;
};
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare',
  employerName: string,
  sickLeave?: SickLeave
}

export type Discharge = {
  date: string;
  criteria: string;
};

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital',
  discharge: Discharge
}

type UnionOmit<OriginalType,
PropertyToRemove extends string | number | symbol
> = OriginalType extends unknown
? Omit<OriginalType, PropertyToRemove>
: never;

export type Entry =
| HealthCheckEntry
| OccupationalHealthcareEntry
| HospitalEntry;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;


export type Patient = NewPatientEntry & {
  id: string;
  entries: Entry[]
};

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatientEntry = z.infer<typeof newPatientEntrySchema>;

export const newBaseEntrySchema = z.object({
  description: z.string().trim().min(1),
  date: z.iso.date(),
  specialist: z.string().trim().min(1),
  diagnosisCodes: z.array(z.string().trim().min(3)).nonempty().optional()
});

export const newHealthCheckRatingSchema = z.union([
  z.literal(HealthCheckRating.Healthy),
  z.literal(HealthCheckRating.LowRisk),
  z.literal(HealthCheckRating.HighRisk),
  z.literal(HealthCheckRating.CriticalRisk)
]);

export const newHealthCheckEntrySchema = newBaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: newHealthCheckRatingSchema
});

export const newSickLeaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date()
});

export const newOccupationalHealthcareEntrySchema = newBaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().trim().min(1),
  sickLeave: newSickLeaveSchema.optional()
});

export const newDischargeSchema = z.object({
  date: z.iso.date(),
  criteria: z.string().trim().min(1)
});

export const newHospitalEntryShema = newBaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: newDischargeSchema
});

export const newEntrySchema = z.discriminatedUnion('type', [
  newHealthCheckEntrySchema,
  newOccupationalHealthcareEntrySchema,
  newHospitalEntryShema
]);