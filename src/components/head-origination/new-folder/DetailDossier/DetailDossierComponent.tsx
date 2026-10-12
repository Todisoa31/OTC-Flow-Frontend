"use client";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import ShowIcon from "@/assets/icons/ShowIcon";
import React, { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import { DossierDetailsType, FileType } from "@/types/dossierType";
import isEqual from "lodash.isequal";
import { getRecordByIdApi } from "@/api/recordInstallerApi";
import { getFile } from "@/utils/getFile";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import AffectationModal from "../AffectationModal";
import { useRecords } from "@/providers/CreateRecordProvider";
import { useTeamMember } from "@/providers/TeamProvider";
import TitleWithBack from "@/components/TitleWithBack";
import { useTitle } from "@/providers/TitleProvider";
import { STATUSES_OPTIONS } from "@/constants/records";

const DetailDossierComponent = () => {
  const { setTitle } = useTitle();
  const { detailDossier, setDetailDossier } = useRecords();
  const { controlAssign } = useTeamMember();
  const [showModalAffectation, setShowModalAffectation] = useState<boolean>(false);
  const [control, setControl] = useState<string>("controlleur");
  const [isControlStatus, setIsControlStatus] = useState<boolean>(false);
  
  const params = useParams();
  const idDossier = params.id ? parseInt(params.id as string) : null;

  const formatDossier = (raw: any): DossierDetailsType => {
    return {
      id: raw.id,
      name: raw.name,
      type_dossier: raw.type_dossier,
      created_at: raw.created_at,
      installateur: {
        id: raw.installateur?.id,
        firstname: raw.installateur?.firstname,
        lastname: raw.installateur?.lastname,
        photo_profil: raw.installateur?.photo_profil ?? null,
        is_connected: raw.installateur?.is_connected,
        status: raw.installateur?.status,
      },
      processed_by: {
        id: raw.processed_by?.id,
        firstname: raw.processed_by?.firstname,
        lastname: raw.processed_by?.lastname,
        photo_profil: raw.processed_by?.photo_profil ?? null,
        is_connected: raw.processed_by?.is_connected,
        status: raw.processed_by?.status,
      },
      files: (raw.files || []).map((file: any) => ({
        id: file.id,
        type_file: file.type_file,
        file: file.file,
        title_file: file.title_file,
        name: file.name,
      })),
      status: raw.status || {}, // Ajout du champ status
      controlleur_conformite: raw.controlleur_conformite || {}
    };
  };
  const getDetailDossier = async () => {
    try {
      if (!idDossier) return;
      const response = await getRecordByIdApi(idDossier);
      const dossier = formatDossier(response);
      setDetailDossier((prev) => {
        const isSame = isEqual(prev, dossier);
        return isSame ? prev : dossier;
      });
      if (!response) return;
    } catch (error) {}
  };
  const formatDateFr = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const forceDownload = async (fileUrl: string, filename: string) => {
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
  };

  const downloadAllAsZip = async (
    files: FileType[],
    zipName = "documents.zip"
  ) => {
    const zip = new JSZip();

    for (const file of files) {
      try {
        const fileUrl = getFile(file.file);
        const response = await fetch(fileUrl);
        const blob = await response.blob();

        // Ajoute chaque fichier dans le zip
        zip.file(file.name, blob);
      } catch (error) {
        console.error(
          `Erreur lors du téléchargement du fichier ${file.name} :`,
          error
        );
      }
    }

    // Génère le zip
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, zipName);
    });
  };
  useEffect(() => {
    setTitle(<TitleWithBack title={"Répartition Charge"} />);
  },[])

  useEffect(() => {
    getDetailDossier();
  }, [idDossier, detailDossier, controlAssign]);

  useEffect(() => {
    setIsControlStatus(
      STATUSES_OPTIONS.some(option => option.value === detailDossier?.status?.code) &&
      (detailDossier?.status?.code !== "approved" || detailDossier?.status?.title === "Validé")
    );
  },[detailDossier])

  useEffect(() => {
    setControl(isControlStatus ? "controlleur" : "coffrac");
  }, [isControlStatus]);

  return (
    <div className="self-stretch self-stretch inline-flex flex-col justify-start items-start gap-7 w-full">
      <div className="self-stretch p-7 bg-white/40 shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex flex-col justify-start items-start gap-5">
        <div className="self-stretch inline-flex justify-center items-center gap-5">
          <div className="flex-1 flex justify-start items-center gap-2.5">
            <div className="justify-start text-gray-500 text-2xl font-bold">
              {detailDossier?.name}
            </div>
          </div>
          <div className="h-10 px-5 bg-primary-blue rounded-[10px] shadow-[0px_10px_40px_0px_rgba(97,161,191,0.70)] flex justify-start items-center gap-2.5">
            <DownloadIcon fill="#fff" />
            <button onClick={()=>{setShowModalAffectation(true)}} className="justify-start text-white text-xs font-bold leading-none ">
              Affecter
            </button>
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <div className="self-stretch h-16 inline-flex justify-start items-center gap-5">
            <div className="flex-1 self-stretch p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
              <div className="justify-start text-slate-600 text-sm font-medium">
                Type de dossier :
              </div>
              <div className="justify-start text-gray-900 text-xs font-bold leading-none">
                {detailDossier?.type_dossier || "N/A"}
              </div>
            </div>
            <div className="flex-1 self-stretch p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
              <div className="justify-start text-slate-600 text-sm font-medium">
                Référence :
              </div>
              <div className="justify-start text-gray-900 text-xs font-bold leading-none">
                {detailDossier?.id || "N/A"}
              </div>
            </div>
            <div className="flex-1 self-stretch p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
              <div className="justify-start text-slate-600 text-sm font-medium">
                Date de soumission :
              </div>
              <div className="justify-start text-gray-900 text-xs font-bold leading-none">
                {detailDossier?.created_at
                  ? formatDateFr(detailDossier.created_at)
                  : "N/A"}
              </div>
            </div>
            <div className="hidden flex-1 self-stretch p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex justify-start items-center gap-2.5">
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
                <div className="justify-start text-slate-600 text-xs font-medium">
                  Contrat :
                </div>
                <div className="justify-start text-gray-900 text-xs font-bold leading-none">
                  -
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-900 rounded-[5px] flex justify-center items-center gap-2.5">
                <ShowIcon fill="#fff" />
              </div>
            </div>
          </div>
          <div className="self-stretch h-16 inline-flex justify-start items-center gap-5">
            <div className="flex-1 p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex justify-start items-center gap-2.5">
              <img
                className="w-8 h-8 rounded-[5px]"
                src={
                  detailDossier?.installateur.photo_profil != null
                    ? getFile(detailDossier?.installateur.photo_profil)
                    : "https://placehold.co/32x32"
                }
              />
              <div className="inline-flex flex-col justify-start items-start gap-2.5">
                <div className="justify-start text-slate-600 text-sm font-medium leading-none">
                  Installateur{" "}
                </div>
                <div className="justify-start text-gray-900 text-sm font-bold leading-none">
                  {detailDossier?.installateur.firstname}{" "}
                  {detailDossier?.installateur.lastname}
                </div>
              </div>
            </div>
            <div className="flex-1 p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] flex justify-start items-center gap-2.5">
              <img
                className="w-8 h-8 rounded-[5px]"
                src={
                  detailDossier?.processed_by.photo_profil != null
                    ? getFile(detailDossier?.processed_by.photo_profil)
                    : "https://placehold.co/32x32"
                }
              />
              <div className="inline-flex flex-col justify-start items-start gap-2.5">
                <div className="justify-start text-slate-600 text-sm font-medium leading-none">
                  {control === 'controlleur' ? 'Contrôleur assigné' : 'Contrôleur conformité'}
                </div>
                <div className="justify-start text-gray-900 text-sm font-bold leading-none">                  
                  {control === 'controlleur' ? detailDossier?.processed_by?.firstname : detailDossier?.controlleur_conformite?.firstname}{" "}
                  {control === 'controlleur' ? detailDossier?.processed_by?.lastname : detailDossier?.controlleur_conformite?.lastname}{" "}
                </div>
              </div>
            </div>
            <div className="flex-1 self-stretch p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5">
              <div className="justify-start text-slate-600 text-sm font-medium">
                Date d’affectation
              </div>
              <div className="justify-start text-gray-900 text-xs font-bold leading-none">
                {detailDossier?.created_at
                  ? formatDateFr(detailDossier.created_at)
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-5">
        <div className="self-stretch px-7 inline-flex justify-start items-center gap-5">
          <div className="flex-1 flex justify-start items-center gap-2.5">
            <div className="justify-start text-gray-500 text-2xl font-bold">
              Documents
            </div>
          </div>
          <button
            onClick={() => {
              if (!detailDossier?.files || detailDossier.files.length === 0) {
                alert("Aucun document à télécharger");
                return;
              }
              downloadAllAsZip(detailDossier.files, `${detailDossier.name}.zip`);
            }}
            className="h-10 px-5 bg-gray-900 rounded-[10px] shadow-[0px_10px_40px_0px_rgba(0,0,0,0.40)] flex justify-start items-center gap-2.5"
          >
            <DownloadIcon fill="#FFF" />
            <div className="justify-start text-white text-xs font-bold leading-none">
              Télécharger les documents
            </div>
          </button>
        </div>
        <div className="self-stretch grid grid-cols-2 gap-7 px-7">
          {detailDossier?.files.map((file, index) => (
            <div
              key={index}
              className="flex-1 p-3.5 bg-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-white/70 backdrop-blur-[10px] inline-flex flex-col justify-center items-start gap-2.5"
            >
              <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-start text-gray-900 text-sm font-bold leading-none">
                  {file.title_file}
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
                <div className="inline-flex justify-start items-center gap-2.5">
                  <button
                    onClick={() => forceDownload(getFile(file.file), file.name)}
                  >
                    <DownloadIcon />
                  </button>
                  <div className="justify-center text-slate-600 text-xs font-bold leading-none">
                    {file.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {
        idDossier!=null &&
        <AffectationModal
          showModalAffectation={showModalAffectation}
          setShowModalAffectation={setShowModalAffectation}
          dossier_id={[idDossier]}
          control={control}
        />
      }
    </div>
  );
};

export default DetailDossierComponent;
