"use client";

import { useEffect, useState } from "react";

import { addFolderCommentObservationApi } from "@/api/dossier";
import SaveIcon from "@/assets/icons/SaveIcon";
import FolderList from "@/components/FolderList";
import FolderOverview from "@/components/FolderOverview";
import Button from "@/components/inputs/Button";
import CenterLayout from "@/components/layout/CenterLayout";
import ContentLayout from "@/components/layout/ContentLayout";
import RightLayout from "@/components/layout/RightLayout";
import RecordComment from "@/components/record-detail/RecordComment";
import RecordMinimalDetails from "@/components/record-detail/RecordMinimalDetails";
import RecordObservation from "@/components/record-detail/RecordObservation";
import { useTitle } from "@/providers/TitleProvider";
import { FolderOutputType } from "@/types/folderType";

export const ControlsDashboard = () => {
  const { setTitle } = useTitle();
  const [openRightLayout, setOpenRightLayout] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FolderOutputType | null>(null);
  const [comment, setComment] = useState<string>("");
  const [observation, setObservation] = useState<string>("");

  const handleOpenDetail = (item: FolderOutputType) => {
    setSelectedRecord(item);
    setOpenRightLayout(true);
  };

  const handlePostOrUpdateCommentObservation = async () => {
    try {
      await addFolderCommentObservationApi(selectedRecord?.id as number, comment, observation);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setTitle("Tableau de bord"), []);

  // TODO : Filtre date de création
  // TODO : Ordre des filtres
  // TODO : Filtre Type de contrôle

  return (
    <ContentLayout>
      <CenterLayout>
        <FolderOverview hiddens={[]} isCofrac />
        <FolderList
          title="Liste des dernières actions"
          onClick={handleOpenDetail}
          useFilter
          usePagination
          hiddenFilters={["date", "role", "installater_status"]}
          hiddenColumns={["controller", "controllerConformite"]}
          editableStatus
          isCofrac
          checkbox
        />
      </CenterLayout>

      <RightLayout
        open={openRightLayout && selectedRecord !== null}
        setOpen={setOpenRightLayout}
        title="Commentaires et observations"
        footer={
          <div className=" flex flex-col gap-2 w-full">
            {/* <Button
                        //     label="Enregistrer les modifications"
                        //     iconLeft={<SaveIcon active={true} />}
                        //     onClick={() => handlePostOrUpdateCommentObservation()}
                        //     width="w-full"
                        //     loading={loading}
                        // /> */}
            <Button
              label="Enregistrer les modifications"
              iconLeft={<SaveIcon active={true} />}
              onClick={() => handlePostOrUpdateCommentObservation()}
              width="w-full"
            />
          </div>
        }
      >
        <div className="self-stretch flex-1 px-[30px] flex flex-col justify-start items-start gap-[30px]">
          <RecordComment id={selectedRecord?.id || 0} setComment={setComment} comment={comment} />
          <RecordObservation
            id={selectedRecord?.id || 0}
            observation={observation}
            setObservation={setObservation}
          />
          {selectedRecord && <RecordMinimalDetails {...selectedRecord} />}
        </div>
      </RightLayout>
    </ContentLayout>
  );
};
