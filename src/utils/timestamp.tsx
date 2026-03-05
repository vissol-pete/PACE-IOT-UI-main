export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date
    .toLocaleString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour format with AM/PM
    })
    .replace(",", ""); // Remove the comma between date and time
};
