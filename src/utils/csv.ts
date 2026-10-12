'use client';

import { keyToField } from "@/constants/records";
import { ApiResponse, ApiRow } from "@/types/recordType";

export const convertToCSV = (data: object[]): string => {
    if (!data || data.length === 0) return '';

    // Extract headers (keys of the first object)
    const headers = Object.keys(data[0]);

    // Map the data to CSV rows
    const rows = data.map((row) =>
        headers.map((header) => `"${(row as any)[header] || ''}"`).join(',')
    );

    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
};

export const downloadCSV = (csv: string, filename: string) => {
    if (typeof window !== "undefined") {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const convertToFileCSV = (csv: string, filename: string) => {
    if (typeof window !== "undefined") {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        return link;
    }
};

type JobRecord = Record<string, Record<string, any>[]>;

export const convertAllJobsToSingleCsv = (data: JobRecord): string  => {
  const allSections: string[] = [];

  for (const jobId in data) {
    const records = data[jobId];
    if (!records.length) continue;

    const headers = Object.keys(records[0]).filter((key) => key !== "dossier");

    const section: string[] = [];
    section.push(jobId); // Titre du job
    section.push(headers.join(','));

    for (const record of records) {
      const row = headers.map((key) => {
        const value = record[key];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      section.push(row.join(','));
    }

    allSections.push(section.join('\n')); // Ajouter un bloc complet
  }

  // Séparation entre les jobs par une ligne vide
  return allSections.join('\n\n');
}


export function convertApiToCsv(apiResponse: ApiResponse): string {
  const rows = apiResponse.data;

  if (!rows || rows.length === 0) {
    return "";
  }

  // Colonnes visibles (labels)
  const headers = Object.keys(keyToField);

  // Première ligne = en-têtes CSV
  const csvRows: string[] = [headers.join(";")];

  // Chaque ligne de data
  for (const row of rows) {
    const values = headers.map((label) => {
      const key = keyToField[label] as keyof ApiRow;
      let val = row[key] ?? "";

      // Gérer les chaînes : on échappe les guillemets
      if (typeof val === "string") {
        val = `"${val.replace(/"/g, '""')}"`;
      }

      return val;
    });

    csvRows.push(values.join(";"));
  }

  return csvRows.join("\n");
}