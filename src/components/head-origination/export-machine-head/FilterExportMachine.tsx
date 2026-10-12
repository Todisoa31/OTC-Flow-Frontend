"use client";

import React, { useEffect, useState } from "react";
import Select from "../../inputs/Select";
import { SelectValue } from "@/types/inputType";
import { TYPE_DOSSIER } from "@/constants/records";
import { useFilter } from "@/providers/FilterProvider";
import Input from "../../inputs/Input";
import { getUsersV2 } from "@/api/user";
import isEqual from "lodash.isequal";
import { UserTypeOutput } from "@/types/userType";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import DateRangePicker from "../../inputs/DateRangePicker";
import { formatToDDMMYYYY } from "@/utils/date";
import { convertAllJobsToSingleCsv, downloadCSV } from "@/utils/csv";
import Button from "../../inputs/Button";
import { useTeamMember } from "@/providers/TeamProvider";
import { getFile } from "@/utils/getFile";
import { FolderExportFinal } from "@/types/repartitionChargeType";
import JSZip from "jszip";
import axios from "axios";
import saveAs from "file-saver";
import { ROLE_INSTALLER } from "@/constants/userConst";
import { getExportMachineApiV2 } from "@/api/exportMachineApi";

const downloadZipFromFolders = async (
  folderExport: FolderExportFinal,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setLoading(true);
  const mainZip = new JSZip();

  for (const folder of folderExport.listFolder) {
    const folderZip = new JSZip();

    const allFiles = [...folder.files, ...(folder.other_file || [])];
    for (const file of allFiles) {
      try {
        const response = await axios.get(
          file.content_type !== "text/csv" ? getFile(file.file) : file.file,
          { responseType: "blob" }
        );

        // 🔁 Tous les fichiers sont ajoutés à la racine du sous-zip
        folderZip.file(file.name, response.data);
      } catch (err) {
        console.error("Erreur lors du téléchargement du fichier :", file.name, err);
      }
    }

    const folderBlob = await folderZip.generateAsync({ type: "blob" });

    const zipName = `${folder.installateur}_${folder.nameDossier}_${folder.controlleur}.zip`;
    mainZip.file(zipName, folderBlob);
  }

  // 🕒 Nom du fichier export final
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const datePart = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
  const timePart = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
  const finalZipName = `export_${datePart}_${timePart}_${folderExport.typeFormulaire}.zip`;

  const finalBlob = await mainZip.generateAsync({ type: "blob" });
  saveAs(finalBlob, finalZipName);
  setLoading(false);
};

