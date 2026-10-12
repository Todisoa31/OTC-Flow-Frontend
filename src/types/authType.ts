export type LoginResponse = {
    access: string
    refresh: string
    user: User
}

export type User = Omit<RegisterPayload, 'user_id'> & {
    id: number;
}

export type RegisterPayload = {
    user_id?: number;
    email: string;
    password: string;
    role: string;
    firstname: string;
    lastname: string;
    photo_profil?: string;
    fcm_token?: string[] | any[];
}

export type Role = 'Installateur' | 'Contrôleur' | 'Admin' | 'Head Origination' | 'Analyste' | 'Référent' | 'COFRAC';
