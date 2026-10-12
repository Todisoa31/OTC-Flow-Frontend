export function convertDateToString(date: Date, formatType: 'ISO' | 'Locale' | 'Custom' = 'Custom'): string {
    if (formatType === 'ISO') {
        return date.toISOString(); // "2025-03-21T10:30:00.000Z"
    }

    if (formatType === 'Locale') {
        return date.toLocaleString(); // Example output: "3/21/2025, 10:30:00 AM"
    }

    // Custom format: "DD-MM-YYYY HH:MM:SS"
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}-${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
}

/*
    * Converts a date string from ISO format to a custom format "DD-MM-YYYY HH:MM".
    * @param {string} dateTime - The date string in ISO format.
    * @returns {string} - The formatted date string in "DD-MM-YYYY HH:MM" format.
    */

export const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/*
    * Converts a date string from YYYY-MM-DD format to DD/MM/YYYY format.
    * @param {string} date - The date string in YYYY-MM-DD format.
    * @returns {string} - The formatted date string in DD/MM/YYYY format.
    */
export const formatToDDMMYYYY = (date: string) => {
    if(!date) return '';
    const [year, month, day] = date.split('-'); // Split the default YYYY-MM-DD format
    return `${day}/${month}/${year}`; // Rearrange to DD/MM/YYYY
};



export function formatIsoDateToFrenchLabel(isoDate: string): string {
  if (!isoDate) return '';

  const date = new Date(isoDate);

  // Vérification de validité
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}