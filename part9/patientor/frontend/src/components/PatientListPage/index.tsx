import { useState } from "react";
import { Link } from 'react-router';
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import axios from 'axios';

import { PatientFormValues, NonSensitivePatient } from "../../types";
import AddPatientModal from "../AddPatientModal";

import HealthRatingBar from "../HealthRatingBar";

import patientService from "../../services/patients";


interface Props {
  patients : NonSensitivePatient[]
  setPatients: React.Dispatch<React.SetStateAction<NonSensitivePatient[]>>
}

const PatientListPage = ({ patients, setPatients } : Props ) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      const patientStateView: NonSensitivePatient = {
        id: patient.id,
        name: patient.name,
        occupation: patient.occupation,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth
      };
      setPatients(patients.concat(patientStateView));
      setModalOpen(false);
      setError(undefined);
    } catch (error: unknown) {
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
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table sx={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient: NonSensitivePatient) => (
            <TableRow key={patient.id}>
              <TableCell><Link to={`/patients/${patient.id}`}>{patient.name}</Link></TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
