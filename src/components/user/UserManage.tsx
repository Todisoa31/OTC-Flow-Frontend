"use client";

import React, { useEffect, useState } from "react";
import { useTitle } from "@/providers/TitleProvider";
import { useRouter } from "next/navigation";

import UserFilters from "../filters/UserFilters";
import UserList from "../users-lists/UserList";
import CenterSpinner from "../loader/CenterSpinner";
// import EmptyUser from "../empty/EmptyUser";

import { useFilter } from "@/providers/FilterProvider";
import { getUsersV2 } from "@/api/user";
import { USER_CREATE_ROUTE, USER_TEAM_MANAGEMENT } from "@/constants/routes";
import UsersGroupIcon from "@/assets/icons/UsersGroupIcon";
import { GetUsersParamsType, UserTypeOutput } from "@/types/userType";
import { PaginationType } from "@/types/general";
import PaginationApi from "../Pagination_API";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  created_at: string;
  status: string;
  photo_profil?: string;
};

export default function UserManage() {
  const router = useRouter();
  const { setTitle } = useTitle();

  const { data: rawData } = useFilter();
  const data = rawData as User[];
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<UserTypeOutput[]>([]);
  const [paginationFolder, setPaginationFolder] = useState<PaginationType>({
    total_pages: 0,
    per_page: 50,
    page: 1,
    total_entries: 0
  });
  const [params, SetParams] = useState<GetUsersParamsType>({
    page: 1,
    per_page: paginationFolder.per_page,
    search_text: "",
    status: "",
    role: ""
  });

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersV2(params);
      setUsers(res?.users);
      setPaginationFolder(res?.pagination);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    setTitle("Gestion des utilisateurs");
  }, [setTitle]);

  useEffect(() => {
    // handleGetRecords();
    getUsers()
  }, [params, paginationFolder.page]);

  return (
    <div className="self-stretch flex p-[30px] flex-col justify-between items-start gap-[30px] grow">
      <div className="self-stretch inline-flex justify-start items-center gap-5">
        <div className="flex-1 justify-start text-gray-900 text-2xl font-bold">Liste des utilisateurs</div>
        <button
          onClick={() => router.push(USER_CREATE_ROUTE)}
          className="h-10 px-5 rounded-[10px] bg-[#65A5BF] shadow-[0px_10px_40px_0px_rgba(97,161,191,0.70)] flex justify-start items-center gap-2.5"
        >
          <div className="justify-start text-white text-xs font-bold leading-none">Ajouter un utilisateur</div>
        </button>
        <button
          onClick={() => router.push(USER_TEAM_MANAGEMENT)}
          className="h-10 px-5 rounded-[10px] bg-[#101828] shadow-[0px_10px_40px_0px_rgba(97,161,191,0.70)] flex justify-start items-center gap-2.5">
          <UsersGroupIcon active={true} />
          <div className="justify-start text-white text-xs font-bold leading-none">Gestion des équipes</div>
        </button>
      </div>

      {/* Filtres + Liste */}
      <div className="grow self-stretch flex-col justify-start items-start gap-[30px] flex">
        <div className="self-stretch justify-start items-center flex-col">
          <UserFilters SetParams={SetParams} params={params} />
        </div>

        {loading ? (
          <CenterSpinner />
        ) : 
          <UserList users={users}/>
        }
      </div>

      {/* Pagination */}
      <PaginationApi
        pagination={paginationFolder}
        setPagination={(data) => {
          setPaginationFolder(data);
          SetParams({ ...params, page: data.page, per_page: data.per_page });
        }}
      />
    </div>
  );
}
