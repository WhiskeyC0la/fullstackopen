import { useEffect, useState } from 'react';
import patientService from '../../services/patients';
import { Box, Typography, Icon, createTheme, ThemeProvider, Alert } from '@mui/material';
import type { Patient, Diagnosis } from '../../types.ts';
import { Male, Female, Transgender } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import diagnosesService from '../../services/diagnoses.ts';

const genderIcons = {
   'male': Male,
   'female': Female,
   'other': Transgender
};

const theme = createTheme({
  typography: {
    h6: {
      fontSize: 22,
      fontWeight: 600
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 600
    },
    subtitle2: {
      fontSize: 14
    },
    caption: {
      fontSize: 13,
      fontStyle: 'italic'
    }
  }
});

const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Array<Diagnosis>>([]);
  const [error, setError] = useState<string | null>(null);
  const [patientLoading, setPatientLoading] = useState<boolean>(true);
  const [diagnosesLoading, setDiagnosesLoading] = useState<boolean>(true);

  useEffect(() => {
    if(id === undefined) {
      return;
    }
    patientService.getById(id)
      .then(patient => {
        setPatient(patient);
        setPatientLoading(false);
      })
      .catch(error => {
        const responseDataError = error?.response?.data?.error;
        console.error(error);
        setError(`Unable to load patient's data: ${responseDataError ? responseDataError : error.message}`);
        setPatientLoading(false);
      });
  }, [id]);

  useEffect(() => {
    diagnosesService.getDiagnoses()
    .then(diagnoses => {
      setDiagnoses(diagnoses);
      setDiagnosesLoading(false);
    })
    .catch(error => {
      setDiagnosesLoading(false);
      console.error(error.message);
    });
  }, []);
  
  const handleDiagnosesDescription = (code: string, diagnoses: Array<Diagnosis> ): string | undefined => {
    const found = diagnoses.find(diagnosis => diagnosis.code === code);
    if (found !== undefined) {
      return found.name;
    }
    return undefined;
  };

  return (
    patientLoading
      ? <div>Loading...</div>
      : <div>
        {error && <Alert severity="error">{error}</Alert>}
        {(!diagnosesLoading && diagnoses.length === 0) && <Alert severity='error'>Unable to load diagnoses</Alert>}
        <ThemeProvider theme={theme}>
          {patient !== null &&(
          <Box className='App'>
            <Typography variant='h6'>{patient.name} <Icon fontSize='small' component={genderIcons[patient.gender]} /></Typography>
            <Typography variant='subtitle2'>ssn: {patient.ssn}</Typography>
            <Typography variant='subtitle2'>occupation: {patient.occupation}</Typography>           
            {patient.entries.length > 0 && <Typography variant='subtitle1'>entries</Typography>}
            {patient.entries.map(entry => 
              <Typography key={entry.id} variant='subtitle2'>{entry.date}
                <Typography variant='caption'> {entry.description}</Typography>
                <ul>{entry.diagnosisCodes?.map(code => 
                  <li key={code}>
                    <Typography variant='subtitle2'>
                      {code} {diagnosesLoading ? 'Loading...' : diagnoses.length > 0
                        ? handleDiagnosesDescription(code, diagnoses)
                        : '<Unable to load description>'}
                    </Typography>
                  </li>)}
                </ul>
              </Typography>
            )}
          </Box>)}
        </ThemeProvider>
      </div>
  );
};

export default PatientPage;