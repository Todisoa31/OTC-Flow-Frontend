"use client";

import CloseIconBlack from "@/assets/icons/CloseIconBlack";
import { useParams, useRouter } from "next/navigation";
import { HEAD_ORIGINATION_FILE_TRACKIN_ROUTE } from "@/constants/routes";
import MenuSwitcher from "@/components/StatusDossier/MenuSwitcher";
import FileMenuSwitcherMenuComponent from "@/components/StatusDossier/FileMenuSwitcherMenu";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";

export default function FileDetailsPage() {
  const router = useRouter();
  const { setFileData } = useStatusDosserProvider();

  const { file_id, folder_id } = useParams();

  return (
    <div className="p-[30px] w-full">
      <div className="flex items-center gap-3 w-full">
        <div className="grid grid-cols-5 w-full gap-3">
          <FileMenuSwitcherMenuComponent
            baseUrl={HEAD_ORIGINATION_FILE_TRACKIN_ROUTE}
            fileId={Number(file_id)}
            folderId={Number(folder_id)}
          />
        </div>
        <button
          onClick={() => {
            setFileData({
              file_attestation: null,
              file_devis: [],
              file_attestation_pose: [],
              file_cadre_contribution: [],
              file_immatriculation: [],
              file_facture: [],
              other_file: [],
              file_attestation_desembouage:[],
              status: "",
              file_precarite: [],
            });
            router.push(`${HEAD_ORIGINATION_FILE_TRACKIN_ROUTE}/${folder_id}`);
          }}
        >
          <CloseIconBlack />
        </button>
      </div>

      <div className="mt-[20px] w-full">
        <MenuSwitcher folderId={Number(folder_id)} fileId={Number(file_id)} />
      </div>
    </div>
  );
}
