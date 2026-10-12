import { useEffect } from "react";
import FolderItem from "./FolderItem";
import { DossierType } from "@/types/repartitionChargeType";
import EmptyRecord from "../../empty/EmptyRecord";
import CenterSpinner from "../../loader/CenterSpinner";
import { useTeamMember } from "@/providers/TeamProvider";

type FolderListProps = {
  listDossier?: DossierType[];
  loading?: boolean;
};

const FolderList = (props: FolderListProps) => {
  const { listDossier, loading } = props;
  const { listFileExportMachine } = useTeamMember();

  useEffect(() => {}, [listDossier, listFileExportMachine]);

  if (!listDossier || !Array.isArray(listDossier)) return <EmptyRecord />;

  if (listDossier.length === 0) {
    return <EmptyRecord />;
  }

  if (loading) {
    return <CenterSpinner />;
  }

  if (listDossier.length === 0) {
    return <EmptyRecord />;
  }

  return (
    <>
      {listDossier &&
        listDossier.length > 0 &&
        listDossier.map((dossier, index) => (
          <FolderItem key={dossier.id} dossier={dossier} index={index} />
        ))}
    </>
  );
};

export default FolderList;
