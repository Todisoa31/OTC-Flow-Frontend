import { getControlOverview } from "@/api/control";
import CloseSquareWhiteIcon from "@/assets/icons/CloseSquareWhiteIcon";
import BeingProcessedIcon from "@/assets/icons/dashboard/BeingProcessedIcon";
import NewFolderIcon from "@/assets/icons/dashboard/NewFolderIcon";
import RefusedIcon from "@/assets/icons/dashboard/RefusedIcon";
import ToBeCorrectedIcon from "@/assets/icons/dashboard/ToBeCorrectedIcon";
import ValidatedIcon from "@/assets/icons/dashboard/ValidateIcon";
import { Statuses } from "@/types/recordType";
import { useEffect, useState } from "react";
import Overview, { OverviewItemProps } from "./Overview";

const COFRAC_OVERVIEW_DATA: OverviewItemProps[] = [
  { title: "Validé conforme", code: "approved", count: 0, icon: <NewFolderIcon /> },
  { title: "En cours de contrôle", code: "in_control", count: 0, icon: <BeingProcessedIcon /> },
  { title: "Satisfaisants", code: "satisfactory", count: 0, icon: <ToBeCorrectedIcon /> },
  { title: "Non Satisfaisants", code: "unsatisfactory", count: 0, icon: <ValidatedIcon /> },
  { title: "Demande SAV", code: "service_request", count: 0, icon: <CloseSquareWhiteIcon /> },
  { title: "Validé complet", code: "fully_validated", count: 0, icon: <ValidatedIcon /> },
  { title: "Refusé", code: "refused_control", count: 0, icon: <RefusedIcon /> }
];

const NON_COFRAC_OVERVIEW_DATA: OverviewItemProps[] = [
  { title: "Corrigé", code: "corrected", count: 0, icon: <CloseSquareWhiteIcon /> },
  { title: "En cours de traitement", code: "inprocess", count: 0, icon: <BeingProcessedIcon /> },
  { title: "Validé", code: "approved", count: 0, icon: <ValidatedIcon /> },
  { title: "À corriger", code: "tocorrect", count: 0, icon: <CloseSquareWhiteIcon /> },
  { title: "Refusé", code: "refused", count: 0, icon: <RefusedIcon /> },
  { title: "Dossier déposé", code: "tobeprocessed", count: 0, icon: <CloseSquareWhiteIcon /> }
];

type FolderOverviewProps = {
  hiddens: Statuses[];
  isCofrac?: boolean;
};
function FolderOverview(props: FolderOverviewProps) {
  const { hiddens, isCofrac } = props;
  const [overviewData, setOverviewData] = useState<OverviewItemProps[]>(
    isCofrac ? COFRAC_OVERVIEW_DATA : NON_COFRAC_OVERVIEW_DATA
  );

  const handleGetOverview = async () => {
    try {
      const response = await getControlOverview();
      if (response) {
        setOverviewData((prev) => {
          return prev.map((item) => {
            return {
              ...item,
              count: response?.[item.code as keyof typeof response]?.non_reglementaire || 0
            };
          });
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  };

  const removeHiddens = (data: OverviewItemProps[]) => {
    return data.filter((item) => !hiddens.includes(item.code as Statuses));
  };

  const filteredOverview = removeHiddens(overviewData);

  useEffect(() => {
    handleGetOverview();
  }, []);

  return <Overview data={filteredOverview} label="Vue d’ensemble des dossiers" />;
}

export default FolderOverview;
