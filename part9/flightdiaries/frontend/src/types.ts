export interface DiaryCreation {
  date: string,
  weather: Weather,
  visibility: Visibility,
  comment?: string
}

export interface Diary extends DiaryCreation {
  id: number
}

export const Weather = {
  Sunny: 'sunny',
  Rainy: 'rainy',
  Cloudy: 'cloudy',
  Stormy: 'stormy',
  Windy: 'windy'
} as const;

export type Weather = typeof Weather[keyof typeof Weather];

export const Visibility = {
  Great: 'great',
  Good: 'good',
  Ok: 'ok',
  Poor: 'poor'
} as const;

export type Visibility = typeof Visibility[keyof typeof Visibility];

export interface SetDiariesProps {
  onAddDiary: (diary: Diary) => void
}

export interface NotificationProps {
  message: string | null,
  type: NotificationType
}

export type NotificationType = 'error' | 'success';