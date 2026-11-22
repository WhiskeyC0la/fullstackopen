import { createTheme, ThemeProvider, Icon, Typography, Card, Stack, Box } from "@mui/material";
import type { Diagnosis, Entry } from '../../types.ts';
import { AddTask, Work, LocalHospital } from '@mui/icons-material';
import HealthRatingBar from '../HealthRatingBar.tsx';

const icons = {
  HealthCheck: AddTask,
  OccupationalHealthcare: Work,
  Hospital: LocalHospital
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
      fontSize: 14,
      fontStyle: 'italic'
    },
    body2: {
      fontWeight: 550
    },
    body1: {
      fontWeight: 550
    }
  },
});

const handleDiagnosesDescription = (code: string, diagnoses: Array<Diagnosis> ): string | undefined => {
  const found = diagnoses.find(diagnosis => diagnosis.code === code);
  if (found !== undefined) {
    return found.name;
  }
  return undefined;
};

type EntryProps = {
  entry: Entry;
  diagnoses: Array<Diagnosis>;
  loading: boolean;
};

const EntryDetails = ({ entry, diagnoses, loading }: EntryProps ) => {
 
    const description = (
    <Box >
      {entry.diagnosisCodes ? <Typography variant='body2'>diagnoses</Typography> : null}
      <ul>{entry.diagnosisCodes?.map(code => 
        <li key={code}>
          <Typography variant='subtitle2'>
            {code} {loading ? 'Loading...' : diagnoses.length > 0
            ? handleDiagnosesDescription(code, diagnoses)
            : '<Unable to load description>'}
          </Typography>
        </li>)}
      </ul>
    </Box>
  );
 
  switch (entry.type) {
  case 'HealthCheck':
    return (
      <ThemeProvider theme={theme}>
        <Card variant='outlined' sx={{ my: 2, border: '1px solid', borderColor: 'grey.600', borderRadius: 2}}>
          <Stack direction='column' spacing={1} sx={{ alignItems: 'flex-start', p: 1 }} useFlexGap>
          <Typography variant='body1'>{entry.date} <Icon fontSize='small' component={icons[entry.type]}/></Typography>
          <Typography variant='caption'>{entry.description}</Typography>
          {description}
          <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
          <Typography variant='body2'>diagnose by {entry.specialist}</Typography>
          </Stack>
        </Card>
      </ThemeProvider>
    );
  case 'OccupationalHealthcare':
    return (
      <ThemeProvider theme={theme}>
        <Card variant='outlined' sx={{ my: 2, border: '1px solid', borderColor: 'grey.600', borderRadius: 2}}>
          <Stack direction='column' spacing={1} sx={{ alignItems: 'flex-start', p: 1 }} useFlexGap>
            <Typography variant='body1'>{entry.date} <Icon fontSize='small' component={icons[entry.type]}/> {entry.employerName}</Typography>
            <Typography variant='caption'>{entry.description}</Typography>
            {description}
            <Typography variant='body2'>diagnose by {entry.specialist}</Typography>
          </Stack>
          {entry.sickLeave
          ? <Stack direction='column' spacing={0.1} sx={{ alignItems: 'flex-start', p: 1 }} useFlexGap>
            <Typography variant='body2'>sick leave:</Typography>
            <Typography variant='subtitle2'>start date: {entry.sickLeave.startDate}</Typography>
            <Typography variant='subtitle2'>end date: {entry.sickLeave.endDate}</Typography>
          </Stack>
          : null
          }
        </Card>
      </ThemeProvider>
    );
  case 'Hospital':
    return (
      <ThemeProvider theme={theme}>
        <Card variant='outlined' sx={{ my: 2, border: '1px solid', borderColor: 'grey.600', borderRadius: 2}}>
          <Stack direction='column' spacing={1} sx={{ alignItems: 'flex-start', p: 1 }} useFlexGap>
            <Typography variant='body1'>{entry.date} <Icon fontSize='small' component={icons[entry.type]}/></Typography>
            <Typography variant='caption'>{entry.description}</Typography>
            {description}
            <Typography variant='body2'>diagnose by {entry.specialist}</Typography>
          </Stack>
          <Stack direction='column' spacing={0.1} sx={{ alignItems: 'flex-start', p: 1 }} useFlexGap>
            <Typography variant='body2'>discharge:</Typography>
            <Typography variant='subtitle2'>date: {entry.discharge.date}</Typography>
            <Typography variant='subtitle2'>criteria: {entry.discharge.criteria}</Typography>
          </Stack>
        </Card>
      </ThemeProvider>
    );
  default: 
    const remaining: never = entry;
    throw new Error(`Undefined type of entry ${JSON.stringify(remaining)}`);
 }
};

export default EntryDetails;