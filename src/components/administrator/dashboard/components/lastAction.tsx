"use client";

import { useState, useEffect } from "react";
import { GetAuditLog } from "@/api/audit";
import { GetFolders } from "@/api/folderApi";
import { getUsersV2 } from "@/api/user";

import { ActivityLogType } from "@/types/auditType";
import { FolderOutputType } from "@/types/folderType";
import { User } from "@/types/authType";

import { formatTimestamp } from "@/utils/getHourMinute";

import ValidationRateIcon from "@/assets/icons/dashboard/ValidationRateIcon";
import ReloadIcon from "@/assets/icons/ReloadIcon";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ADMIN_HISTORY_AND_ACTIVITY_LOG, USER_MANAGEMENT_ROUTE } from "@/constants/routes";

type UserRole = { title: string } | string | null | undefined;

type CardType = {
  title: string;
  value: number;
  icon: React.ReactNode;
  option: "%" | "jrs";
};

export default function LastActions() {
  const router = useRouter();

  const [historiques, setHistoriques] = useState<ActivityLogType[]>([]);
  const [validationRate, setValidationRate] = useState<number>(0);
  const [usersByRole, setUsersByRole] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [historyRes, foldersRes, usersRes] = await Promise.all([
          GetAuditLog({ page: 1, per_page: 3 }),
          GetFolders({ page: 1, per_page: 1000 }),
          getUsersV2({ page: 1, per_page: 1000 }),
        ]);

        // Historique des actions
        setHistoriques(historyRes?.data || []);

        // Taux de validation
        const allFolders = foldersRes?.data || [];
        const validated = allFolders.filter(
          (folder: FolderOutputType) => folder.status?.code === "approved"
        );
        const rate =
          allFolders.length > 0
            ? Math.round((validated.length / allFolders.length) * 100)
            : 0;
        setValidationRate(rate);

        // Utilisateurs par rôle
        const allUsers: User[] = usersRes?.users || [];
        const roleMap: Record<string, number> = {};
        allUsers.forEach((user) => {
          const userRole = user?.role as UserRole;
          const role =
            typeof userRole === "object" && userRole !== null
              ? userRole.title || "Inconnu"
              : userRole || "Inconnu";
          roleMap[role] = (roleMap[role] || 0) + 1;
        });

        setUsersByRole(roleMap);
      } catch (err) {
        console.error("Erreur chargement dashboard", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchAll();
  }, []);

  // === Si chargement en cours, afficher spinner ===
  if (loading) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin h-6 w-6 mb-2" />
        <span>Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[2fr_1fr_2fr] gap-4 w-full">
      {/* Dernières actions */}
      <SectionCard
        title="Dernières"
        subtitle="actions"
        icon={<ReloadIcon />}
        headerAction={
          <button
            onClick={() => router.push(`${ADMIN_HISTORY_AND_ACTIVITY_LOG}/`)}
            className="flex items-center gap-2 py-2 px-3 bg-black shadow-xl rounded-[10px] text-white text-[12px]"
          >
            Voir l&#39;historique
            <ArrowRight />
          </button>
        }
      >
        {historiques.map((item) => (
          <div
            key={item.id}
            className="shadow-xl bg-white rounded-[10px] p-[15px] text-[12px] text-grey flex items-center justify-between"
          >
            <span>{item.description}</span>
            <span>{formatTimestamp(item.timestamp)}</span>
          </div>
        ))}
      </SectionCard>

      {/* Taux de validation */}
      <div className="bg-[url('/images/bg-2.png')] bg-cover rounded-[15px] flex justify-center items-center px-[10px] py-[10px]">
        <Card
          title="Taux de validation"
          value={validationRate}
          option="%"
          icon={<ValidationRateIcon />}
        />
      </div>

      {/* Utilisateurs par rôle */}
      <SectionCard
        title="Répartition"
        subtitle="Utilisateurs par Rôle"
        icon={<ReloadIcon />}
        isTwoColumns
      >
        {Object.entries(usersByRole)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([role, count]) => (
            <div
              key={role}
              className="shadow-xl bg-white rounded-[10px] p-[10px] text-[12px] text-grey flex items-center justify-between"
            >
              <span className="capitalize">{role}</span>
              <span className="font-bold">{count}</span>
            </div>
          ))}

        <button className="w-full flex items-center justify-between py-2 px-3 bg-black shadow-xl rounded-[10px] text-white text-[12px]" 
        onClick={() => router.push(`${USER_MANAGEMENT_ROUTE}/`)}>
          <span>Utilisateur</span>
          <ArrowRight />
        </button>
      </SectionCard>
    </div>
  );
}

// === Taux de validation ===
const Card = ({ icon, value, title, option }: CardType) => {
  return (
    <div className="w-full p-[15px] rounded-[15px] bg-black bg-opacity-50 border-2 border-grey backdrop-blur-sm h-full relative">
      <div className="absolute top-3 left-3">{icon}</div>
      <div className="h-full flex flex-col justify-center items-center gap-2">
        <h6 className="text-[40px] text-white font-bold">
          {value}
          {option}
        </h6>
        <h4 className="text-white text-[14px] font-bold text-center">{title}</h4>
      </div>
    </div>
  );
};

// === Section Card ===
const SectionCard = ({
  title,
  subtitle,
  icon,
  children,
  headerAction,
  isTwoColumns = false,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  isTwoColumns?: boolean;
}) => (
  <div className="border border-white p-[15px] rounded-[15px] bg-[#FFFFFF80] flex flex-col gap-3 h-full">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col gap-1">
          <span className="text-black text-[12px]">{title}</span>
          <span className="text-black text-[18px] font-bold">{subtitle}</span>
        </div>
      </div>
      {headerAction}
    </div>
    <div className={isTwoColumns ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
      {children}
    </div>
  </div>
);