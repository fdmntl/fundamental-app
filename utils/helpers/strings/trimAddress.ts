/**
 * Helper function to trim an address to a readable format
 * @param address 0x1234567890abcdef
 * @param startLength 12
 * @returns 0x1234...cdef
 */
export const trimAddress = (address: string, startLength = 12) => {
  if (address.length <= startLength + 4) {
    return address;
  }
  const start = address.substring(0, startLength);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};
