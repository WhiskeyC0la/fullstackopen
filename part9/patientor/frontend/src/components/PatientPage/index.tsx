import { useEffect, useState } from 'react';
import patientService from '../../services/patients';
import { Box, Typography, Icon, createTheme, ThemeProvider, Alert, Button } from '@mui/material';
import type { Patient, Diagnosis, EntryWithoutId } from '../../types.ts';
import { Male, Female, Transgender } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import diagnosesService from '../../services/diagnoses.ts';
import EntryDetails from './EntryDetails.tsx';
import AddEntryModal from '../AddEntryModal/index.tsx';
import entryService from '../../services/entries.ts';
import axios from 'axios';

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(null);
  };

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

  const submitNewEntry = async (entry: EntryWithoutId) => {
    try {
      if (id === undefined) {
        throw new Error('Invalid patient id');
      }
      if (patient === null) {
        throw new Error('Patient not found');
      }
      const newEntry = await entryService.addNewEntry(id, entry);
      setPatient({...patient, entries: patient.entries.concat(newEntry)});
    } catch (error) {
            if (axios.isAxiosError(error)) {
        const isArray = (value: unknown): value is { message: string }[] => { 
          return Array.isArray(value)
          && value.every(v => (typeof v === 'object' && v !== null) && 'message' in v && typeof v.message === 'string');
        };
        const errors: unknown = error.response?.data?.error;
        if (isArray(errors)) {
          console.error(errors);
          setError(errors.map(error => error.message).join(',\n'));
        } else if (error?.response?.data && typeof error?.response?.data === "string") {
          const message = error.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else if (typeof errors === 'string') {
          console.error(errors);
          setError(errors);
        } else if (!error.response) {
          console.error(error.message);
          setError('Unable to connect to the server');
        } else {
          console.error(error);
          setError('Unable to create patient');
        }
      } else {
        console.error("Unknown error", error);
        setError("Unknown error");
      }
    }
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
            <AddEntryModal modalOpen={modalOpen} onClose={closeModal} onSubmit={submitNewEntry} error={error} diagnoses={diagnoses}/>
            <Button variant="contained" onClick={() => openModal()} sx={{ my: 2 }}>
              Add New Entry
            </Button>         
            {patient.entries.length > 0 && <Typography variant='subtitle1'>entries</Typography>}
            {patient.entries.map(entry => <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} loading={diagnosesLoading} />)}
          </Box>)}
        </ThemeProvider>
      </div>
  );
};

export default PatientPage;