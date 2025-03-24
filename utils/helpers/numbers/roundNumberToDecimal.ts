/**
 * Helper function to round a number to the nearest significant decimal
 * @param num 0.0007934564002
 * @returns 0.000793
 */
export const roundNumberToDecimal = (num: number) => {
  if (num >= 1 || num === 0) return num;

  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(num))));
  return (Math.round((num / magnitude) * 10) / 10) * magnitude;
};
