'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteUserById, changeUserStatus } from "@/api/user";
import { toast } from "react-toastify";
import { USER_MANAGEMENT_ROUTE } from "@/constants/routes";
import SuspendedIcon from "@/assets/icons/SuspendedIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
// import DeleteUserModal from "@/components/modal/DeleteUserModal";
import SuspendUserModal from "@/components/modal/SuspendUserModal";
import ConfirmDeleteModal from "@/components/modal/DeleteModal";

type Props = {
  Users: {
    firstname?: string;
    lastname?: string;
    role?: string;
    status?: string;
  };
};

export default function SuspendDeleteButtons({ Users }: Props) {
  const { id } = useParams();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [status, setStatus] = useState(Users?.status);

  useEffect(() => {
    if (Users?.status) setStatus(Users.status);
  }, [Users?.status]);

  const fullName = `${Users.firstname ?? ""} ${Users.lastname ?? ""}`.trim();
  const roleLabel = Users.role ? ` - ${Users.role}` : "";

  const handleDeleteUser = async () => {
    try {
      await deleteUserById(Number(id));
      router.push(USER_MANAGEMENT_ROUTE);
    } catch (error) {
      console.error("Erreur suppression :", error);
      toast.error("Impossible de supprimer l'utilisateur.");
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = status === "Actif" ? "Suspendu" : "Reactif";

    try {
      await changeUserStatus(Number(id), newStatus);
      const updated = newStatus === "Reactif" ? "Actif" : "Suspendu";
      setStatus(updated);
      toast.success(`Statut mis à jour : ${updated}`);
    } catch (error) {
      console.error("Erreur changement de statut :", error);
      toast.error("Impossible de changer le statut.");
    } finally {
      setShowSuspendConfirm(false);
    }
  };

  return (
    <>
      {showSuspendConfirm && (
        <SuspendUserModal
          status={status ?? "Actif"}
          fullName={fullName}
          roleLabel={roleLabel}
          onClose={() => setShowSuspendConfirm(false)}
          onConfirm={handleToggleStatus}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          title="Supprimer cet utilisateur ?"
          message={
            <>
              <p>Cette action est irréversible.</p>
              <p>L’utilisateur sera supprimé et n’aura plus accès à la plateforme.</p>
            </>
          }
          fullName={fullName}
          roleLabel={roleLabel}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteUser}
        />
      )}

      <div className="flex gap-8">
        <button
          type="button"
          onClick={() => setShowSuspendConfirm(true)}
          className={`flex items-center gap-2 px-2 h-10 text-sm font-bold rounded-[10px] ${
            status === "Actif"
              ? "bg-[#FCC567] text-white shadow-[0_10px_40px_rgba(252,197,103,0.7)] hover:bg-yellow-400"
              : "bg-[#2B6670] text-white shadow-[0_10px_40px_rgba(43,102,112,0.4)] hover:bg-[#205158]"
          } transition`}
        >
          <SuspendedIcon />
          {status === "Actif" ? "Suspendre le compte" : "Réactiver le compte"}
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-5 h-10 text-sm font-bold text-white rounded-[10px] bg-[#EC4899] shadow-[0_10px_40px_rgba(236,72,153,0.7)] hover:bg-pink-600 transition"
        >
          <DeleteIcon />
          Supprimer
        </button>
      </div>
    </>
  );
}
