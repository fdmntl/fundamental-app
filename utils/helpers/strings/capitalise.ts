/**
 * Helper function to capitalise the first letter of a string
 * @param string capitalise
 * @returns Capitalise
 */
export const capitalise = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
