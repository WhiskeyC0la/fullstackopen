interface Statistic {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (hours: number[], target: number): Statistic => {
  if (hours.length === 0) {
    throw new Error('Empty array is not allowed');
  }
  const positive = hours.every(hour => Number.isFinite(hour) && hour >= 0);
  if (!positive) {
    throw new Error('Only non-negative finite numbers are allowed');
  }
  if (!Number.isFinite(target) || target <= 0) {
    throw new Error('Target must be a positive finite number');
  }
  const trainingDays = hours.filter(hour => hour > 0).length;
  const average = hours.reduce((acc, hour) => acc + hour, 0) / hours.length;
  const success = average >= target;
  const ratio = target / average;
  const rating = ratio <= 1 ? 1 : ratio <= 2 ? 2 : 3;
  const descriptions = {
    1: 'You\'re a handsome, don\'t stop!',
    2: 'Not bad, but you can do better!',
    3: 'Don\'t be lazy, remember why you started!'
  };
  
  return {
    periodLength: hours.length,
    trainingDays,
    success,
    rating,
    ratingDescription: descriptions[rating],
    target,
    average
  };
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));