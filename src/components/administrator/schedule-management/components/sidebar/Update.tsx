"use client";

import { updatePlanning } from "@/api/planningApi";
import CloseRoundedIcon from "@/assets/icons/CloseRoundedIcon";
import SaveIcon from "@/assets/icons/SaveIcon";
import CheckBox from "@/components/inputs/CheckBox";
import { UsePlanningStore } from "@/stores/PlanningStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UpdateDayOff() {
    const { toogleSide, toogleUpdate, updateSide, setUpdateSide } = UsePlanningStore();
    const [selecteduser, setSelectedUser] = useState<number | null>(null);
    const [filter, setFilter] = useState<{ date_from?: string; date_to?: string }>({
        date_from: "",
        date_to: ""
    });
    const [checked, setChecked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        if (!updateSide) return;
        
        setDescription(updateSide.description);
        const start = updateSide.start_datetime
            ? new Date(updateSide.start_datetime).toISOString().split("T")[0]
            : "";
        const end = updateSide.end_datetime
            ? new Date(updateSide.end_datetime).toISOString().split("T")[0]
            : "";

        setFilter(prev => ({
            ...prev,
            date_from: start,
            date_to: end
        }));
    }, [updateSide]);

    const resetFields = () => {
        setFilter({
            date_from: "",
            date_to: ""
        });
        setDescription("");
        setSelectedUser(null);
        setChecked(false);
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (!updateSide) return;

            await updatePlanning(
                updateSide?.id,
                {
                    user_id: Number(updateSide.user.id),
                    start_datetime: filter.date_from ?? "",
                    end_datetime: filter.date_to ?? "",
                    availability_type: "Off",
                    description: description
                }
            )
            toogleUpdate();
            resetFields();
            toogleSide();
        } catch (error) {
            console.error(error);
            toast.error("Oups!, Une erreur s'est produite")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" border-white border-l h-full relative">
            <div className=" bg-[#C3D6E94D] flex items-center justify-between p-[20px]">
                <h3 className=" text-[#101828] font-bold text-[18px]">Modifier le jour off</h3>
                <button onClick={() => toogleSide()}><CloseRoundedIcon /></button>
            </div>
            <div className=" flex flex-col gap-8 p-[30px]">
                <div className=" flex flex-col gap-2">
                    <h5 className=" text-[#101828] text-[14px] font-bold flex items-center  gap-2">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="4.5" r="3" fill="#101828" />
                            <path d="M15 13.125C15 14.989 15 16.5 9 16.5C3 16.5 3 14.989 3 13.125C3 11.261 5.68629 9.75 9 9.75C12.3137 9.75 15 11.261 15 13.125Z" fill="#101828" />
                        </svg>
                        Membre concerné
                    </h5>
                    <div className=" bg-white text-black rounded-[10px] p-[10px] text-[12px] ">
                        {`${updateSide?.user.firstname} ${updateSide?.user.lastname}`}
                    </div>
                </div>

                <div className=" flex flex-col gap-3">
                    <h5 className=" text-[#101828] text-[14px] font-bold flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.8125 1.875C5.8125 1.56434 5.56066 1.3125 5.25 1.3125C4.93934 1.3125 4.6875 1.56434 4.6875 1.875V3.05944C3.608 3.14588 2.89933 3.35803 2.37868 3.87868C1.85803 4.39933 1.64588 5.108 1.55944 6.1875H16.4406C16.3541 5.108 16.142 4.39933 15.6213 3.87868C15.1007 3.35803 14.392 3.14588 13.3125 3.05944V1.875C13.3125 1.56434 13.0607 1.3125 12.75 1.3125C12.4393 1.3125 12.1875 1.56434 12.1875 1.875V3.00968C11.6886 3 11.1293 3 10.5 3H7.5C6.87072 3 6.31145 3 5.8125 3.00968V1.875Z" fill="#101828" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.5 9C1.5 8.37072 1.5 7.81145 1.50968 7.3125H16.4903C16.5 7.81145 16.5 8.37072 16.5 9V10.5C16.5 13.3284 16.5 14.7426 15.6213 15.6213C14.7426 16.5 13.3284 16.5 10.5 16.5H7.5C4.67157 16.5 3.25736 16.5 2.37868 15.6213C1.5 14.7426 1.5 13.3284 1.5 10.5V9ZM12.75 10.5C13.1642 10.5 13.5 10.1642 13.5 9.75C13.5 9.33579 13.1642 9 12.75 9C12.3358 9 12 9.33579 12 9.75C12 10.1642 12.3358 10.5 12.75 10.5ZM12.75 13.5C13.1642 13.5 13.5 13.1642 13.5 12.75C13.5 12.3358 13.1642 12 12.75 12C12.3358 12 12 12.3358 12 12.75C12 13.1642 12.3358 13.5 12.75 13.5ZM9.75 9.75C9.75 10.1642 9.41421 10.5 9 10.5C8.58579 10.5 8.25 10.1642 8.25 9.75C8.25 9.33579 8.58579 9 9 9C9.41421 9 9.75 9.33579 9.75 9.75ZM9.75 12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75C8.25 12.3358 8.58579 12 9 12C9.41421 12 9.75 12.3358 9.75 12.75ZM5.25 10.5C5.66421 10.5 6 10.1642 6 9.75C6 9.33579 5.66421 9 5.25 9C4.83579 9 4.5 9.33579 4.5 9.75C4.5 10.1642 4.83579 10.5 5.25 10.5ZM5.25 13.5C5.66421 13.5 6 13.1642 6 12.75C6 12.3358 5.66421 12 5.25 12C4.83579 12 4.5 12.3358 4.5 12.75C4.5 13.1642 4.83579 13.5 5.25 13.5Z" fill="#101828" />
                        </svg>
                        Période d'indisponibilité
                    </h5>
                    <CheckBox
                        id="unique-date"
                        checked={checked}
                        onChange={() => { setChecked(!checked) }}
                        label="Jour unique"
                        label_color="#646E81"
                    />
                    {!checked ?
                        <div className="bg-white rounded-[10px] flex gap-2 p-2 items-center justify-evenly text-[14px] text-[#3A5F6E]">
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                value={filter.date_from}
                                onChange={(e) => {
                                    const date = e.target.value; // format: 'YYYY-MM-DD'
                                    setFilter({ ...filter, date_from: date });
                                }}
                            />

                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                value={filter.date_to}
                                onChange={(e) => {
                                    const date = e.target.value; // format: 'YYYY-MM-DD'
                                    setFilter({ ...filter, date_to: date });
                                }}
                            />
                        </div>
                        :
                        <div className="bg-white rounded-[10px] flex gap-2 p-2 items-center justify-between text-[14px] text-[#3A5F6E] w-full">
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                value={filter.date_from}
                                onChange={(e) => {
                                    const date = e.target.value; // format: 'YYYY-MM-DD'
                                    setFilter({ ...filter, date_from: date, date_to: date });
                                }}
                                className=" w-full"
                            />
                        </div>
                    }
                </div>

                <div className=" flex flex-col gap-3">
                    <h5 className=" text-[#101828] text-[14px] font-bold flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.2216 15.3539L9.81499 16.0408C9.45262 16.653 8.54735 16.653 8.18498 16.0408L7.7784 15.3539C7.46305 14.8211 7.30537 14.5547 7.05209 14.4074C6.79882 14.2601 6.47994 14.2546 5.84218 14.2436C4.90066 14.2274 4.31017 14.1697 3.81494 13.9645C2.89608 13.5839 2.16605 12.8539 1.78545 11.9351C1.5 11.2459 1.5 10.3723 1.5 8.625V7.875C1.5 5.41993 1.5 4.19239 2.0526 3.29063C2.36181 2.78605 2.78605 2.36181 3.29063 2.0526C4.19239 1.5 5.41993 1.5 7.875 1.5H10.125C12.5801 1.5 13.8076 1.5 14.7094 2.0526C15.214 2.36181 15.6382 2.78605 15.9474 3.29063C16.5 4.19239 16.5 5.41993 16.5 7.875V8.625C16.5 10.3723 16.5 11.2459 16.2145 11.9351C15.8339 12.8539 15.1039 13.5839 14.1851 13.9645C13.6898 14.1697 13.0993 14.2274 12.1578 14.2436C11.52 14.2546 11.2011 14.2601 10.9479 14.4074C10.6946 14.5547 10.5369 14.8211 10.2216 15.3539ZM6 8.8125C5.68934 8.8125 5.4375 9.06434 5.4375 9.375C5.4375 9.68566 5.68934 9.9375 6 9.9375H10.125C10.4357 9.9375 10.6875 9.68566 10.6875 9.375C10.6875 9.06434 10.4357 8.8125 10.125 8.8125H6ZM5.4375 6.75C5.4375 6.43934 5.68934 6.1875 6 6.1875H12C12.3107 6.1875 12.5625 6.43934 12.5625 6.75C12.5625 7.06066 12.3107 7.3125 12 7.3125H6C5.68934 7.3125 5.4375 7.06066 5.4375 6.75Z" fill="#101828" />
                        </svg>

                        Commentaire
                    </h5>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        name="comment" id="comment"
                        className=" rounded-[10px] min-h-[100px] p-[10px] outline-none text-[12px]"
                        placeholder="Ajouter un commentaire ..."></textarea>
                </div>
            </div>


            <div className="w-full flex justify-center absolute bottom-6 left-0">
                <button
                    disabled={!filter.date_from || !filter.date_to || !updateSide?.user.id}
                    onClick={handleSubmit}
                    className={`w-[80%] px-[20px] py-2 rounded-[10px] ${!filter.date_from || !filter.date_to || !updateSide?.user.id
                        ? "bg-gray-300"
                        : "bg-[#65A5BF]"
                        } text-white flex items-center gap-2 justify-center`}
                >
                    <SaveIcon color="#fff" />
                    {loading ? 'Chargement...' : 'Enregistrer'}
                </button>
            </div>
        </div>
    )
}