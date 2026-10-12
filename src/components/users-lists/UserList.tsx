import UserListHeader from "./UserListHeader";
import EmptyUser from "../empty/EmptyUser";
import { formatIsoDateToFrenchLabel } from "@/utils/date";
import CenterSpinner from "../loader/CenterSpinner";
import userAvatar from "@/assets/images/user-avatar.webp";
import { useRouter } from "next/navigation";
import { USER_UPDATE_ROUTE } from "@/constants/routes";
import { getFile } from "@/utils/getFile";
import { UserTypeOutput } from "@/types/userType";

// Typage explicite
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

type Props = Readonly<{
  users: UserTypeOutput[];
}>;

function UserList({ users }: Props) {
  const router = useRouter();

  if (users.length === 0) return <EmptyUser />;

  return (
    <div className="self-stretch pb-5 flex-col justify-start items-start gap-2 flex">
      <UserListHeader />
      {users.map((user) => {
        return (
          <div
            key={user.id}
            onClick={() => router.push(`${USER_UPDATE_ROUTE}/${user.id}`)}
            className="w-full px-5 py-2 bg-[#fefefe]/40 rounded-[15px] shadow-sm border border-white/70 backdrop-blur-[20px] hover:bg-slate-100 transition cursor-pointer"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div className="flex items-center gap-2">
              <img src={user.photo_profil ?? "/images/usProfil.jpg"} alt="user" className="w-[30px] h-[30px] rounded-[5px]" />
              <div className=" text-[12px] text-[#3A5F6E]">{`${user.firstname} ${user.lastname}`}</div>
            </div>
            <div className="text-[#3A5F6E] text-[12px]">{user.email}</div>
            <div className="text-[#3A5F6E] text-[12px]">{user.role}</div>
            <div className="text-[#3A5F6E] text-[12px]">
              {formatIsoDateToFrenchLabel(user.created_at)}
            </div>
            <div className="text-right">
              <div
                className={`text-[12px] px-4 py-2 rounded-[5px] inline-block text-white ${
                  user.status === "Actif" ? "bg-[#65BFAA]" : "bg-[#EC4899]"
                }`}
              >
                {user.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserList;