"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchIcon2 from "@/assets/icons/SearchIcon2";
import Select from "@/components/inputs/Select";
import { GlobalParamsType } from "@/types/folderType";
import { FOLDER_TYPES, MERGED_STATUSES_OPTIONS, STATUSES_OPTIONS } from "@/constants/records";
import SettingIcon from "@/assets/icons/SettingIcon";
import SaveIcon from "@/assets/icons/SaveIcon";
import ClosePopupIcon from "@/assets/icons/ClosePopupIcon";
import Spinner from "@/components/loader/PanelSprinner";
import { postBonus } from "@/api/recordControllerApi";
import { toast } from "react-toastify";
import UserSelect from "@/components/inputs/UserSelect";
import { ROLE_INSTALLER } from "@/constants/userConst";

type Props = {
    setText: Dispatch<SetStateAction<string>>;
    params: GlobalParamsType;
    setParams: Dispatch<SetStateAction<GlobalParamsType>>;
    chargeActuelle: number;
    chargeMax: number;
    user: { firstname: string; lastname: string };
    assignedDossier: number;
    bonusDossier: number;
};

export default function HeaderFileMonitoring({
    setText,
    params,
    setParams,
    chargeActuelle,
    chargeMax,
}: Props) {
    const [searchText, setSearchText] = useState("");
    const [showPanel, setShowPanel] = useState(false);
    const [demandeDossiersSupp, setDemandeDossiersSupp] = useState(0);
    const [wantsMore, setWantsMore] = useState<boolean | null>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedInstaller, setSelectedInstaller] = useState<number[]>([])

    useEffect(() => {
        if (searchText.trim() === "") {
            setText("");
        }
    }, [searchText, setText]);

    const handleSearchSubmit = (e?: React.FormEvent | React.MouseEvent) => {
        e?.preventDefault();
        setText(searchText);
    };

    const handleClosePanel = () => {
        setShowPanel(false);
        setSuccessMessage("");
    };

    const FOLDER_TYPES_OPTIONS = FOLDER_TYPES.map((folderType) => ({
        label: folderType.label,
        value: folderType.code,
    }));

    useEffect(() => {
        if (searchText.trim() === "") {
            setText("");
        }
    }, [searchText, setText]);

    const handleEnregistrerDemande = async () => {
        if (!wantsMore) return;

        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            await postBonus(demandeDossiersSupp);
            setSuccessMessage("Votre demande a bien été enregistrée.");
            setTimeout(() => setSuccessMessage(""), 6000);
        } catch (err: any) {
            console.error("Erreur d'envoi :", err.message);
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        setParams((prevFilter) => ({
            ...prevFilter,
            installateur: selectedInstaller.join(",")
        }));
    }, [selectedInstaller]);

    return (
        <div className="relative w-full flex items-center justify-between">
            {/* Filtres */}
            <div className="flex flex-wrap items-center gap-2 w-full">
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-white rounded-[10px] flex items-center justify-between h-[45px] w-[30%] px-2"
                >
                    <input
                        type="search"
                        className="outline-none border-none bg-transparent w-full text-grey text-[12px]"
                        placeholder="Rechercher un dossier"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button onClick={handleSearchSubmit}>
                        <SearchIcon2 />
                    </button>
                </form>

                <Select
                    options={MERGED_STATUSES_OPTIONS}
                    onChange={(value) => setParams({ ...params, status: String(value) })}
                    value={params.status ?? ""}
                    multiple={false}
                    search={false}
                    placeholder="Tous les statuts"
                />

                <Select
                    options={FOLDER_TYPES_OPTIONS}
                    onChange={(value) =>
                        setParams({ ...params, type_dossier: String(value) })
                    }
                    value={params.type_dossier ?? ""}
                    multiple={false}
                    search={false}
                    placeholder="Types de dossier"
                />

                <div className="bg-white rounded-[10px] flex gap-2 px-2 h-[45px] items-center justify-evenly text-[12px] text-[#3A5F6E]">
                    <input
                        type="date"
                        onChange={(e) => {
                            const [year, month, day] = e.target.value.split("-");
                            const formattedDate = `${day}/${month}/${year}`;
                            setParams({ ...params, start_date: formattedDate });
                        }}
                    />
                    <span>|</span>
                    <input
                        type="date"
                        onChange={(e) => {
                            const [year, month, day] = e.target.value.split("-");
                            const formattedDate = `${day}/${month}/${year}`;
                            setParams({ ...params, end_date: formattedDate });
                        }}
                    />
                </div> 

                <UserSelect
                    value={selectedInstaller}
                    setUser={setSelectedInstaller}
                    role={ROLE_INSTALLER}
                    label="Installateur"
                />
            </div>

            {/* BOUTON - CHARGE ACTUELLE */}
            {chargeActuelle >= chargeMax && (
                <div
                    onClick={() => setShowPanel(true)}
                    className="w-[30%] h-[45px] px-3.5 bg-gray-900 rounded-[10px] inline-flex justify-start items-center gap-2.5 cursor-pointer ml-4"
                >
                    <span className="text-white text-xs font-medium">Charge actuelle</span>
                    <span className="text-slate-400 text-xs font-bold">
                        {chargeActuelle}/{chargeMax}
                    </span>
                    <div className="w-px h-10 bg-white/10" />
                    <span className="text-white text-xs font-medium">+</span>
                    <span className="text-slate-400 text-xs font-bold">
                        {demandeDossiersSupp} dossiers
                    </span>
                    <div className="w-5 h-5">
                        <SettingIcon />
                    </div>
                </div>
            )}

            {/* PANEL LATÉRAL */}
            <div
                className={`fixed top-[90px] right-0 h-[calc(100vh-95px)] w-72 z-50 transition-transform duration-300 ${showPanel ? "translate-x-0" : "translate-x-full"
                    } bg-white/60 border-l border-white backdrop-blur-lg overflow-hidden flex flex-col`}
            >
                {/* Header */}
                <div className="h-20 px-7 py-5 bg-slate-300/30 flex justify-between items-center">
                    <h2 className="text-gray-900 text-lg font-bold">Traitement supplémentaire</h2>
                    <button
                        onClick={handleClosePanel}
                        className="w-10 h-10 rounded-full bg-white flex justify-center items-center"
                    >
                        <ClosePopupIcon />
                    </button>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-7">
                    {/* Question Oui/Non */}
                    <div className="flex flex-col gap-3.5">
                        <p className="text-gray-950 text-xs font-bold">
                            Souhaitez-vous recevoir des dossiers supplémentaires au-delà de votre seuil journalier ?
                        </p>
                        <div className="h-10 p-[5px] bg-[#ffffff0b] rounded-2xl shadow backdrop-blur-[10px] flex">
                            <button
                                className={`flex-1 text-xs font-medium rounded-[10px] transition ${wantsMore === true ? "bg-gray-900 text-white" : "text-gray-900"
                                    }`}
                                onClick={() => setWantsMore(true)}
                            >
                                OUI
                            </button>
                            <button
                                className={`flex-1 text-xs font-medium rounded-[10px] transition ${wantsMore === false ? "bg-gray-900 text-white" : "text-gray-900"
                                    }`}
                                onClick={() => setWantsMore(false)}
                            >
                                NON
                            </button>
                        </div>
                    </div>

                    {/* Nombre de dossiers */}
                    <div className="flex flex-col gap-3.5">
                        <p className="text-gray-900 text-xs font-medium">
                            Nombre maximum de dossiers supplémentaires
                        </p>
                        <div className="h-10 px-3.5 bg-white rounded-[10px] flex items-center justify-between">
                            <input
                                type="number"
                                min={0}
                                value={demandeDossiersSupp}
                                onChange={(e) =>
                                    setDemandeDossiersSupp(parseInt(e.target.value, 10) || 0)
                                }
                                className="w-full text-gray-900 text-sm font-bold bg-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Message de succès */}
                {successMessage && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="bg-green-400 text-gray-950 text-xs font-bold px-4 py-2 mt-[100px] rounded-[20px] shadow">
                            {successMessage}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-7 border-t border-white/40 bg-white/60">
                    <button
                        onClick={handleEnregistrerDemande}
                        disabled={wantsMore !== true || isSubmitting}
                        className={`w-full h-10 px-5 rounded-[10px] shadow flex items-center justify-center gap-3 ${wantsMore !== true || isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gray-900"
                            }`}
                    >
                        {isSubmitting ? (
                            <Spinner />
                        ) : (
                            <>
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <SaveIcon active={wantsMore === true} />
                                </div>
                                <span className="text-white text-xs font-bold">Enregistrer</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

        </div>
    );
}