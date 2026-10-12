export const getFile = (url: string): string => {
  if (!url) return '';

  // Si c’est déjà une URL complète, on la retourne telle quelle
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Supprime les "/" inutiles pour éviter les "//"
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || '';
  const path = url.replace(/^\/+/, '');

  return `${base}/${path}`;
};