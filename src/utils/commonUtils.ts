'use client';
export function addQueryToUrl(
  baseUrl: string,
  query: Record<string, string | number | boolean | string[] | undefined | null>,
  replace?: Record<string, string>[]
): string {
  const params = new URLSearchParams();

  for (const key in query) {
    const rawValue = query[key];

    // 🔁 Remplacement de clé si fourni
    const mappedKey = replace?.find((item) => Object.keys(item)[0] === key)?.[key] || key;

    if (
      rawValue === null ||
      rawValue === undefined ||
      rawValue === ''
    ) {
      continue; // 🔽 on skip les valeurs vides
    }

    if (Array.isArray(rawValue)) {
      // 🔁 Ajoute chaque élément séparément (job_id=val1&job_id=val2...)
      rawValue.forEach((val) => {
        if (val !== undefined && val !== null && val !== '') {
          params.append(mappedKey, String(val));
        }
      });
    } else {
      params.append(mappedKey, String(rawValue));
    }
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}


export function downloadJsonFile(jsonData: any, fileName: string) {
    if (typeof window !== "undefined") {
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
}

export const parseErrorMessage = (error: any, fallback: string) => {
  try {
    const rawError = error?.response?.data?.error;

    // Si c'est une chaîne → retourne directement
    if (typeof rawError === "string") {
      return rawError;
    }

    // Si c'est un objet contenant "error" ou "detail"
    if (typeof rawError === "object" && rawError !== null) {
      return rawError.error || rawError.detail || fallback;
    }

    // Fallback
    return error?.message || fallback;
  } catch {
    return fallback;
  }
};

export function formatIsoToDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Janvier = 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}