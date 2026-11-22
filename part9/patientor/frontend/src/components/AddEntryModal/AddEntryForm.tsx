import React, { useState } from "react";
import { Box, Select, InputLabel, MenuItem, SelectChangeEvent, TextField, Button, Grid } from "@mui/material";
import { EntryWithoutId, HealthCheckRating, Diagnosis } from '../../types.ts';


const EntryType = {
    healthCheck: 'Health Check',
    occupational: 'Occupational Healthcare',
    hospital: 'Hospital'
  } as const;

type EntryType = typeof EntryType[keyof typeof EntryType];

type Props = {
  onCancel: () => void;
  onSubmit: (entry: EntryWithoutId) => void;
  diagnoses: Array<Diagnosis>
}

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {

  const [entryType, setEntryType] = useState<EntryType>(EntryType.healthCheck);
  const [entryDate, setEntryDate] = useState<string>('');
  const [entryDescription, setEntryDescription] = useState<string>('');
  const [entrySpecialist, setEntrySpecialist] = useState<string>('');
  const [entryHealthRating, setEntryHealthRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [entryEmployerName, setEntryEmployerName] = useState<string>('');
  const [entryCodes, setEntryCodes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');

  const onEntryTypeChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const type = Object.values(EntryType).find(type => type === value);
    if (type) {
      setEntryType(type);
    }
  };

  const onEntryHealthRatingChange = (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value;
    const rating = Object.values(HealthCheckRating).find(rating => rating === value);
    if (rating !== undefined) {
      setEntryHealthRating(rating);
    }
  };

  const onDiagnosesCodesChoose = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    if (Array.isArray(value)) {
        setEntryCodes(value);
    } else if (typeof value === 'string') {
      setEntryCodes(value.split(','));
    }
  };

  const onStringInputFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
  };

  const commonEntryFields = {
    date: entryDate,
    specialist: entrySpecialist,
    description: entryDescription,
  };

  const onNewEntryCreation = (): EntryWithoutId => {
    switch(entryType) {
      case 'Health Check':
        return {
          ...commonEntryFields,
          type: 'HealthCheck',
          healthCheckRating: entryHealthRating
        };
      case 'Occupational Healthcare':
        return {
          ...commonEntryFields,
          type: 'OccupationalHealthcare',
          employerName: entryEmployerName,
          diagnosisCodes: entryCodes.length > 0 ? entryCodes : undefined,
          sickLeave: {
            startDate,
            endDate
          }
        };
      case 'Hospital':
        return {
          ...commonEntryFields,
          type: 'Hospital',
          diagnosisCodes: entryCodes.length > 0 ? entryCodes : undefined,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
      default:
        const remaining: never = entryType;
        throw new Error(`Undefined entry type ${JSON.stringify(remaining)}`);
    }
  };

  const addNewEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit(onNewEntryCreation());
    onCancel();
  };

  const healthCheck = (
    <Box>
      <InputLabel htmlFor='entry-date'sx={{ marginTop: 1 }}>Date*</InputLabel>
      <TextField
        id='entry-date'
        type='date'
        size='small'
        required
        value={entryDate}
        onChange={(event) => onStringInputFieldChange(event, setEntryDate)}
      />
      <InputLabel htmlFor='entry-description' sx={{ marginTop: 1 }}>Description*</InputLabel>
      <TextField
        id='entry-description'
        type='text'
        size='small'
        required
        fullWidth
        value={entryDescription}
        onChange={(event) => onStringInputFieldChange(event, setEntryDescription)}
      />
      <InputLabel htmlFor='entry-specialist' sx={{ marginTop: 1 }}>Specialist*</InputLabel>
      <TextField
        id='entry-specialist'
        type='text'
        size='small'
        required
        fullWidth
        value={entrySpecialist}
        onChange={(event) => onStringInputFieldChange(event, setEntrySpecialist)}
      />
      <InputLabel id='health-rating-label' sx={{ marginTop: 1 }}>Health Check Rating*</InputLabel>
      <Select
        labelId='health-rating-label'
        id='health-rating'
        size='small'
        fullWidth
        required
        value={entryHealthRating}
        onChange={onEntryHealthRatingChange}
      >
        {Object.entries(HealthCheckRating).map(([name, rating]) =>
          <MenuItem
            key={rating}
            value={rating}>
              {rating} - {name} 
          </MenuItem>
        )}
      </Select>
      <InputLabel id='diagnoses-label' sx={{ marginTop: 1 }}>Diagnoses</InputLabel>
      <Select
        labelId='diagnoses-label'
        id='diagnoses'
        size='small'
        fullWidth
        multiple
        renderValue={(values) => values.join(', ')}
        value={entryCodes}
        onChange={onDiagnosesCodesChoose}
      >
        {diagnoses.map(diagnosis => 
          <MenuItem
          key={diagnosis.code}
          value={diagnosis.code}
          >
            {diagnosis.code} - {diagnosis.name}
          </MenuItem>
        )}
      </Select>
    </Box>
  );
  
  const occupational = (
    <Box>
      <InputLabel htmlFor='entry-date' sx={{ marginTop: 1 }}>Date*</InputLabel>
      <TextField
        id='entry-date'
        type='date'
        size='small'
        required
        value={entryDate}
        onChange={(event) => onStringInputFieldChange(event, setEntryDate)}
      />
      <InputLabel htmlFor='entry-description' sx={{ marginTop: 1 }}>Description*</InputLabel>
      <TextField
        id='entry-description'
        type='text'
        size='small'
        required
        fullWidth
        value={entryDescription}
        onChange={(event) => onStringInputFieldChange(event, setEntryDescription)}
      />
      <InputLabel htmlFor='entry-specialist' sx={{ marginTop: 1 }}>Specialist*</InputLabel>
      <TextField
        id='entry-specialist'
        type='text'
        size='small'
        required
        fullWidth
        value={entrySpecialist}
        onChange={(event) => onStringInputFieldChange(event, setEntrySpecialist)}
      />
      <InputLabel htmlFor='entry-employer-name' sx={{ marginTop: 1 }}>Employer name*</InputLabel>
      <TextField
        id='entry-employer-name'
        type='text'
        size='small'
        required
        fullWidth
        value={entryEmployerName}
        onChange={(event) => onStringInputFieldChange(event, setEntryEmployerName)}
      />
      <InputLabel id='diagnoses-label' sx={{ marginTop: 1 }}>Diagnoses</InputLabel>
      <Select
        labelId='diagnoses-label'
        id='diagnoses'
        size='small'
        fullWidth
        multiple
        renderValue={(values) => values.join(', ')}
        value={entryCodes}
        onChange={onDiagnosesCodesChoose}
      >
        {diagnoses.map(diagnosis => 
          <MenuItem
          key={diagnosis.code}
          value={diagnosis.code}
          >
            {diagnosis.code} - {diagnosis.name}
          </MenuItem>
        )}
      </Select>
      <InputLabel sx={{ marginTop: 1 }}>Sick leave</InputLabel>
      <Grid container justifyContent={"space-between"}>
        <InputLabel htmlFor='start-date-label' sx={{ marginTop: 1 }}>Start date:
        <TextField
          id='start-date-label'
          size="small"
          type='date'
          value={startDate}
          onChange={(event) => onStringInputFieldChange(event, setStartDate)}
        />
        </InputLabel>
        <InputLabel htmlFor='end-date-label' sx={{ marginTop: 1 }}>End date:
        <TextField
          id='end-date-label'
          size="small"
          type='date'
          value={endDate}
          onChange={(event) => onStringInputFieldChange(event, setEndDate)}
        />
        </InputLabel>
      </Grid>
    </Box>
  );

  const hospital = (
    <Box>
      <InputLabel htmlFor='entry-date-label' sx={{ marginTop: 1 }}>Date*</InputLabel>
      <TextField
        id='entry-date-label'
        type='date'
        size='small'
        required
        value={entryDate}
        onChange={(event) => onStringInputFieldChange(event, setEntryDate)}
      />
      <InputLabel htmlFor='entry-description' sx={{ marginTop: 1 }}>Description*</InputLabel>
      <TextField
        id='entry-description'
        type='text'
        size='small'
        required
        fullWidth
        value={entryDescription}
        onChange={(event) => onStringInputFieldChange(event, setEntryDescription)}
      />
      <InputLabel htmlFor='entry-specialist' sx={{ marginTop: 1 }}>Specialist*</InputLabel>
      <TextField
        id='entry-specialist'
        type='text'
        size='small'
        required
        fullWidth
        value={entrySpecialist}
        onChange={(event) => onStringInputFieldChange(event, setEntrySpecialist)}
      />
      <InputLabel id='diagnoses-label' sx={{ marginTop: 1 }}>Diagnoses</InputLabel>
      <Select
        labelId='diagnoses-label'
        id='diagnoses'
        size='small'
        fullWidth
        multiple
        renderValue={(values) => values.join(', ')}
        value={entryCodes}
        onChange={onDiagnosesCodesChoose}
      >
        {diagnoses.map(diagnosis => 
          <MenuItem
          key={diagnosis.code}
          value={diagnosis.code}
          >
            {diagnosis.code} - {diagnosis.name}
          </MenuItem>
        )}
      </Select>
      <InputLabel sx={{ marginTop: 1 }}>Discharge*</InputLabel>
      <InputLabel htmlFor='discharge-date-label'sx={{ marginTop: 1 }}>Date:
        <TextField
          id='discharge-date-label'
          size="small"
          type='date'
          value={dischargeDate}
          onChange={(event) => onStringInputFieldChange(event, setDischargeDate)}
        />
        </InputLabel>
        <InputLabel htmlFor='discharge-criteria' sx={{ marginTop: 1 }}>Criteria:</InputLabel>
        <TextField
          id='discharge-criteria'
          size="small"
          fullWidth
          type='text'
          value={dischargeCriteria}
          onChange={(event) => onStringInputFieldChange(event, setDischargeCriteria)}
        />
    </Box>
  );

  const optionSelect = (option: EntryType) => {
    switch(option) {
      case 'Health Check':
        return healthCheck;
      case 'Occupational Healthcare':
        return occupational;
      case 'Hospital':
        return hospital;
      default:
        const remaining: never = option;
        throw new Error(`Undefined type of entry: ${JSON.stringify(remaining)}`);
    }
  };
  
  return (
  <Box>
    <form onSubmit={addNewEntry}>
      <InputLabel sx={{ mt: 2, mb: 3, fontSize: 24, fontWeight: 600, color: 'AccentColor'}}>New {entryType} entry</InputLabel>
      <InputLabel>* - required field</InputLabel>
      <InputLabel sx={{ marginTop: 1 }}>Entry type*</InputLabel>
      <Select
        size='small'
        fullWidth
        value={entryType}
        onChange={onEntryTypeChange}
      >
        {Object.values(EntryType).map((value, key) =>
          <MenuItem
            key={key}
            value={value}
          >
            {value}
          </MenuItem>
        )}
      </Select>
      {optionSelect(entryType)}
        <Grid container justifyContent={'space-between'} sx={{ marginTop: 2 }}>
          <Grid size='auto'>
            <Button
              type='submit'
              variant='contained'
              sx={{ width: 110 }}
            >
              Add
            </Button>
          </Grid>
          <Grid size='auto'>
            <Button
              type='button'
              variant='contained'
              sx={{ width: 110 }}
              color='secondary'
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
    </form>
  </Box>
);
};

export default AddEntryForm;