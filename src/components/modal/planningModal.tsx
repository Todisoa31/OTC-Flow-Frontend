import CloseIcon from "@/assets/icons/NotificationIcons/CloseIcon";
import { AvailabilityPlanningItemType, AvailabilityType, UserPlannigModal, UserPlanning } from "@/types/planningType";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import SaveIcon from "@/assets/icons/SaveIcon";
import { deletePlanning, searchPlanning } from "@/api/planningApi";
import { UsePlanningStore } from "@/stores/PlanningStore";
import { toast } from "react-toastify";
import PencilIcon from "@/assets/icons/PencilIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    parametter: UserPlannigModal | any | null;
    currenStatus: AvailabilityType;
    currentDate: string;
};

export default function PlannigModal({ open, setOpen, parametter, currenStatus, currentDate }: Props) {
    const { toogleUpdate, toogleSide, setUpdateSide } = UsePlanningStore()
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<AvailabilityPlanningItemType>();


    const findPlanning = async () => {
        if (!parametter) return;
        try {
            const res = await searchPlanning(parametter.id, currentDate);

            const data = res?.data;

            const dataU = {
                id: data?.id,
                start_datetime: data.start_datetime,
                end_datetime: data.end_datetime,
                availability_type: data.availability_type,
                description: data.description,
                user: parametter,
            }

            setData(dataU);

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!parametter) return;
        try {
            setLoading(true);
            await deletePlanning(parametter.id, currentDate);
            toogleUpdate();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Une erreur s'est produite lors de la mise a jour de planning");
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = () => {
        toogleSide("Update");
        setOpen(false);
        if (data) {
            setUpdateSide(data)
        }
    };

    useEffect(() => {
        if (currentDate) {
            setDate(currentDate)
        }
        findPlanning();
    }, [parametter, currentDate]);

    return (
        <>
            {open &&
                <div className="fixed top-0 left-0 w-full h-screen z-[1000] flex items-center justify-center bg-[#00000099]" onClick={() => setOpen(false)} >
                    <div className={` overflow-hidden rounded-[30px] relative border text-center bg-white w-[500px]`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className=" flex flex-col gap-4">
                            <div className=" flex justify-between items-center px-[30px] py-[20px] border-b ">
                                <h6 className=" text-[#101828] font-bold text-[16px]">Modifier la disponibilité</h6>
                                <button className=" text-gray-600 text-xl" onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(false);
                                }}>
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className=" px-[30px] pb-[30px] flex flex-col gap-4">
                                <div className=" flex flex-col justify-between gap-6">
                                    <div className=" flex justify-between">
                                        <div className="flex items-center gap-2">
                                            <img src={parametter?.photo_profil ?? '/images/usProfil.jpg'} alt="user" className=" w-[40px] h-[40px] rounded-[5px]" />
                                            <div className=" flex flex-col items-start">
                                                <span className=" text-[#101828] text-[12px]">{parametter?.firstname} {parametter?.lastname}</span>
                                                <span className=" text-[#646E81] text-[12px]">{parametter?.role}</span>
                                            </div>
                                        </div>
                                        {/* <Radio title={checked ? "Disponible" : "Off"} checked={checked} toogleRadio={handleToogle} /> */}
                                    </div>

                                    <div className=" flex flex-col gap-2 items-start">
                                        <span className=" text-[#000000] text-[12px] font-bold">Date : {date}</span>
                                    </div>

                                    <div className=" flex items-center gap-2">
                                        <button
                                            onClick={handleUpdate}
                                            className=" flex items-center w-full gap-2 justify-center text-white text-[12px] font-bold bg-[#FCC567] shadow-lg shadow-[#bda273] rounded-[10px] p-[10px]"
                                        >
                                            <PencilIcon color="#fff" /> Mofifier
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className=" flex items-center w-full gap-2 justify-center text-white text-[12px] font-bold bg-[#EC4899] shadow-lg shadow-[#b86d93] rounded-[10px] p-[10px]"
                                        >
                                            <DeleteIcon/> {loading ? 'Chargement...' : 'Supprimer'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
