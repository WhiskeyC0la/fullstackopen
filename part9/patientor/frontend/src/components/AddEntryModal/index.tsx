import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import AddEntryForm from "./AddEntryForm";
import { Diagnosis, EntryWithoutId } from "../../types";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error: string | null;
  diagnoses: Array<Diagnosis>
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, diagnoses }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>New Entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm onCancel={onClose} onSubmit={onSubmit} diagnoses={diagnoses}/>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;