"use client";

import { createContext, useContext, useState } from "react";

// Type de données que le contexte va partager
type AvenantSelectionContextType = {
  selectedAvenantId: number | null; 
  setSelectedAvenantId: (id: number | null) => void; 
};

// Création du contexte avec des valeurs par défaut
const AvenantSelectionContext = createContext<AvenantSelectionContextType>({
  selectedAvenantId: null,
  setSelectedAvenantId: () => {},
});


export const AvenantSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  // stocké l'ID sélectionné
  const [selectedAvenantId, setSelectedAvenantId] = useState<number | null>(null);

  return (
    <AvenantSelectionContext.Provider value={{ selectedAvenantId, setSelectedAvenantId }}>
      {children} 
    </AvenantSelectionContext.Provider>
  );
};

//simplifie l'accès au contexte dans les composants
export const useAvenantSelection = () => useContext(AvenantSelectionContext);
