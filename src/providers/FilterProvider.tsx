"use client"; // Indique que ce fichier est exécuté côté client (Next.js)

// import { GetParams } from "@/types/filterType";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";

// Définition du type autorisé pour les valeurs de filtre
type FilterValue = string | number | boolean | (string | number)[] | undefined;

// Interface du contexte (ce que les composants pourront utiliser via `useFilter`)
interface FilterContextType {
  // Données filtrées (ex : résultats d'une API)
  data: Record<string, unknown>[];
  setData: React.Dispatch<React.SetStateAction<Record<string, unknown>[]>>;

  // Filtres actifs (page, éléments par page, et autres possibles)
  filters: {
    page: number;
    per_page: number;
    [key: string]: FilterValue;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    page: number;
    per_page: number;
    [key: string]: FilterValue;
  }>>;

  // Nombre total d'éléments (pour la pagination)
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;

  // Indique si les filtres sont en cours de traitement (ex : API en cours)
  processingFilter: boolean;
  setProcessingFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

// Création du contexte avec une valeur par défaut `undefined`
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider pour encapsuler une partie de l'app avec les filtres
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Données filtrées
  const [data, setData] = useState<Record<string, unknown>[]>([]);

  // Valeurs des filtres, initialisé avec page=1 et 10 éléments par page
  const [filters, setFilters] = useState<{
    page: number;
    per_page: number;
    [key: string]: FilterValue;
  }>({
    page: 1,
    per_page: 10,
  });

  // Nombre total d'éléments (utile pour la pagination)
  const [totalItems, setTotalItems] = useState<number>(0);

  // Booléen qui indique si les données sont en cours de chargement
  const [processingFilter, setProcessingFilter] = useState<boolean>(false);

  // Mémorise les valeurs du contexte pour éviter les re-rendus inutiles
  const value = useMemo(
    () => ({
      data,
      setData,
      filters,
      setFilters,
      totalItems,
      setTotalItems,
      processingFilter,
      setProcessingFilter,
    }),
    [data, setData, filters, setFilters, totalItems, setTotalItems, processingFilter, setProcessingFilter]
  );

  // Fournit le contexte aux composants enfants
  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

// Hook personnalisé pour consommer facilement le contexte dans les composants
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
