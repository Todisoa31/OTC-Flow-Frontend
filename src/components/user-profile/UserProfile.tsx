"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Input from "@/components/inputs/Input";
import PasswordInput from "@/components/inputs/PasswordInput";
import Button from "@/components/inputs/Button";
import SaveIcon from "@/assets/icons/SaveIcon";
import CenterSpinner from "../loader/CenterSpinner";
import MagicIcon from "@/assets/icons/MagicIcon";
import { getUserById, updateUserById } from "@/api/user";
import { getProfilesApi } from "@/api/authorisationApi";

// ✅ Interfaces
interface RoleProfile {
  id: number;
  name: string;
  description: string;
  code: string;
}

interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  profil: RoleProfile;
  photo_profil: string;
  created_at: string;
  status: string;
  fcm_token: string;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [rolesDisponibles, setRolesDisponibles] = useState<RoleProfile[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [motDePasse, setMotDePasse] = useState("");

  // Champs modifiables
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingPage(true);
        const [userData, roles] = await Promise.all([
          getUserById(Number(id)),
          getProfilesApi(),
        ]);

        setUser(userData);
        setLastname(userData.lastname);
        setFirstname(userData.firstname);
        setEmail(userData.email);
        setRole(userData.role);
        setRolesDisponibles(roles);
      } catch (error) {
        toast.error("Erreur lors du chargement des informations de l'utilisateur.");
      } finally {
        setLoadingPage(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const genererMotDePasse = () => {
    const generated = Math.random().toString(36).slice(-10);
    setMotDePasse(generated);
  };

  const handleUpdate = async () => {
    if (!user) return;

    try {
      setUpdating(true);
      await updateUserById(user.id, {
        email,
        password: motDePasse || undefined,
        role,
        firstname,
        lastname,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loadingPage || !user) {
    return <CenterSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nom" type="text" value={lastname} onChange={setLastname} />
        <Input label="Prénom" type="text" value={firstname} onChange={setFirstname} />
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <PasswordInput
          label="Mot de passe"
          value={motDePasse}
          onChange={setMotDePasse}
          icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          enableToggle
          onGenerate={genererMotDePasse}
          generateIcon={<MagicIcon active={true} />}
          show={showPassword}
          onToggleShow={() => setShowPassword((prev) => !prev)}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Type de profil :</label>
        <div className="flex flex-wrap gap-3">
          {rolesDisponibles.map((r) => (
            <button
              key={r.name}
              type="button"
              className={`h-[50px] px-[20px] rounded-[10px] text-sm font-medium transition flex items-center justify-center ${
                role === r.name
                  ? "bg-white text-dark-blue border-[3px] border-primary-blue"
                  : "bg-white text-dark-blue hover:bg-primary-blue hover:text-white"
              }`}
              onClick={() => setRole(r.name)}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          label="Enregistrer les modifications"
          iconLeft={<SaveIcon active={true} />}
          onClick={handleUpdate}
          width="w-auto"
          loading={updating}
          disabled={updating}
        />
      </div>
    </div>
  );
}
