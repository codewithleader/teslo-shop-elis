/**
 * It takes a number and returns a string
 * @param {number} value - The number to format.
 * @returns The return value is a string like this: $2,500.00.
 */
export const format = (value: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value); // $2,500.00
};