const FilterExportMachine = () => {
  const { filters, setFilters } = useFilter();
  const { listFileExportMachine, exportFiles } = useTeamMember();
  const [searchText, setSearchText] = useState<string>("");

  const [installateurOption, setInstallateurOption] = useState<
    { value: number; label: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingExportMachine, setLoadingExportMachine] = useState(false);

  const handleChangeFilters = (key: string, value: SelectValue) => {
    if (typeof value === "string" || "number" === typeof value) {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        [key]: value
      }));
    }
  };
  const handleChangeSearchText = (value: string) => {
    setSearchText(value);
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search_text: value
    }));
  };

  const handleDownloadDocuments = async () => {
    try {
      setLoadingExportMachine(true);
      const response = await getExportMachineApiV2({
        status: "fully_validated",
        page: filters.page,
        per_page: filters.per_page,
        type_dossier: (filters.type_dossier as any) || "RES_EC_104"
      });

      console.log("::>> response", response);

      if (response) {
        const csv = convertAllJobsToSingleCsv(response);
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:]/g, "-").split(".")[0]; // YYYY-MM-DDTHH-mm-ss
        const filename = `export_machine-${timestamp}.csv`;
        downloadCSV(csv, filename);
      }
      exportFiles();
    } catch (error) {
      console.error("Error downloading documents:", error);
    } finally {
      setLoadingExportMachine(false);
    }
  };

  const handleDateChange = (newDates: { start_date: string; end_date: string }) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      start_date: formatToDDMMYYYY(newDates.start_date),
      end_date: formatToDDMMYYYY(newDates.end_date)
    }));
  };

  const handleGetTeamReferent = async () => {
    try {
      const response = await getUsersV2({ role: ROLE_INSTALLER });
      const user = response.users;
      const itemsPage: { value: number; label: string; image: string }[] = user.map(
        (item: UserTypeOutput) => ({
          value: item.id,
          label: `${item.firstname} ${item.lastname}`,
          image: item.photo_profil ? getFile(item.photo_profil) : "/images/usProfil.jpg"
        })
      );

      setInstallateurOption((prev) => {
        // Comparer rapidement la longueur et les IDs (ou stringify si petit)
        const same = isEqual(prev, itemsPage);

        if (!same) {
          return itemsPage;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleGetTeamReferent();
  }, [installateurOption]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5">
      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <div className="flex-1 min-h-10 h-auto px-3.5 bg-white rounded-[10px] flex justify-start items-center gap-2.5">
          <div className="justify-start text-dark-blue text-xs font-bold whitespace-nowrap">
            Installateur :
          </div>
          <Select
            multiple={true}
            search={false}
            value={
              filters.installateur
                ? String(filters.installateur).split(",").map(Number) // string[] -> number[]
                : []
            }
            onChange={(value) => {
              const selectedNumbers = (value as string[]).map(Number);
              handleChangeFilters("installateur", selectedNumbers.join(","));
            }}
            options={installateurOption}
            placeholder="Aucun"
            width="w-[95%]"
            className="bg-transparent w-full"
          />
        </div>
        <div className="flex-1 h-10 px-3.5 bg-white rounded-[10px] flex justify-start items-center gap-2.5">
          <div className="justify-start text-dark-blue text-xs font-bold whitespace-nowrap">
            Beneficiaire :
          </div>
          <Select
            multiple={false}
            search={false}
            value={filters.beneficiaire as SelectValue}
            onChange={(value) => handleChangeFilters("beneficiaire", value)}
            options={installateurOption}
            placeholder="Bénéficiaire"
            width="w-full"
            className="bg-transparent w-full"
          />
        </div>
        <div className="w-48 h-10 flex justify-start items-center gap-2.5">
          <Select
            multiple={false}
            search={false}
            value={filters.type_dossier as SelectValue}
            onChange={(value) => handleChangeFilters("type_dossier", value)}
            options={TYPE_DOSSIER}
          />
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <div className="flex-1 h-10 flex justify-start items-center gap-2.5">
          <Input
            placeholder="Rechercher un dossier"
            width=""
            height="h-[40px]"
            value={searchText}
            onChange={(value) => handleChangeSearchText(value)}
            className="text-xs text-black font-medium grow"
            rightIcon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z"
                  fill="#101828"
                />
              </svg>
            }
          />
        </div>
        <div className="flex-1 h-10 px-3.5 bg-white rounded-[10px] flex justify-start items-center gap-3.5">
          <DateRangePicker onChange={handleDateChange} />
        </div>

        <Button
          className={`${
            listFileExportMachine.listFolder.length < 1 ? "bg-gray-300" : "bg-primary-blue"
          }`}
          onClick={() => downloadZipFromFolders(listFileExportMachine, setLoading)}
          iconLeft={<DownloadIcon fill="#fff" />}
          label={loading ? "Récuperation des docs ..." : "Télécharger les documents"}
          loading={loading}
          disabled={listFileExportMachine.listFolder.length < 1}
        />

        <Button
          className={`${
            listFileExportMachine.listFolder.length < 1 ? "bg-gray-300" : "bg-primary-blue"
          }`}
          onClick={handleDownloadDocuments}
          iconLeft={<DownloadIcon fill="#fff" />}
          label={"Télécharger l'export machine"}
          loading={loadingExportMachine}
          disabled={listFileExportMachine.listFolder.length < 1}
        />
      </div>
    </div>
  );
};

export default FilterExportMachine;
