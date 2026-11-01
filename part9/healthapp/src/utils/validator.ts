export const validateArgs = (args: string[]): number[] => {
  const isNumbers: boolean = args.slice(2).every(arg => arg.trim() !== '' && Number.isFinite(Number(arg)));
  if (isNumbers) {
    return args.slice(2).map(arg => Number(arg));
  } else {
    throw new Error('Only finite numbers are allowed');
  }
};