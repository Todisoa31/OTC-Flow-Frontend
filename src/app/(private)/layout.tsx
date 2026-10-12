"use client";

import CommentSidebar from "@/components/Commentaire";
import CounterController from "@/components/counterController";
import MenuSidebar from "@/components/MenuSidebar";
import NotificationV2 from "@/components/NotificationV2";
import PdfViewer from "@/components/pdf/PdfViewer";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/top-bar/Topbar";
import { FiltersProvider } from "@/contexts/Filter/filterContext";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";
import { getFile } from "@/utils/getFile";
import withAuth from "@/utils/withAuth";
import { useEffect, useState } from "react";
import Modal from "react-modal";

function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showNotification, setShowNotification] = useState(false);
  const { setFilePdfModal, filePdfModal, commentFileId } = useStatusDosserProvider();

  useEffect(() => {
    Modal.setAppElement("#otc-body");
  }, []);

    return (

        <FiltersProvider>
            <div
                className="flex w-screen h-screen items-center justify-center bg-[url('/images/gradient-color.png')] bg-cover">
                <div
                    className="w-full flex grow h-full items-start flex-shrink-0 border-2 bg-white/40 backdrop-blur-[30px] overflow-hidden"
                >
                    <Sidebar />
                    <div className="flex flex-col items-start flex-1 self-stretch backdrop-blur-[30px]  bg-white/40 grow w-full">
                        <Topbar setShowNotification={setShowNotification} />
                        <div className="flex flex-col items-start gap-[30px] self-stretch grow overflow-y-auto">
                            {children}
                        </div>
                    </div>
                    <NotificationV2
                        showNotification={showNotification}
                        setShowNotification={setShowNotification}
                    />
                    <CommentSidebar file_id_props={commentFileId}/>
                    <MenuSidebar />
                    {filePdfModal.showPdfViewer && filePdfModal.file && (
                        <PdfViewer
                            fileUrl={getFile(filePdfModal.file?.file)}
                            fileName={filePdfModal.file.name}
                            onClose={() =>
                            setFilePdfModal(prev => ({
                                ...prev,
                                showPdfViewer: false
                            }))
                            }
                        />
                    )}
                </div>

                {/* Counter controller */}
                <CounterController/>
            </div>
        </FiltersProvider>
    )
}
export default withAuth(RootLayout);
