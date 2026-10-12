import { useEffect, useState } from "react";
import CertificatedOfhonor from "./pageSwitcher/certificateOfHonor";
import Estimate from "./pageSwitcher/estimate";
import Facture from "./pageSwitcher/facture";
import InstallationCertificate from "./pageSwitcher/installationCertificate";
import { UseReferentFileStore } from "@/stores/ReferentFileStore";
import AutresDocuments from "./pageSwitcher/otherFiles";
import { getRecordByIdApi } from "@/api/recordInstallerApi";
import { useTitle } from "@/providers/TitleProvider";
import { MenuSwitcherType } from "@/types/general";
import { getExportMachineDataApi } from "@/api/recordControllerApi";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";
import CenterSpinner from "../loader/CenterSpinner";
import AttestationDesembouage from "./pageSwitcher/AttestationDesembouage";
import CadreContribution from "./pageSwitcher/CadreContribution";
import Immatriculation from "./pageSwitcher/Immatriculation";
import Precarite from "./pageSwitcher/Precarite";

type Props = {
  folderId: Number;
  fileId: Number;
};
const MenuSwitcher = (props: Props) => {
  const { folderId, fileId } = props;
  const { activeMenuSwitcher, setActiveMenuSwitcher, updateDetail } = UseReferentFileStore();
  const { setMenuSwitcher, setFileData, fileData } = useStatusDosserProvider();

  const { setTitle } = useTitle();
  // const [menuFile, setMenuFile] = useState<MenuSwitcherType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [menuItem, setMenuItem] = useState<MenuSwitcherType[]>([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [typeDossier, setTypeDossier] = useState<string>("");
  const getFolderDetail = async () => {
    if (folderId) {
      try {
        const res = await getRecordByIdApi(Number(folderId));
        setTitle(`Dossier : ${res?.name}`);
        setTypeDossier(res?.type_dossier ?? "");

        // Stocker les fichiers images
        setFileData((prev) => ({
          ...prev,
          other_file: res?.other_file ?? [],
        }));
        const customOrder = [
          "file_devis",
          "file_facture",
          "file_attestation",
          "file_attestation_pose",
          "file_attestation_desembouage",
          "file_cadre_contribution"
        ]
        
        
        if (res?.files) {
          const menus: MenuSwitcherType[] = res.files.map((item: any) => ({
            title: item.title_file,
            code: item.type_file,
            file_id: item.id,
          }));
          // Trie selon l'ordre personnalisé
          menus.sort((a, b) => {
            return customOrder.indexOf(a.code) - customOrder.indexOf(b.code);
          });
          
          setMenuSwitcher(menus);
          
          if (fileId) {
            const found = menus.find((f) => f.file_id === Number(fileId));
            if (found) {
              setActiveMenuSwitcher(found);
            }
          }
          if(res?.other_file && res?.other_file.length > 0) {
            setMenuItem([
              {
                title: res.other_file[0].title_file ?? "Autres documents",
                code: res.other_file[0].type_file ?? "images",
                file_id: res.other_file[0].id,
              },
            ]);
          }
        } else if (fileId === 0) {
          setActiveMenuSwitcher({
            code: "images",
            title: "Images",
            file_id: 0,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getFile = async (file_id: number) => {
    if (!activeMenuSwitcher || activeMenuSwitcher.code === "images") return;

    setLoading(true);
    try {
      const res = await getExportMachineDataApi(file_id);

      switch (activeMenuSwitcher.code) {
        case "file_attestation":
          setFileData((prev) => ({
            ...prev,
            file_attestation: res?.file_attestation,
            status: res.status,
          }));
          break;

        case "file_attestation_pose":
          setFileData((prev) => ({
            ...prev,
            file_attestation_pose: res?.file_attestation_pose,
            status: res.status,
          }));
          break;

        case "file_facture":
          setFileData((prev) => ({
            ...prev,
            file_facture: res?.file_facture,
            status: res.status,
          }));
          break;

        case "file_devis":
          setFileData((prev) => ({
            ...prev,
            file_devis: res?.file_devis,
            status: res.status,
          }));
          break;
        case "file_attestation_desembouage":
          setFileData((prev) => ({
            ...prev,
            file_attestation_desembouage: res?.file_attestation_desembouage,
            status: res.status,
          }));
          break;

        case "file_cadre_contribution":
          setFileData((prev) => ({
            ...prev,
            file_cadre_contribution: res?.file_cadre_contribution,
            status: res.status,
          }));
          break;
        case "file_immatriculation":
          setFileData((prev) => ({
            ...prev,
            file_immatriculation: res?.file_immatriculation,
            status: res.status,
          }));
          break;
        case "file_precarite":
          setFileData((prev) => ({
            ...prev,
            file_precarite: res?.file_precarite,
            status: res.status,
          }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsUpdated(false);
    }
  };

  useEffect(() => {
    getFolderDetail();
  }, []);

  useEffect(() => {
    if (!activeMenuSwitcher) return;
    if (
      activeMenuSwitcher.code !== "images" &&
      fileId &&
      !isNaN(Number(fileId))
    ) {
      getFile(Number(fileId));
    }
  }, [fileId, updateDetail, activeMenuSwitcher, isUpdated]);

  useEffect(() => {
    if (menuItem.length > 0) {
     setMenuSwitcher(prev => [...prev, menuItem[0]]);
    }    
  },[menuItem])



  if (!activeMenuSwitcher) return null;
  if (loading) return <CenterSpinner />

  switch (activeMenuSwitcher.code) {
    case "file_attestation":
      if (!fileData.file_attestation) return null;
      return (
        <CertificatedOfhonor
          data={fileData.file_attestation}
          status={fileData.status}
          typeDossier={typeDossier}
        />
      );

    case "file_attestation_pose":
      return (
        <InstallationCertificate
          data={fileData.file_attestation_pose}
          status={fileData.status}
          typeDossier={typeDossier}
        />
      );

    case "file_facture":
      return <Facture data={fileData.file_facture} status={fileData.status} typeDossier={typeDossier} setIsUpdated={setIsUpdated}/>;

    case "file_devis":
      return <Estimate devis={fileData.file_devis} status={fileData.status} typeDossier={typeDossier} setIsUpdated={setIsUpdated}/>;

    case "file_attestation_desembouage":
      return <AttestationDesembouage data={fileData.file_attestation_desembouage} status={fileData.status} typeDossier={typeDossier}/>;
    
    case "file_cadre_contribution":
      return <CadreContribution data={fileData.file_cadre_contribution} status={fileData.status} typeDossier={typeDossier}/>;

    case "file_immatriculation":
      return <Immatriculation data={fileData.file_immatriculation} status={fileData.status} typeDossier={typeDossier} setIsUpdated={setIsUpdated} isUpdated={isUpdated}/>;
    
    case "file_precarite":
      return <Precarite data={fileData.file_precarite} status={fileData.status} typeDossier={typeDossier}/>;
      
    case "other_file":      
      return <AutresDocuments docs={fileData.other_file} />;
    
    default:
      return null;
  }
};

export default MenuSwitcher;
