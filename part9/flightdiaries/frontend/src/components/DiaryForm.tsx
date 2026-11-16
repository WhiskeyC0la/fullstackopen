import { useState, useRef } from "react";
import { create } from '../services/services.ts';
import { Weather, Visibility } from "../types.ts";
import type { SetDiariesProps, NotificationType } from '../types.ts';
import Notification from "./Notification.tsx";
import axios from 'axios';

const DiaryForm = ({ onAddDiary }: SetDiariesProps) => {
  const [newDate, setNewDate] = useState('');
  const [newWeather, setNewWeather] = useState<Weather | ''>('');
  const [newVisibility, setNewVisibility] = useState<Visibility | ''>('');
  const [newComment, setNewComment] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<NotificationType>('success');
  
  const handleDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDate(event.target.value);
  };
  const handleWeather = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const isWeather = (value: string): value is Weather => Object.values(Weather).some(weather => weather === value);
    if (value === '' || isWeather(value)) {
      setNewWeather(value);
    }
  };
  const handleVisibility = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const isVisibility = (value: string): value is Visibility => Object.values(Visibility).some(visibility => visibility === value);
    if (value === '' || isVisibility(value)) {
      setNewVisibility(value);
    }
  };
  const handleComment = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewComment(event.target.value);
  };
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNotification = (message: string, type: NotificationType): void => {
      setNotification(message);
      setNotificationType(type);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setNotification(null);
        timeoutRef.current = null;
      }, 5000);
  };

  const addDiary = async () => {
    try {
      const invalidWeather = newWeather === '';
      const invalidVisibility = newVisibility === '';
      const invalidDate = newDate === '';

      const errors: string[] = [];
      if (invalidWeather) {
        errors.push('Weather: Allowed types are "sunny", "rainy", "cloudy", "stormy", "windy"');
      }
      if (invalidVisibility) {
        errors.push('Visibility: Allowed types are "great", "good", "ok", "poor"');
      }
      if (invalidDate) {
        errors.push('Enter date: can\'t create new diary without date');
      }

      if (invalidWeather || invalidVisibility || invalidDate) {
        throw new Error(errors.join(',\n'));
      }

      const newDiary = await create({
        date: newDate.trim(),
        weather: newWeather,
        visibility: newVisibility,
        comment: newComment.trim()
      });
      const isString = (value: unknown): value is string => {return typeof value === 'string';};
      onAddDiary(isString(newDiary.comment) && newDiary.comment.trim() !== ''
        ? newDiary
        : {
          id: newDiary.id,
          date: newDiary.date,
          weather: newDiary.weather,
          visibility: newDiary.visibility
        }
      );
      setNewDate('');
      setNewWeather('');
      setNewVisibility('');
      setNewComment('');
      handleNotification('Diary successfully added', 'success');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const isArray = (value: unknown): value is { message: string }[] => { 
          return Array.isArray(value)
          && value.every(v => (typeof v === 'object' && v !== null) && Object.hasOwn(v, 'message') && typeof v.message === 'string');
        };
        const errors: unknown = error.response?.data?.error;
        if (isArray(errors)) {
          handleNotification(errors.map(e => e.message).join(',\n'), 'error');
        } else {
          handleNotification('Failed to create diary entry', 'error');
        }
      } else if (error instanceof Error) {
        handleNotification(error.message, 'error');
      } else {
        handleNotification('An unexpected error occurred', 'error');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await addDiary();
  };
  const handleClear = () => {
    setNewDate('');
    setNewWeather('');
    setNewVisibility('');
    setNewComment('');
  };
  
  return (
    <div>
      <h3>Add new entry</h3>
      <Notification message={notification} type={notificationType} />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Date:
            <input
              type='date'
              placeholder='Enter date'
              value={newDate}
              onChange={handleDate}
            />
          </label>
        </div>
        <div>
          <label>
            Weather:
            <select
              value={newWeather}
              onChange={handleWeather} 
            >
              <option value=''>Choose weather</option>
              <option value={Weather.Sunny}>sunny</option>
              <option value={Weather.Rainy}>rainy</option>
              <option value={Weather.Cloudy}>cloudy</option>
              <option value={Weather.Stormy}>stormy</option>
              <option value={Weather.Windy}>windy</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Visibility:
            <select
              value={newVisibility}
              onChange={handleVisibility}
            >
              <option value=''>Choose visibility</option>
              <option value={Visibility.Great}>great</option>
              <option value={Visibility.Good}>good</option>
              <option value={Visibility.Ok}>ok</option>
              <option value={Visibility.Poor}>poor</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Comment:
            <input
              type='text'
              placeholder='Enter comment'
              value={newComment}
              onChange={handleComment}
            />
          </label>
        </div>
        <button type='submit'>
          add
        </button>
        <button type='button' onClick={handleClear}>
          clear all
        </button>
      </form>
    </div>
  );
};

export default DiaryForm;