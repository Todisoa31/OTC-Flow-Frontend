'use client';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FolderFileType, FolderOutputType } from "@/types/folderType";
import { getFile } from "./getFile";
import { DossierType, FileType } from "@/types/repartitionChargeType";

export const downloadAllAsZip = async (
  files: FolderFileType[],
  zipName = "documents.zip"
) => {
  const zip = new JSZip();

  for (const file of files) {
    try {
      const fileUrl = getFile(file.file);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      zip.file(file.name, blob);
    } catch (error) {
      console.error(`Erreur lors du téléchargement du fichier ${file.name} :`, error);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipName);
};

export const forceDownload = async (fileUrl: string, filename: string) => {
  if (typeof window !== "undefined") {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur de téléchargement :", error);
    }
  } else {
    // Optionnel : log côté serveur
    // console.warn('forceDownload appelé côté serveur');
  }
};

export const formatCSVFile = (contentCSV: string, dossier: DossierType) => {
  const csvBlob = new Blob([contentCSV], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const csvFileObject = new File([csvBlob], `export-machine_${dossier.name}.csv`, {
    type: "text/csv",
  });

  const csvFile: FileType = {
    id: -1,
    name: csvFileObject.name,
    size: csvFileObject.size,
    content_type: "text/csv",
    file: csvUrl,
    type_file: "csv_export",
    comments: [],
    status: "generated",
    status_display: "Fichier généré",
    job_id: "job-global-csv",
    title_file: `${dossier.name}_${dossier.installateur}`,
    corrections: [],
  };
  return csvFile;
}



export const handleDownloads = async (
  folder: FolderOutputType,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);

  try {
    const { name, files = [], other_file = [] } = folder;
    const zip = new JSZip();
    const dateExport = new Date().toISOString().split("T")[0];
    const zipName = `${name}_${dateExport}.zip`;

    const addFilesToZip = async (
      fileList: FolderFileType[],
      subFolder: string
    ) => {
      const folderInZip = zip.folder(subFolder);
      for (const file of fileList) {
        const response = await fetch(getFile(file.file));
        const blob = await response.blob();
        folderInZip?.file(file.name, blob);
      }
    };

    await addFilesToZip(files, "documents");
    await addFilesToZip(other_file, "autres");

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, zipName);
  } catch (error) {
    console.error("Erreur pendant le téléchargement ZIP :", error);
    // tu peux ajouter un toast ici si besoin
  } finally {
    setLoading(false); // ✅ Stoppe le loader
  }
};