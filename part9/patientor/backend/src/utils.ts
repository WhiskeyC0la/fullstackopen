import { type NewPatientEntry, type Gender as GenderType, Gender } from "./types.ts";

const parseNewPatientEntry = (object: unknown): NewPatientEntry => {
  if(typeof object !== 'object' || object === null) {
    throw new Error('Invalid or missing patient info');
  }

  if('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPatient: NewPatientEntry = {
      name: parseValue(object.name, 'name'),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth, 'date of birth'),
      ssn: parseValue(object.ssn, 'ssn'),
      gender: parseGender(object.gender, 'gender'),
      occupation: parseValue(object.occupation, 'occupation')
    };
    
    return newPatient;
  };
  throw new Error('Invalid patient info: one or more fields are missing');
};

const parseValue = (value: unknown, field: string): string => {
  if(!isString(value)) {
    throw new Error(`Invalid patient info: patient's ${field}`);
  }
  return value;
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim() !== '';
};

const parseDateOfBirth = (date: unknown, field: string): string => {
  if(!isString(date) || !isDate(date)) {
    throw new Error(`Invalid patient info: patient's ${field}`);
  }
  return date;
};

const isDate = (date: string): boolean => {
  return !Number.isNaN(Date.parse(date));
};

const parseGender = (gender: unknown, field: string): GenderType => {
  if(!isString(gender) || !isGender(gender)) {
    throw new Error(`Invalid patient info: patient's ${field}`);
  }
  return gender;
};

const isGender = (gender: string): gender is GenderType => {
  return (Object.values(Gender) as string[]).includes(gender);
};
export default parseNewPatientEntry;