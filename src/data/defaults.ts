import { UserInstallateurType } from "@/types/userType";

export const defautlUserInstaller: UserInstallateurType = {
    user: {
        id: 0,
        email: "",
        role: "",
        profil: {
            id: 0,
            name: 'string',
            description: 'string',
            code: 'string',
        },
        firstname: "",
        lastname: "",
        created_at: "",
        photo_profil: "",
        status: "Actif",
        is_connected: false,
        daily_dossier_threshold: null
    },
    installer: {
        id: 0,
        subcontractors: [
            {
                id: 0,
                company_name: "",
                siren: "",
                legal_representative: "",
                phone: "",
                email: "",
                address: "",
                created_at: "",
                updated_at: "",
                installer: 0
            }
        ],
        company_name: "",
        siren: "",
        legal_representative: "",
        phone: "",
        address: "",
        created_at: "",
        updated_at: "",
        user: 0
    }
}