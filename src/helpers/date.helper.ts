export const formatDateToAPI = (date: Date): string => {
  if (!date) return "";
  let dateFormatted = new Date(date);
  const year = dateFormatted.getFullYear();
  const month = String(dateFormatted.getMonth() + 1).padStart(2, "0");
  const day = String(dateFormatted.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
