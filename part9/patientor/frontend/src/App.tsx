import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography, Alert } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { NonSensitivePatient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`)
      .then(res => console.log(res))
      .catch(() => console.error('Unable to connect'));

    const fetchPatientList = async () => {
      try{
        const patients = await patientService.getAll();
        setPatients(patients);
      } catch (error) {
        setError('Unable to load patient list');
        console.error(error);
      }

    };
    void fetchPatientList();
  }, []);
  
  return (
    <div className="App">
      {error !== null && <Alert severity="error">{error}</Alert>}
      <Router>
        <Container>
          <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider sx={{ marginY: 2 }} />
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients/:id" element={<PatientPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
