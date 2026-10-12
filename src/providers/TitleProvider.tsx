"use client"; // Required for state management in Next.js 15

import { createContext, useState, useContext, ReactNode, JSX, useMemo } from "react";

interface TitleContextType {
    title: string | JSX.Element;
    setTitle: React.Dispatch<React.SetStateAction<string | JSX.Element>>;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState<string | JSX.Element>("");

    const value = useMemo(() => ({ title, setTitle }), [title, setTitle]);

    return (
        <TitleContext.Provider value={value}>
            {children}
        </TitleContext.Provider>
    );
};

export const useTitle = () => {
    const context = useContext(TitleContext);
    if (!context) {
        throw new Error("useTitle must be used within a TitleProvider");
    }
    return context;
};
