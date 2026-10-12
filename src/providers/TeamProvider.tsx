"use client"; // Required for state management in Next.js 15

import { DEFAULT_CONTROL_FOLDER_STATS, DETAIL_TEAM } from "@/constants/records";
import { DossierType, FolderExportFinal, FolderExportMachineType } from "@/types/repartitionChargeType";
import { UserTypeMember, CreateTeamPayload, TeamType, OptionType, TeamAssignment, ControlAssignType, ExportMachineType, ControllerDossierStatsType } from "@/types/teamType";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";
interface TeamMemberContextType {

    unasignedTeamReferent: UserTypeMember[];
    setUnasignedTeamReferent: React.Dispatch<React.SetStateAction<UserTypeMember[]>>;

    unasignedControlleur: UserTypeMember[];
    setUnasignedControlleur: React.Dispatch<React.SetStateAction<UserTypeMember[]>>;

    teamCreate: CreateTeamPayload;
    setTeamCreate: React.Dispatch<React.SetStateAction<CreateTeamPayload>>;

    listTeams: TeamType[];
    setListTeams: React.Dispatch<React.SetStateAction<TeamType[]>>;

    referentSidebar: OptionType[];
    setReferentSidebar: React.Dispatch<React.SetStateAction<OptionType[]>>;

    controlleurSidebar: OptionType[];
    setControlleurSidebar: React.Dispatch<React.SetStateAction<OptionType[]>>;

    affectController: TeamAssignment | null;
    setAffectController: React.Dispatch<React.SetStateAction<TeamAssignment | null>>;

    teamDetail: TeamType;
    setTeamDetail: React.Dispatch<React.SetStateAction<TeamType>>;

    controlAssign: ControlAssignType | null;
    setControlAssign: React.Dispatch<React.SetStateAction<ControlAssignType | null>>;

    exportMachine: ExportMachineType;
    setExportMachine: React.Dispatch<React.SetStateAction<ExportMachineType>>;

    detailControllerRetrieved: ControllerDossierStatsType | null;
    setDetailControllerRetrieved: React.Dispatch<React.SetStateAction<ControllerDossierStatsType | null>>;

    affectAssign: boolean;
    setAffectAssign: React.Dispatch<React.SetStateAction<boolean>>;

    fileExportMachine: File[];
    setFileExportMachine: React.Dispatch<React.SetStateAction<File[]>>;
    
    listDossier: DossierType[];
    setListDossier: React.Dispatch<React.SetStateAction<DossierType[]>>;

    listFileExportMachine: FolderExportFinal;
    setListFileExportMachine: React.Dispatch<React.SetStateAction<FolderExportFinal>>;
    

    exportFiles: () => void;
}


const teamMemberContext: TeamMemberContextType =  {
    unasignedTeamReferent: [],
    setUnasignedTeamReferent: () => {},

    controlAssign: null,
    setControlAssign: () => {},

    unasignedControlleur: [],
    setUnasignedControlleur: () => {},

    teamCreate: {name: '', referent_id: [], controllers: []},
    setTeamCreate: () => {},

    listTeams: [],
    setListTeams: () => {},

    referentSidebar: [],
    setReferentSidebar: () => {},
    
    controlleurSidebar: [],
    setControlleurSidebar: () => {},

    affectController: null,
    setAffectController: () => {},

    teamDetail: DETAIL_TEAM,
    setTeamDetail:() => {},

    exportMachine: {job_id: '', type_formulaire:''},
    setExportMachine: () => {},

    detailControllerRetrieved: DEFAULT_CONTROL_FOLDER_STATS,
    setDetailControllerRetrieved: () => {},
    
    affectAssign: false,
    setAffectAssign: () => {},

    fileExportMachine: [],
    setFileExportMachine: () => {},

    listDossier: [],
    setListDossier: () => {},

    listFileExportMachine: { typeFormulaire: '', listFolder: []},
    setListFileExportMachine: () => {},

    exportFiles: () => {}

}


const CreateTeamMemberContext = createContext<TeamMemberContextType>(teamMemberContext);



export const TeamMemberProvider = ({ children }: { children: ReactNode }) => {
    const [unasignedTeamReferent, setUnasignedTeamReferent] = useState<UserTypeMember[]>([]);
    const [unasignedControlleur, setUnasignedControlleur] = useState<UserTypeMember[]>([]);
    const [teamCreate, setTeamCreate] = useState<CreateTeamPayload>({
        name: '',
        referent_id: [],
        controllers: []
    });
    const [listTeams, setListTeams] = useState<TeamType[]>([]);
    const [referentSidebar, setReferentSidebar] = useState<OptionType[]>([]);
    const [controlleurSidebar, setControlleurSidebar] = useState<OptionType[]>([]);
    const [affectController, setAffectController] = useState<TeamAssignment|null>(null);
    const [teamDetail, setTeamDetail] = useState<TeamType>(DETAIL_TEAM);
    const [controlAssign, setControlAssign] = useState<ControlAssignType | null>(null);
    const [exportMachine, setExportMachine] = useState<ExportMachineType>({job_id: '', type_formulaire:''});
    const [detailControllerRetrieved, setDetailControllerRetrieved] = useState<ControllerDossierStatsType | null>(DEFAULT_CONTROL_FOLDER_STATS);
    const [affectAssign, setAffectAssign] = useState<boolean>(false);
    const [fileExportMachine, setFileExportMachine] = useState<File[]>([]);
    const [listDossier, setListDossier] = useState<DossierType[]>([]);
    const [listFileExportMachine, setListFileExportMachine] = useState<FolderExportFinal>( { typeFormulaire: '', listFolder: []},);

      const exportFiles = () => {
        fileExportMachine.forEach(file => {
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(url);
        });
      };

    const value = useMemo(() => ({
        unasignedTeamReferent,
        setUnasignedTeamReferent,

        unasignedControlleur,
        setUnasignedControlleur,

        teamCreate,
        setTeamCreate,

        listTeams,
        setListTeams,

        referentSidebar,
        setReferentSidebar,
        
        controlleurSidebar,
        setControlleurSidebar,

        affectController,
        setAffectController,

        teamDetail,
        setTeamDetail,

        controlAssign,
        setControlAssign,

        exportMachine,
        setExportMachine, 

        detailControllerRetrieved,
        setDetailControllerRetrieved, 

        affectAssign,
        setAffectAssign,

        fileExportMachine,
        setFileExportMachine,

        listDossier,
        setListDossier,

        listFileExportMachine,
        setListFileExportMachine,

        exportFiles
    }), [
        unasignedTeamReferent, setUnasignedTeamReferent,    
        unasignedControlleur, setUnasignedControlleur,
        teamCreate, setTeamCreate,
        listTeams, setListTeams,
        referentSidebar, setReferentSidebar,
        controlleurSidebar, setControlleurSidebar,
        affectController, setAffectController,
        teamDetail, setTeamDetail,
        controlAssign, setControlAssign,
        exportMachine, setExportMachine,
        detailControllerRetrieved, setDetailControllerRetrieved,
        affectAssign, setAffectAssign,
        fileExportMachine, setFileExportMachine,
        listDossier, setListDossier,
        listFileExportMachine, setListFileExportMachine,
        exportFiles
    ]);

    return (
        <CreateTeamMemberContext.Provider value={value}>
            {children}
        </CreateTeamMemberContext.Provider>
    );
};

export const useTeamMember = () => {
    const context = useContext(CreateTeamMemberContext);
    if (!context) {
        throw new Error("useTeamMember must be used within a TeamMemberProvider");
    }
    return context;
};
