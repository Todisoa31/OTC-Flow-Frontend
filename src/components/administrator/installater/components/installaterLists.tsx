import { formatIsoDateToFrenchLabel } from "@/utils/date";
import CenterSpinner from "@/components/loader/CenterSpinner";
// import userAvatar from "@/assets/images/user-avatar.webp";
import { useRouter } from "next/navigation";
import { ADMIN_INSTALLATER_ROUTE } from "@/constants/routes";
// import { getFile } from "@/utils/getFile";
import { InstallateurOutputType } from "@/types/installerTypes";

// type InstallerUser = {
//   id: number;
//   photo_profil?: string;
//   firstname?: string;
//   lastname?: string;
//   email?: string;
//   SIREN?: string;
//   status?: string;
//   nbDossiers?: number;
//   created_at?: string;
// };

// type Props = {
//   users: InstallerUser[];
//   loading?: boolean;
// };

const columns = [
  { key: "Référence", label: "Référence", width: "w-[14%]" },
  { key: "Installateur", label: "Installateur", width: "w-[14%]" },
  { key: "SIREN", label: "SIREN", width: "w-[10%]" },
  { key: "email", label: "Email", width: "w-[14%]" },
  { key: "status", label: "Statut", width: "w-[12%]" },
  { key: "Nb de dossiers", label: "Nb de dossiers", width: "w-[10%]" },
  { key: "date_dinscription", label: "Date d'inscription", width: "w-[12%]" },
];

// function AvatarUser({
//   photo_profil,
//   firstname,
//   lastname,
// }: {
//   photo_profil?: string;
//   firstname?: string;
//   lastname?: string;
// }) {
//   const avatarUrl = photo_profil ? getFile(photo_profil) : userAvatar.src;

//   return (
//     <div className="flex items-center gap-2">
//       <img
//         className="w-[30px] h-[30px] rounded-[20px] bg-white border border-gray-300 object-cover"
//         src={avatarUrl}
//         alt="user avatar"
//       />
//       <span className="text-slate-600 text-xs font-bold">
//         {firstname} {lastname}
//       </span>
//     </div>
//   );
// };

type Props = {
  data: InstallateurOutputType[];
  loading: boolean;
};

function InstallaterLists({ data, loading }: Props) {
  const router = useRouter();

  if (loading) return <CenterSpinner />;

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="text-slate-600 text-sm font-medium">
          Aucun installateur trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="self-stretch pb-5 flex-col gap-2 flex">
      {/* Header */}
      <div className="px-5 pb-2.5 flex items-center gap-[15px]">
        {columns.map((col) => (
          <div key={col.key} className={`${col.width} text-[#646E81] text-[12px]`}>
            {col.label}
          </div>
        ))}
      </div>

      {/* Users */}
      {data.map((user) => {

        return (
          <div
            key={user.id}
            onClick={() => router.push(`${ADMIN_INSTALLATER_ROUTE}/details/${user.id}`)}
            className="cursor-pointer px-5 py-2 bg-[#fefefe]/40 rounded-[15px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] border border-white/70 backdrop-blur-[20px] flex items-center gap-[15px] hover:bg-slate-100 transition duration-200 hover:scale-[1]"
          >
            <div className="w-[14%] text-slate-600 text-xs font-bold">{user.id}</div>

            <div className="w-[14%] flex items-center gap-2">
              {/* <AvatarUser photo_profil={photo_profil} firstname={firstname} lastname={lastname} /> */}
              <img src={user.photo_profil ?? "/images/usProfil.jpg"} alt="user" className=" w-[30px] h-[30px] rounded-[5px]" />
              <span className=" text-[12px] text-[#3A5F6E]">{ `${user.firstname} ${user.lastname}`}</span>
            </div>

            <div className="w-[10%] text-slate-600 text-xs font-bold">{user.siren}</div>
            <div className="w-[14%] text-slate-600 text-xs font-bold">{user.email}</div>
            <div className="w-[12%]">
              <div
                className={`text-[12px] px-4 py-2 rounded-[5px] w-fit text-white ${user.status === "Actif" ? "bg-[#65BFAA]" : "bg-[#EC4899]"
                  }`}
              >
                {user.status}
              </div>
            </div>
            <div className="w-[10%] text-slate-600 text-xs font-bold">{user.nb_dossiers}</div>
            <div className="w-[12%] text-slate-600 text-xs font-bold">
              {user.created_at ? formatIsoDateToFrenchLabel(user.created_at) : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InstallaterLists;