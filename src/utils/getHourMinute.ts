export const GetHourMinute = (timestamp: string): string => {
  // 2025-05-30T10:07:00Z
  const date = new Date(timestamp);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // mois commence à 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}


export function formatSessionDuration(duration: string): string {
  const [hoursStr, minutesStr, secondsStr] = duration.split(":");
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  const totalMinutes = hours * 60 + minutes;

  const days = Math.floor(totalMinutes / 1440); // 1440 min = 1 day
  const remainingMinutes = totalMinutes % 1440;
  const displayHours = Math.floor(remainingMinutes / 60);
  const displayMinutes = remainingMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}j`);
  if (displayHours > 0) parts.push(`${displayHours}h`);
  if (displayMinutes > 0) parts.push(`${displayMinutes}min`);

  return parts.join(" ") || "0min";
}


export function formatFrenchDate(isoString?: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  return date.toLocaleDateString('fr-FR', options);
  // ➜ "25 juin 2025"
}


export function formatHoursSeconde(value: number) {
  const totalSeconds = Math.floor(value);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);

  return parts.join(" ") || "0min";
}
