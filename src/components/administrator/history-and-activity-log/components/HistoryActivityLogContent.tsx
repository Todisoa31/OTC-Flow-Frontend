"use client";

import { getUsersV2 } from "@/api/user";
import Select from "@/components/inputs/Select";
import { ROLE_USER } from "@/constants/records";
import { Role } from "@/types/authType";
import { UserTypeOutput } from "@/types/userType";
import { useEffect, useState } from "react";
import TableHistoryActivityLog from "./tableHistoryActivityLog";
import { GetAuditLog } from "@/api/audit";
import { ActivityLogType, AditHistoryOutputType } from "@/types/auditType";
import CenterSpinner from "@/components/loader/CenterSpinner";
import Pagination from "@/components/Pagination_V2";
import { PaginationType } from "@/types/general";
import PaginationApi from "@/components/Pagination_API";

type UserPaginationType = PaginationType & {
    search_text?: string;
}

export default function HistoryActivityLogContent() {

    const [users, setUsers] = useState<UserTypeOutput[]>([]);
    const [histories, setHistories] = useState<ActivityLogType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [paginationLoc, setPaginationLoc] = useState<PaginationType>({
        total_pages: 0,
        per_page: 50,
        page: 1,
        total_entries: 0
    });
    const [searchText, setSearchText] = useState<string>("");
    const [paginationUser, setPaginationUser] = useState<UserPaginationType>({
        total_pages: 0,
        per_page: 20,
        page: 1,
        total_entries: 0,
    });
    const [filtre, setFiltre] = useState<AditHistoryOutputType>({
        start_date: "",
        end_date: "",
        page: 1,
        per_page: paginationLoc.per_page,
        role: "",
        user_id: null
    });    

    const getUsers = async () => {
        const res = await getUsersV2({
            search_text: searchText,
            page: paginationUser.page,
            per_page: paginationUser.per_page
        });
        setPaginationUser(res?.pagination);
        setUsers(res?.users);
        setPaginationUser({...paginationUser, search_text: ""});
    };

    // USER API ACTION NEXT PREV =======================
    const handlePrevUserPage = () => {
        if (paginationUser.page > 1) {
            setPaginationUser({ ...paginationUser, page: paginationUser.page - 1 });
        }
    };

    const handleNextUserPage = () => {
        if (paginationUser.page < paginationUser.total_pages) {
            setPaginationUser({ ...paginationUser, page: paginationUser.page + 1 });
        }
    };
    // USER API ACTION NEXT PREV =======================


    const getAuditHistory = async () => {
        setLoading(true);
        try {
            const res = await GetAuditLog({
                per_page: filtre.per_page,
                role: filtre.role,
                start_date: filtre.start_date,
                end_date: filtre.end_date,
                page: filtre.page,
                user_id: filtre.user_id
            });

            setHistories(res?.data);
            setPaginationLoc(res?.pagination)
        } catch (error) {
            console.error("Error fetching audit history:", error);
        } finally {
            setLoading(false);
        }
    };

    interface UserOptionType {
        value: string;
        label: string;
    };

    const UserOption: UserOptionType[] = [
        ...(users?.map((user) => ({
            value: String(user.id),
            label: `${user.firstname} ${user.lastname}` || user.email
        })) ?? [])
    ];

    useEffect(() => {
        getUsers();
    }, [paginationUser.page, searchText])

    useEffect(() => {
        getAuditHistory();
    }, [filtre])


    return (
        <div className=" flex-col flex gap-4 w-full">
            <h2 className=" text-[24px] text-[#101828] font-bold">Historique et Journal d'activité</h2>
            <div className=" grid grid-cols-3 gap-3 w-full text-[14px] text-[#3A5F6E]">
                <div className="bg-white rounded-[10px] flex gap-2 p-2 items-center justify-evenly">
                    <input
                        type="date"
                        name="start_date"
                        id="start_date"
                        onChange={(e) => {
                            const [year, month, day] = e.target.value.split("-");
                            const formattedDate = `${day}/${month}/${year}`;
                            setFiltre({ ...filtre, start_date: formattedDate });
                        }}
                    />
                    <span>|</span>
                    <input
                        type="date"
                        name="end_date"
                        id="end_date"
                        onChange={(e) => {
                            const [year, month, day] = e.target.value.split("-");
                            const formattedDate = `${day}/${month}/${year}`;
                            setFiltre({ ...filtre, end_date: formattedDate });
                        }}
                    />
                </div>
                <div>
                    <Select
                        multiple={false}
                        search={false}
                        value={filtre.role || "" }
                        onChange={(value) => setFiltre({ ...filtre, role: value as Role | "" })}
                        options={ROLE_USER}
                        placeholder="Tous les roles"
                        width="100%"
                    />
                </div>
                <div>
                    <Select
                        multiple={false}
                        search={false}
                        value={String(filtre.user_id) || ""}
                        onChange={(value) => setFiltre({ ...filtre, user_id: value ? Number(value) : null })}
                        options={UserOption}
                        placeholder="Tous les utilisateurs"
                        width="100%"

                        withPagination
                        pagination={paginationUser}
                        prevPage={handlePrevUserPage}
                        nextPage={handleNextUserPage}
                        setSearchText={setSearchText}
                    />
                </div>
            </div>
            {loading ? <CenterSpinner /> : <TableHistoryActivityLog histories={histories} />}

            <PaginationApi
                pagination={paginationLoc}
                setPagination={(data) => {
                    setPaginationLoc(data);
                    setFiltre({ ...filtre, page: data.page, per_page: data.per_page });
                }}
            />
        </div>
    )
};