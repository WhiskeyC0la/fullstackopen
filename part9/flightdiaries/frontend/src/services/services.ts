import axios from 'axios';
import type { Diary, DiaryCreation } from '../types';

const baseUrl = '/api/diaries';

export const getAll = async () => {
  const response = await axios.get<Diary[]>(baseUrl);
  return response.data;
};

export const create = async (newDiary: DiaryCreation) => {
  const response = await axios.post<Diary>(baseUrl, newDiary);
  return response.data;
};
