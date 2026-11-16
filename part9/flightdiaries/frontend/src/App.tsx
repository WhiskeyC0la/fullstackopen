import { useEffect, useState } from 'react';
import type { Diary } from './types.ts';
import { getAll } from './services/services.ts';
import DiaryForm from './components/DiaryForm.tsx';
import Notification from './components/Notification.tsx';

function App() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    getAll()
      .then(diaries => setDiaries(diaries))
      .catch(() => {
        setNotification('Failed to load diary entries');
      });
  },[]);

  const handleStateUpdate = (diary: Diary) => {
    setDiaries(prev => [...prev, diary]);
  };

  return (
    <div>
      <Notification message={notification} type='error' />
      <DiaryForm onAddDiary={handleStateUpdate}/>
      <h3>Diary entries</h3>
        {diaries.map(diary => <div key={diary.id}>
          <h4>{diary.date}</h4>
          <p>weather: {diary.weather}</p>
          <p>visibility: {diary.visibility}</p>
          {'comment' in diary ? <p>comment: {diary.comment}</p> : null}
        </div>)}
    </div>
  );
}

export default App;
