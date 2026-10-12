import { ExtractedData, ExtractedDataItem } from "@/types/recordType";

export function stringToSlug(str: string): string {
    return str
        .toLowerCase()                      // Convert the string to lowercase
        .trim()                              // Remove leading and trailing spaces
        .replace(/\s+/g, '-')                // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '')            // Remove non-alphanumeric characters (except hyphens)
        .replace(/\-\-+/g, '-')              // Replace multiple hyphens with a single hyphen
        .replace(/^-+/, '')                  // Remove leading hyphen
        .replace(/-+$/, '');                 // Remove trailing hyphen
}

export function extractDataItems(data: ExtractedData): ExtractedDataItem[] {
    const result: ExtractedDataItem[] = [];

    // Parcours de chaque clé dans l'objet data
    for (const key in data) {
        if (Array.isArray(data[key as keyof ExtractedData])) {
            // Si la clé contient un tableau, on ajoute les objets au tableau result
            result.push(...(data[key as keyof ExtractedData] || []));
        }
    }

    return result;
}