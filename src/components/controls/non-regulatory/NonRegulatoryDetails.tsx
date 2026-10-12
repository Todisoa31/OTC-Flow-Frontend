"use client";
import { useEffect, useState } from "react";
import NonRegulatoryDetailsGeneral from "./NonRegulatoryDetailsGeneral";
import NonRegulatoryDetailsContrepartie from "./NonRegulatoryDetailsContrepartie";
import { useTitle } from "@/providers/TitleProvider";
import { useParams } from "next/navigation";
import { FolderOutputType } from "@/types/folderType";
import { getRecordByIdApi } from "@/api/recordInstallerApi";
import TitleWithBack from "@/components/TitleWithBack";
import { CONTROL_NON_REGULATORY_ROUTE } from "@/constants/routes";
import EmptyRecord from "@/components/empty/EmptyRecord";
import RightLayout from "@/components/layout/RightLayout";
import Button from "@/components/inputs/Button";
import SaveIcon from "@/assets/icons/SaveIcon";
import RecordObservation from "@/components/record-detail/RecordObservation";
import CenterLayout from "@/components/layout/CenterLayout";
import FolderDocumentContent from "@/components/FolderDocumentContent";
import RecordComment from "@/components/record-detail/RecordComment";
import { Statuses } from "@/types/recordType";
import { addFolderCommentObservationApi, updateFolderStatusApi } from "@/api/dossier";
import ContentLayout from "@/components/layout/ContentLayout";
import CenterSpinner from "@/components/loader/CenterSpinner";
import RecordDetailChat from "@/components/record-detail/RecordDetailChat";


function NonRegulatoryDetails() {
    const { setTitle } = useTitle();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [folder, setFolder] = useState<FolderOutputType>();
    const [status, setStatus] = useState<string | null>(null);
    const [comment, setComment] = useState<string>('');
    const [observation, setObservation] = useState<string>('');
    const [openRightLayout, setOpenRightLayout] = useState(true);

    const { name } = folder || {};

    const getFolderDetail = async () => {
        if (id) {
            try {
                setLoading(true);
                const res = await getRecordByIdApi(Number(id));
                setFolder(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePostOrUpdateCommentObservation = async () => {
        try {
            setLoading(true);
            await addFolderCommentObservationApi(folder?.id as number, comment, observation);
        } catch (error) {
            console.error('Error posting comment:', error);
        }finally {
            setLoading(false);
        }
    }

    const handleUpdateStatus = async (statusCode: Statuses) => {
        if (!id) return;
        try {
            setLoading(true);
            await updateFolderStatusApi(Number(id), statusCode);
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getFolderDetail();
    }, [id]);

    useEffect(() => {
        setTitle(<TitleWithBack title={name || "Détail du Dossier"} selectPage={CONTROL_NON_REGULATORY_ROUTE} />);
    }, [name]);

    useEffect(() => {
        if (folder) {
            setStatus(folder.status?.code || null);
        }
    }, [folder]);

    if (loading) {
        return <CenterSpinner />;
    }

    if (!folder) {
        return <EmptyRecord />;
    }

    return (
        <ContentLayout>
            <CenterLayout className="px-0">
                <NonRegulatoryDetailsGeneral data={folder} open={openRightLayout} setOpen={setOpenRightLayout} />
                <div className="self-stretch px-[30px] inline-flex justify-start items-start gap-[30px]">
                    <NonRegulatoryDetailsContrepartie {...folder} />
                    {/* <NonRegulatoryDetailsWork {...folder} /> */}
                </div>
                <FolderDocumentContent folder={folder} />
            </CenterLayout>

            <RightLayout
                title="Commentaires et observations"
                open={openRightLayout}
                setOpen={setOpenRightLayout}
            >
                <div className="self-stretch flex-1 px-[30px] flex flex-col justify-start items-start gap-[30px]">
                    <RecordComment
                        id={folder.id}
                        setComment={setComment}
                        comment={comment}
                    />
                    <RecordObservation
                        id={folder.id}
                        observation={observation}
                        setObservation={setObservation}
                    />
                    <Button
                        label="Enregistrer les modifications"
                        iconLeft={<SaveIcon active={true} />}
                        onClick={() => {
                            handleUpdateStatus(status as Statuses);
                            handlePostOrUpdateCommentObservation();
                        }}
                        width="w-full"
                        loading={loading}
                    />
                    <div className="justify-start text-[#101828] text-sm font-bold leading-[18px]">Messages</div>
                    
                      <RecordDetailChat
                          hideTitle
                          folder_id_props={folder.id}
                          custopm_width="w-full"
                          customHeight="h-[calc(100vh-640px)]"
                          userId={folder?.installateur?.id}
                          conversationT={'Contrôleur'}//Contrôleur
                          noPadding={true}
                      />    
                </div>
            </RightLayout>
        </ContentLayout>
    )
}

export default NonRegulatoryDetails