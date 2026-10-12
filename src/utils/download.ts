'use client';
import { getFile } from "./getFile";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadAllAsZip = async (files: any[]) => {
  const zip = new JSZip();

  for (const file of files) {
    try {
      const fileUrl = getFile(file.file);
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Détermine un nom sûr pour chaque fichier
      const defaultName = fileUrl.split("/").pop() ?? "document";
      const filename = file.name?.trim() || defaultName;

      zip.file(filename, blob);
    } catch (error) {
      console.error(`Erreur lors du téléchargement du fichier :`, error);
    }
  }

  // Génère et télécharge le zip
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "documents.zip");
  });
};

export const DownloadFile = async (fileUrl: string, filename?: string) => {
  if (!fileUrl) {
    console.error("Aucune URL de fichier fournie.");
    return;
  }

  try {
    const response = await fetch(fileUrl, {
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const name = filename ?? fileUrl.split("/").pop() ?? "document";

    saveAs(blob, name);
  } catch (error) {
    console.error("Erreur de téléchargement :", error);
  }
};