export const formatCurrency = (amount: number) => {
  if (!amount && amount !== 0) return '\u20B90';
  return '\u20B9' + Math.round(amount).toLocaleString('en-IN');
};
