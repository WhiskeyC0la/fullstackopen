import axios from "axios";
import { EntryWithoutId, Entry } from '../types';
import { apiBaseUrl } from "../constants";

const addNewEntry = async (id: string, entry: EntryWithoutId) => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    entry
  );
  return data;
};

export default { addNewEntry };