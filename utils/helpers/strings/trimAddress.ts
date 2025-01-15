export const trimAddress = (address: string, startLength = 12) => {
  if (address.length <= startLength + 4) {
    return address;
  }
  const start = address.substring(0, startLength);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};
