export const getElapsedTime = (timestamp: string | null | undefined): string => {
  if (!timestamp) return "";

  const now = new Date();
  const past = new Date(timestamp);

  const diffMs = now.getTime() - past.getTime();
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const dayNames = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  const monthNames = [
    "Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
    "Jul", "Aout", "Sep", "Oct", "Nov", "Dec"
  ];

  // Aujourd'hui → afficher l'heure exacte
  if (
    now.getFullYear() === past.getFullYear() &&
    now.getMonth() === past.getMonth() &&
    now.getDate() === past.getDate()
  ) {
    const hours = past.getHours().toString().padStart(2, "0");
    const minutes = past.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Hier → "Hier"
  if (diffD === 1) return "Hier";

  // Moins de 4 jours → jour de la semaine
  if (diffD <= 4) return dayNames[past.getDay()];

  // Moins de 4 mois → "Mois jour" (ex: Aout 14)
  const diffM = (now.getFullYear() - past.getFullYear()) * 12 + (now.getMonth() - past.getMonth());
  if (diffM < 4) return `${monthNames[past.getMonth()]} ${past.getDate()}`;

  // Plus de 4 mois → "Mois jour, année" (ex: Fev 15, 2025)
  return `${monthNames[past.getMonth()]} ${past.getDate()}, ${past.getFullYear()}`;
};