export const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "summer";
  if (m >= 6 && m <= 9) return "monsoon";
  if (m >= 10 && m <= 11) return "autumn";
  return "winter";
};
