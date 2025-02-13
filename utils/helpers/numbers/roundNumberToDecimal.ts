export const roundNumberToDecimal = (num: number) => {
  if (num >= 1 || num === 0) return num;

  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(num))));
  return (Math.round((num / magnitude) * 10) / 10) * magnitude;
};
