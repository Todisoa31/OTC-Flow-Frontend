"use clent";

import { getDaysOff } from "@/api/planningApi";
import { UsePlanningStore } from "@/stores/PlanningStore";
import { formatFrenchDate } from "@/utils/getHourMinute";
import { useEffect, useRef, useState } from "react";

export type UserProfilType = {
    id: number;
    name: string;
    description: string;
    code: string;
};

export type AvailabilityType = "Disponible" | "Off";

export type UserPlanningType = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    profil: UserProfilType | null;
    photo_profil: string | null;
    planning: {
        start_datetime: string; // ex : "2025-07-07T08:00:00Z"
        end_datetime: string;
        availability_type: AvailabilityType;
        description: string;
    };
};


export default function Info() {


    const [page, setpage] = useState<number>(1);
    const [pageAbsent, setpageAbsent] = useState<number>(1);
    const refOff = useRef<HTMLDivElement | null>(null);
    const refOffAbsent = useRef<HTMLDivElement | null>(null);

    const [maxPage, setMaxPage] = useState<number>(0);
    const [maxPageAbsent, setMaxPageAbsent] = useState<number>(0);

    const [actualy, setActualy] = useState<UserPlanningType[]>([]);
    const [actualyAbsent, setActualyAbsent] = useState<UserPlanningType[]>([]);
    const { update } = UsePlanningStore();

    // Actuellement en Jour Off
    useEffect(() => {
        const getOffDays = async () => {
            try {
                const res = await getDaysOff(page, 20, "actual");
                setActualy(res.data?.users || []);
                setpage(1);
                setMaxPage(res?.data?.pagination?.total_pages)

            } catch (error) {
                console.error(error);
            }
        }

        const getOffDaysAbsent = async () => {
            try {
                const res = await getDaysOff(page, 20, "planned");
                setActualyAbsent(res.data?.users || []);
                setpageAbsent(1);                
                setMaxPageAbsent(res?.data?.pagination?.total_pages)

            } catch (error) {
                console.error(error);
            }
        }

        getOffDays();
        getOffDaysAbsent()
    }, [update])

    useEffect(() => {
        if (page === 1 || page > maxPage) return;

        const fetchNextPage = async () => {
            try {
                const res = await getDaysOff(page, 20, "actual");
                setActualy((prev) => [...prev, ...(res.data?.users || [])]);
                setMaxPage(res?.data?.pagination?.total_pages)
            } catch (error) {
                console.error("Erreur lors du chargement de la page suivante :", error);
            }
        };

        fetchNextPage();
    }, [page]);

    useEffect(() => {
        if (pageAbsent === 1 || pageAbsent > maxPageAbsent) return;

        const fetchNextPage = async () => {
            try {
                const res = await getDaysOff(pageAbsent, 20, "planned");
                setActualyAbsent((prev) => [...prev, ...(res.data?.users || [])]);
                setMaxPageAbsent(res?.data?.pagination?.total_pages)
            } catch (error) {
                console.error("Erreur lors du chargement de la page suivante :", error);
            }
        };

        fetchNextPage();
    }, [pageAbsent]);

    const handleScroll = () => {
        const div = refOff.current
        if (
            div &&
            div.offsetHeight !== undefined &&
            div.scrollTop !== undefined &&
            div.scrollHeight !== undefined &&
            div.offsetHeight + div.scrollTop + 1 >= div.scrollHeight
        ) {
            if (page === maxPage) return;
            setpage(prev => prev + 1)
        }
    };
    const handleScrollAbsent = () => {
        const div = refOffAbsent.current;
        if (
            div &&
            div.offsetHeight !== undefined &&
            div.scrollTop !== undefined &&
            div.scrollHeight !== undefined &&
            div.offsetHeight + div.scrollTop + 1 >= div.scrollHeight
        ) {
            if (pageAbsent === maxPageAbsent) return;
            setpageAbsent(prev => prev + 1);
        }
    };

    useEffect(() => {
        const div = refOffAbsent.current;
        if (!div) return;

        div.addEventListener("scroll", handleScrollAbsent);

        return () => {
            div.removeEventListener("scroll", handleScrollAbsent);
        };
    }, []);

    useEffect(() => {
        const div = refOff.current
        if (!div) return;

        div.addEventListener("scroll", handleScroll);

        return () => {
            div.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className=" p-[30px] flex flex-col gap-4 h-full border-white border-l text-black">
            <div className="rounded-[10px] bg-[#FFFFFF66] p-[20px] shadow-md">
                <h3 className="text-[#101828] font-bold">Actuellement en Jour Off</h3>
                <div className="flex flex-col gap-4 mt-4 h-[280px] overflow-y-auto" ref={refOff}>
                    {actualy.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">Aucun utilisateur en jour Off actuellement</p>
                    ) : (
                        actualy.map((user) => (
                            <div key={user.id} className="flex items-start justify-between gap-2 p-1">
                                <div className=" flex gap-2">
                                    <img
                                        src={user.photo_profil ? user.photo_profil : "/images/usProfil.jpg"}
                                        alt={`${user.firstname} ${user.lastname}`}
                                        className="w-[30px] h-[30px] rounded-md object-cover"
                                    />
                                    <div className="flex-col flex text-[12px] text-[#3A5F6E]">
                                        <span className="font-bold">{user.firstname} {user.lastname}</span>
                                        <span>{formatFrenchDate(user.planning.start_datetime)} - {formatFrenchDate(user.planning.end_datetime)}</span>
                                        <p>{user.planning.description}</p>
                                    </div>
                                </div>
                                <span className="text-[#3A5F6E] text-[10px]">
                                    {user.profil?.name || user.role}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>


            <div className=" rounded-[10px] bg-[#FFFFFF66] p-[20px] shadow-md">
                <h3 className=" text-[#101828] font-bold">Absences planifiées</h3>
                <div className=" flex flex-col gap-4 mt-4 h-[280px] overflow-y-auto" ref={refOffAbsent}>
                    {actualyAbsent.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">Aucun utilisateur en jour Off actuellement</p>
                    ) : (
                        actualyAbsent.map((user) => (
                            <div key={user.id} className="flex items-start justify-between gap-2 p-1">
                                <div className=" flex gap-2">
                                    <img
                                        src={user.photo_profil ? user.photo_profil : "/images/usProfil.jpg"}
                                        alt={`${user.firstname} ${user.lastname}`}
                                        className="w-[30px] h-[30px] rounded-md object-cover"
                                    />
                                    <div className="flex-col flex text-[12px] text-[#3A5F6E]">
                                        <span className="font-bold">{user.firstname} {user.lastname}</span>
                                        <span>{formatFrenchDate(user.planning.start_datetime)} - {formatFrenchDate(user.planning.end_datetime)}</span>
                                        <p>{user.planning.description}</p>
                                    </div>
                                </div>
                                <span className="text-[#3A5F6E] text-[10px]">
                                    {user.profil?.name || user.role}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}