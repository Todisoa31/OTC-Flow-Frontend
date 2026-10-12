"use client";;
import { User } from "@/types/authType";

import {
    createContext,
    useState,
    useContext,
    ReactNode,
    Dispatch,
    SetStateAction, useMemo
} from "react";

interface AuthContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

const authContext: AuthContextType = {
    user: null,
    setUser: () => {},
}

const CreateAuthContext = createContext<AuthContextType>(authContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null >(null);

    const contextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
        <CreateAuthContext.Provider value={contextValue}>
            {children}
        </CreateAuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(CreateAuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
