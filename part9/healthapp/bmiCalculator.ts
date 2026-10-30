import { validateArgs } from './utils/validator.ts';

const calculateBmi = (height: number, weight: number): string => {
  if (
    !Number.isFinite(height)
    || !Number.isFinite(weight)
    || height <= 0
    || weight <= 0
  ) {
    throw new Error('Arguments must be positive finite numbers');
  }
  
  const index: number = weight / (height / 100) ** 2;

  switch (true) {
    case index < 16:
      return 'Underweight (Severe thinness)';
    case index < 17:
      return 'Underweight (Moderate thinness)';
    case index < 18.5:
      return 'Underweight (Mild thinness)';
    case index < 25:
      return 'Normal range';
    case index < 30:
      return 'Overweight (Pre-obese)';
    case index < 35:
      return 'Obese (Class I)';
    case index < 40:
      return 'Obese (Class II)';
    case index >= 40:
      return 'Obese (Class III)';
    default:
      throw new Error('Something went wrong');
  }
};

try {
  if (process.argv.length < 4) {
    throw new Error('Not enough arguments');
  } else if (process.argv.length > 4) {
    throw new Error('Too many arguments');
  } else {
    const args = validateArgs(process.argv);
    console.log(calculateBmi(args[0], args[1]));
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
}