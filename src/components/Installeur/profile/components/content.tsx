"use client";

import { addSubcontractorApi, deleteSubcontractor, getUserInstalleur, updateSubcontractorApi, updateUserInstallerApi } from "@/api/userApi";
import AddIcon from "@/assets/icons/AddIcon";
import DeleteIconV2 from "@/assets/icons/DeleteIconV2";
import EditIconV2 from "@/assets/icons/editIconV2";
import SaveIcon from "@/assets/icons/SaveIcon";
import SaveIconV2 from "@/assets/icons/saveIconV2";
import UploadImageIcon from "@/assets/icons/upladImageIcon";
import { useAuth } from "@/providers/AuthProvider";
import { SubcontractorInputType, UserInstallerUpdateType } from "@/types/userType";
import { ChangeEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type TextFieldType = {
    name: string;
    label?: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileContent() {
    const { user } = useAuth();
    const gotToRef = useRef<HTMLDivElement | null>(null);
    const [create, setCreate] = useState<boolean>(false);
    const [formData, setFormData] = useState<SubcontractorInputType>({
        email: "",
        phone: "",
        company_name: "",
        siren: "",
        legal_representative: "",
        address: "",
    });
    const [formDataUser, setFormDataUser] = useState<UserInstallerUpdateType>({
        photo_profil: null,
        company_name: "",
        siren: "",
        legal_representative: "",
        phone: "",
        address: "",
        email: ""
    });
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fieldChange, setFieldChange] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [subcontractors, setSubcontractors] = useState<SubcontractorInputType[]>([]);

    const getUserInfo = async () => {
        try {
            if (!user) return;
            const res = await getUserInstalleur(Number(user?.id));

            setFormDataUser({
                photo_profil: res?.user?.photo_profil || null,
                company_name: res.installer?.company_name,
                siren: res.installer?.siren,
                legal_representative: res.installer?.legal_representative,
                phone: res.installer?.phone,
                address: res.installer?.address,
                email: res.user?.email || "",
            });

            setSubcontractors(res?.installer?.subcontractors || []);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const detectChange = () => {
        setFieldChange(true);
    };

    const handleUserUpdate: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await updateUserInstallerApi(Number(user?.id), formDataUser);
            if (res?.status === 200) {
                toast.success("Informations mises à jour avec succès.");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour des informations de l'utilisateur.", error);
        } finally {
            setLoading(false);
            setFieldChange(false);
        }
    };

    // CREATE
    const handleSave = async () => {
        try {
            const res = await addSubcontractorApi(Number(user?.id), formData);
            if (res?.status === 200) {
                const newData = {
                    id: res.data.id,
                    email: res.data.email,
                    phone: res.data.phone,
                    company_name: res.data.company_name,
                    siren: res.data.siren,
                    legal_representative: res.data.legal_representative,
                    address: res.data.address,
                };

                setSubcontractors([...subcontractors, newData]);

                handleReset();
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'ajout du sous-traitant.", error);
        }
    };

    const handleEditToggle = () => {
        if (create) {
            // save CREATE
            handleSave()

        } else {
            setCreate(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setCreate(false);
        setFormData({
            email: "",
            phone: "",
            company_name: "",
            siren: "",
            legal_representative: "",
            address: "",
        })
    };

    useEffect(() => {
        if (create && gotToRef.current) {
            gotToRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [create]);

    const handleDelete = async (id: number) => {
        try {
            if (!id) return;
            const res = await deleteSubcontractor(id);
            if (res?.status === 200) {
                toast.success("Sous-traitant supprimé avec succès.");
                setSubcontractors(subcontractors.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression du sous-traitant", error);
        }
    };

    return (
        <div className=" h-[88vh] overflow-y-auto p-[30px] flex flex-col gap-8">
            <div className=" flex items-center flex-col gap-2 ">
                <div className=" relative">
                    <img
                        src={
                            previewImage
                                ? previewImage
                                : typeof formDataUser.photo_profil === "string"
                                    ? formDataUser.photo_profil
                                    : "/images/usProfil.jpg"
                        }
                        alt="user" className=" h-[80px] w-[80px] rounded-full" />
                    <button className=" absolute bottom-0 right-0" onClick={() => inputFileRef.current?.click()}>
                        <UploadImageIcon />
                    </button>
                    <input
                        type="file"
                        className=" hidden"
                        ref={inputFileRef}
                        onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                                setFormDataUser({ ...formDataUser, photo_profil: file });
                                setPreviewImage(URL.createObjectURL(file));
                                detectChange();
                            }
                        }}
                    />
                </div>
                <h2 className=" text-[#3A5F6E] text-[14px] ">{`${user?.firstname} ${user?.lastname}`}</h2>
            </div>

            <div className=" flex flex-col gap-2 shadow-sm rounded-[20px]">
                <span className=" text-[#101828] text-[24px] font-bold">Informations légales</span>
                <form onSubmit={handleUserUpdate} className=" p-[30px] bg-[#FFFFFF66] rounded-[20px] flex flex-col gap-4">
                    <div className=" grid grid-cols-2 gap-4 ">
                        <TextField name="social_reason" label="Raison sociale :" value={formDataUser?.company_name} onChange={(e) => {
                            setFormDataUser({ ...formDataUser, company_name: e.target.value })
                            detectChange()
                        }} />
                        <TextField name="siren" label="SIREN :" value={formDataUser?.siren} onChange={(e) => {
                            setFormDataUser({ ...formDataUser, siren: e.target.value })
                            detectChange()
                        }} />
                        <TextField name="legal_represent" label="Représentant légal :" value={formDataUser?.legal_representative} onChange={(e) => {
                            setFormDataUser({ ...formDataUser, legal_representative: e.target.value })
                            detectChange()
                        }} />
                        <TextField name="email" label="Email :" value={formDataUser?.email} onChange={(e) => {
                            setFormDataUser({ ...formDataUser, email: e.target.value })
                            detectChange()
                        }} />
                        <TextField name="phone" label="Téléphone :" value={formDataUser?.phone} onChange={(e) => {
                            setFormDataUser({ ...formDataUser, phone: e.target.value })
                            detectChange()
                        }} />
                        <TextField name="address" label="Adresse :" value={formDataUser?.address} onChange={(e) => {
                            setFormDataUser({ ...formDataUser, address: e.target.value })
                            detectChange()
                        }} />
                    </div>
                    <div className=" w-full flex justify-end">
                        {
                            fieldChange &&
                            <button
                                className=" flex items-center w-fit justify-center gap-2 bg-[#65A5BF] text-white font-bold py-2 px-3 rounded-[10px] shadow-xl">
                                <SaveIcon active={true} />
                                Enregistrer
                            </button>
                        }
                    </div>
                </form>
            </div>

            <div className=" flex flex-col gap-2">
                <div className=" flex flex-col gap-4">
                    {/* mapping */}
                    {subcontractors &&
                        subcontractors.map((item) => (
                            <TraitsCard key={item.id} data={item} handleDelete={handleDelete} />
                        ))
                    }

                    {create &&
                        <div className="rounded-[15px] p-[15px] bg-[#FFFFFF66] flex flex-col gap-4">
                            <div className="flex justify-end items-center">
                                <div className="flex items-center gap-2">
                                    <button onClick={handleEditToggle}>
                                        <SaveIconV2 />
                                    </button>
                                    <button onClick={handleReset}>
                                        <DeleteIconV2 />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    id="company_name"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className={`p-4 rounded-[10px] text-[12px] text-[#3A5F6E] outline-none bg-white`}
                                    placeholder="Raison sociale"
                                />
                                <input
                                    type="text"
                                    id="siren"
                                    name="siren"
                                    value={formData.siren}
                                    onChange={handleChange}
                                    className={`p-4 rounded-[10px] text-[12px] text-[#3A5F6E] outline-none bg-white`}
                                    placeholder="SIREN ..."
                                />
                                <input
                                    type="text"
                                    id="legal_representative"
                                    name="legal_representative"
                                    value={formData.legal_representative}
                                    onChange={handleChange}
                                    className={`p-4 rounded-[10px] text-[12px] text-[#3A5F6E] outline-none bg-white`}
                                    placeholder="Représentant légal ..."
                                />
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`p-4 rounded-[10px] text-[12px] text-[#3A5F6E] outline-none bg-white`}
                                    placeholder="Email ..."
                                />
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`p-4 rounded-[10px] text-[12px] text-[#3A5F6E] outline-none bg-white`}
                                    placeholder="Téléphone ..."
                                />

                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`p-4 rounded-[10px] text-[12px] text-[#3A5F6E] outline-none bg-white`}
                                    placeholder="Adresse ..."
                                />
                            </div>
                        </div>
                    }

                    <div ref={gotToRef}></div>

                    {!create &&
                        <button
                            onClick={() => setCreate(true)}
                            className=" w-full font-bold border border-dashed text-[#3A5F6E] border-gray-400 flex items-center justify-center gap-2 rounded-[10px] p-[15px] bg-white"
                        >
                            <AddIcon color="#3A5F6E" />
                            Ajouter un sous-traitant
                        </button>
                    }
                </div>
            </div>


        </div>
    )
};


const TextField = ({ label, name, value, onChange }: TextFieldType) => {
    return (
        <div className=" flex flex-col gap-1">
            <label className=" text-[#3A5F6E] text-[14px]" htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type="text"
                className="border  text-[#3A5F6E] outline-none p-3 rounded-[10px] text-[14px]"
                value={value}
                onChange={(e) => onChange(e)}
            />
        </div>
    )
}

type PropsTraitsCard = {
    data: SubcontractorInputType;
    handleDelete?: (id: number) => void;
}
const TraitsCard = ({ data, handleDelete }: PropsTraitsCard) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [confirmDelte, setConfirmDelete] = useState<boolean>(false);


    const [formData, setFormData] = useState<SubcontractorInputType>({
        email: data.email || "",
        phone: data.phone || "",
        company_name: data.company_name || "",
        siren: data.siren || "",
        legal_representative: data.legal_representative || "",
        address: data.address || "",
    });

    const handleUpdate = async () => {
        try {
            if (!data?.id) return;

            const res = await updateSubcontractorApi(data?.id, formData);
            if (res?.status === 200) {
                toast.success("Sous-traitant mis à jour avec succès.");
            }

            setEdit(false);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la mise à jour du sous-traitant", error);
        }

    };

    const handleEditToggle = () => {
        if (edit) {
            handleUpdate();
        } else {
            setEdit(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    return (
        <div className="rounded-[15px] p-[15px] bg-[#FFFFFF66] flex flex-col gap-4 shadow-md">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                    <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        readOnly={!edit}
                        className={`p-2 rounded-lg text-[#101828] text-[14px] font-bold outline-none bg-transparent ${edit && 'border'}`}
                        placeholder="Ex: Solenelec"
                    />
                    <input
                        type="text"
                        id="siren"
                        name="siren"
                        value={formData.siren}
                        onChange={handleChange}
                        readOnly={!edit}
                        className={`p-2 rounded-lg text-[12px] text-[#3A5F6E] outline-none bg-transparent ${edit && 'border'}`}
                        placeholder="SIREN"
                        maxLength={20}
                    />
                </div>
                {
                    confirmDelte ?
                        <div className="flex items-center gap-2">
                            <button className=" text-white bg-[#C80043] p-[8px] rounded-[10px] text-[12px] shadow-md" onClick={() => {
                                handleDelete && data.id !== undefined && handleDelete(data.id);
                                setConfirmDelete(false);
                            }}>Confirmer</button>
                            <button className=" bg-[#1018280D] text-[#3A5F6E] p-[8px] rounded-[10px] text-[12px] shadow-md" onClick={() => setConfirmDelete(false)}>Annuler</button>
                        </div>
                        :
                        <div className="flex items-center gap-2">
                            <button onClick={handleEditToggle}>
                                {edit ? <SaveIconV2 /> : <EditIconV2 />}
                            </button>
                            <button onClick={() => setConfirmDelete(true)}>
                                <DeleteIconV2 />
                            </button>
                        </div>
                }
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Représentant légal */}
                <div className="flex flex-col gap-1 bg-[#FFFFFF66] shadow-sm p-2 rounded-[10px]">
                    <label htmlFor="legal_representative" className="text-[#3A5F6E] text-[12px] px-2">Représentant légal</label>
                    <input
                        type="text"
                        id="legal_representative"
                        name="legal_representative"
                        value={formData.legal_representative}
                        onChange={handleChange}
                        readOnly={!edit}
                        className={`p-2 rounded-lg text-[12px] text-[#3A5F6E] outline-none bg-transparent ${edit && 'border'}`}
                        placeholder="Représentant légal"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1 bg-[#FFFFFF66] shadow-sm p-2 rounded-[10px]">
                    <label htmlFor="email" className="text-[#3A5F6E] text-[12px] px-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={!edit}
                        className={`p-2 rounded-lg text-[12px] text-[#3A5F6E] outline-none bg-transparent ${edit && 'border'}`}
                        placeholder="Email"
                    />
                </div>

                {/* Téléphone */}
                <div className="flex flex-col gap-1 bg-[#FFFFFF66] shadow-sm p-2 rounded-[10px]">
                    <label htmlFor="phone" className="text-[#3A5F6E] text-[12px] px-2">Téléphone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        readOnly={!edit}
                        className={`p-2 rounded-lg text-[12px] text-[#3A5F6E] outline-none bg-transparent ${edit && 'border'}`}
                        placeholder="Téléphone"
                    />
                </div>

                {/* Adresse */}
                <div className="flex flex-col gap-1 bg-[#FFFFFF66] shadow-sm p-2 rounded-[10px]">
                    <label htmlFor="address" className="text-[#3A5F6E] text-[12px] px-2">Adresse</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        readOnly={!edit}
                        className={`p-2 rounded-lg text-[12px] text-[#3A5F6E] outline-none bg-transparent ${edit && 'border'}`}
                        placeholder="Adresse"
                    />
                </div>
            </div>

        </div>
    );
}