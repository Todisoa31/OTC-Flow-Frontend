"use client";

import React from "react";
import { DetailContratProps, FicheOperation } from "@/types/contratType";
import { SectionTitle } from "@/components/contracts/components/details/contractUI";
import Spinner from "@/components/loader/PanelSprinner";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import { HEAD_ORIGINATION_ROUTE, INSTALLER_ROUTE } from "@/constants/routes";
import { usePathname } from "next/navigation";

interface RenderFicheOpProps {
  details: DetailContratProps;
  fichesOp: { category: string; data: FicheOperation[] }[];
  selectedCodes: string[];
  setSelectedCodes: React.Dispatch<React.SetStateAction<string[]>>;
  loadingSections: { [key: string]: boolean };
  selectedAvenantId: number | null;
  setSelectedAvenantId: (id: number | null) => void;
  onEdit: () => void;
  onAdd: () => void;
  onDelete: () => void;
}

export const RenderFicheOp: React.FC<RenderFicheOpProps> = ({
  details,
  fichesOp,
  selectedCodes,
  setSelectedCodes,
  loadingSections,
  selectedAvenantId,
  setSelectedAvenantId,
  onEdit,
  onAdd,
  onDelete,
}) => {
  const pathname = usePathname();

  const toggleCode = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleAllCategory = (codes: string[]) => {
    const allSelected = codes.every((code) => selectedCodes.includes(code));
    if (allSelected) {
      setSelectedCodes((prev) => prev.filter((c) => !codes.includes(c)));
    } else {
      setSelectedCodes((prev) => [...new Set([...prev, ...codes])]);
    }
  };

  const canShowCheckboxAndHover =
    !pathname.includes(HEAD_ORIGINATION_ROUTE) &&
    !pathname.includes(INSTALLER_ROUTE);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title="Fiche opération"
        onEdit={onEdit}
        onAdd={onAdd}
        onDelete={onDelete}
        hasSelection={selectedCodes.length > 0}
      />

      {fichesOp.length > 0 ? (
        fichesOp.map(({ category, data }) => {
          const codesInCategory = (data as FicheOperation[]).map(
            (fiche) => (fiche as unknown as string) ?? "Code manquant"
          );

          return (
            <div key={category} className="flex flex-col gap-2">
              {/* Catégorie + case à cocher */}
              <div className="flex items-center justify-between pr-4">
                <h4 className="pl-4 capitalize">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>

                {canShowCheckboxAndHover && (
                  <input
                    type="checkbox"
                    onChange={() => toggleAllCategory(codesInCategory)}
                    checked={codesInCategory.every((code) =>
                      selectedCodes.includes(code)
                    )}
                    className="w-5 h-5 cursor-pointer accent-[#f30404]"
                  />
                )}
              </div>

              {loadingSections[category] ? (
                <div className="flex justify-center items-center w-full">
                  <Spinner />
                </div>
              ) : (
                <div className="flex flex-wrap bg-[#FEFEFE]/40 shadow-md rounded-[10px] border border-white/70 backdrop-blur-[10px] p-4 gap-2">
                  {codesInCategory.map((code, index) => {
                    const isSelected = selectedCodes.includes(code);

                    return (
                      <span
                        key={index}
                        onClick={() => toggleCode(code)}
                        className={`group relative px-3 py-2 cursor-pointer shadow-md rounded-[5px] border backdrop-blur-[10px] text-sm font-medium text-center flex items-center gap-2 transition-colors
                          ${
                            canShowCheckboxAndHover
                              ? isSelected
                                ? "bg-[#f30404] border-[#65A5BF] text-[#3A5F6E]"
                                : "bg-[#FEFEFE]/40 border-[#65A5BF] text-[#3A5F6E]"
                              : ""
                          }`}
                      >
                        <span>{code}</span>

                        {canShowCheckboxAndHover && (
                          <span
                            className={`absolute inset-0 flex items-center justify-center
                              ${
                                isSelected
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                          >
                            <DeleteIcon color="#f30404" isSelected={isSelected} />
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 italic">
          Aucune fiche d’opération disponible.
        </div>
      )}

      {/* ---- Modifications avenants ---- */}
      {selectedAvenantId && Array.isArray(details.avenants) && details.avenants.length > 0 && (
        <div className="mt-4 space-y-4 border-t pt-4">
            {details.avenants
            .slice()
            .reverse()
            .map(({ id, contrat_name, modification_avenant }) =>
                Array.isArray(modification_avenant) && modification_avenant.length > 0
                ? modification_avenant.map(({ avenant, modification }, idx) => {
                    const ficheOpModifs = Object.entries(modification).filter(
                        ([key]) => key.toLowerCase().includes("fiche_op")
                    );

                    if (ficheOpModifs.length === 0) return null;

                    const isSelected = selectedAvenantId === avenant;

                    return (
                        <div
                        key={`${id}-${idx}`}
                        onClick={() => setSelectedAvenantId(avenant)}
                        className={`pl-4 border-l-4 p-2 rounded cursor-pointer transition-colors ${
                            isSelected
                            ? "border-[#65A5BF] bg-[#65a6bf41]"
                            : "border-green-500 bg-green-50 hover:bg-green-100"
                        }`}
                        >
                        <div className={`text-green-700 font-semibold mb-2`}>
                            {contrat_name ?? `Avenant ${avenant}`}
                        </div>

                        {ficheOpModifs.map(([key, val]) => {
                            const valeurObj = val as { ancienne_valeur?: any; nouvelle_valeur?: any };
                            const nouvellesFiches = Array.isArray(valeurObj.nouvelle_valeur)
                            ? valeurObj.nouvelle_valeur
                            : [valeurObj.nouvelle_valeur].filter(Boolean);

                            return (
                            <div key={key} className="flex flex-wrap gap-2">
                                {nouvellesFiches.map((ficheCode, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-2 bg-[#FEFEFE]/40 shadow-md rounded-[5px] border border-white/70 backdrop-blur-[10px] text-[#3A5F6E] text-sm font-medium text-center"
                                >
                                    {ficheCode ?? "Code manquant"}
                                </span>
                                ))}
                            </div>
                            );
                        })}
                        </div>
                    );
                    })
                : null
            )}
        </div>
       )}
    </div>
  );
};
