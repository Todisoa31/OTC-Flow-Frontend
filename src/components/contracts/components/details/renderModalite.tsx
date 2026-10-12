"use client";

import React from "react";
import { DetailContratProps, formatLabel } from "@/types/contratType";
import { Card, SectionTitle } from "./contractUI";
import Spinner from "@/components/loader/PanelSprinner";
import { HEAD_ORIGINATION_ROUTE, INSTALLER_ROUTE } from "@/constants/routes";
import { usePathname } from "next/navigation";

interface RenderModaliteFinanciereProps {
  details: DetailContratProps;
  loading?: boolean;
  selectedAvenantId: number | null;
  setSelectedAvenantId: (id: number | null) => void;
  onEdit: () => void;
  onAdd: () => void;
}

const toNumber = (val: any) => (!isNaN(Number(val)) ? Number(val).toFixed(2) : val);

export const renderModaliteItem = (item: any): React.ReactNode => {
  if (!item || typeof item !== "object") return null;

  switch (item.type) {
    case "seuil":
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">
            Dossiers inférieurs {item.seuil_display} : <strong>{toNumber(item.prix_inferieurs)} €</strong>
          </span>
          <span className="text-sm text-gray-700">
            Dossiers supérieurs {item.seuil_display} : <strong>{toNumber(item.prix_superieurs)} €</strong>
          </span>
        </div>
      );

    case "cee":
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">
            CEE classique : <strong>{toNumber(item.cee_classique)} €</strong>
          </span>
          <span className="text-sm text-gray-700">
            CEE précarité : <strong>{toNumber(item.cee_precarite)} €</strong>
          </span>
        </div>
      );

    case "simple":
      return (
        <span className="text-sm text-gray-700">
          Prix : <strong>{toNumber(item.value)} €</strong>
        </span>
      );
    
    case "paliers":
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">
            {item.seuil} {item.unit} ( Prix inferieurs ) :{" "}
            <strong>{toNumber(item.prix_inferieurs)} €</strong>
          </span>
          <span className="text-sm text-gray-700">
            {item.seuil} {item.unit} ( Prix superieurs ) :{" "}
            <strong>{toNumber(item.prix_superieurs)} €</strong>
          </span>
        </div>
      );

    default:
      return (
        <div className="flex flex-col gap-1">
          {Object.entries(item)
            .filter(([key]) => !["type", "unit", "seuil", "seuil_display", "original_data"].includes(key))
            .map(([key, value], idx) => (
              <span key={idx} className="text-sm text-gray-700">
                {formatLabel(key)} : <strong>{toNumber(value)} €</strong>
              </span>
            ))}
        </div>
      );
  }
};


const normalizeModalites = (modalite: any) => {
  if (!modalite) return [];
  if (Array.isArray(modalite)) return modalite;
  if (typeof modalite === "object") return [modalite];
  return [];
};

const RenderModaliteFinanciere: React.FC<RenderModaliteFinanciereProps> = ({
  details,
  loading = false,
  selectedAvenantId,
  setSelectedAvenantId,
  onEdit,
  onAdd,
}) => {
  const pathname = usePathname();

  const modalite_financiere = normalizeModalites(details.tarification_structure);
  const somme_globale = details.prix_total_ht_par_mwhc ?? 0;

  const shouldShowSommeGB =
    !pathname.includes(HEAD_ORIGINATION_ROUTE) &&
    !pathname.includes(INSTALLER_ROUTE);

  const avenantsWithModalites =
    (details.avenants ?? []).filter(
      (a) =>
        a.tarification_structure &&
        (Array.isArray(a.tarification_structure) || typeof a.tarification_structure === "object")
    ) || [];

  return (
    <div className="flex flex-col gap-[20px] flex-1">
      <SectionTitle title="Modalité financière" onEdit={onEdit} onAdd={onAdd} />

      <Card>
        {loading ? (
          <div className="flex justify-center items-center w-full h-48">
            <Spinner />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {/* Contrat principal */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-1">Contrat principal</h3>
              <div className="flex flex-col gap-y-3 p-4">
                {shouldShowSommeGB && (
                  <span>
                    Somme globale HT par MWhc : <strong>{somme_globale.toFixed(2)} €</strong>
                  </span>
                )}

                {modalite_financiere.length > 0 && (
                  <div className="grid grid-cols-2 gap-6">
                    {modalite_financiere.map((item, i) => (
                      <div key={i} className="flex flex-col gap-y-1 p-3 border rounded-lg shadow-sm">
                        {renderModaliteItem(item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Avenants */}
            {avenantsWithModalites.length > 0 && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {[...avenantsWithModalites].reverse().map((a, idx) => {
                  const isSelected = selectedAvenantId === a.id;
                  const modalitesArr = normalizeModalites(a.tarification_structure);

                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAvenantId(a.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors border-l-4 ${
                        isSelected
                          ? "border-[#65A5BF] bg-[#65A5BF]/20"
                          : "border-transparent bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`mb-2 font-semibold ${
                          isSelected ? "text-[#65A5BF]" : "text-gray-900"
                        }`}
                      >
                        {a.contrat_name || `Avenant #${idx + 1}`}
                      </div>

                      <div className="flex flex-col gap-y-3 p-2">
                        {modalitesArr.length > 0 ? (
                          <div className="grid grid-cols-2 gap-6">
                            {modalitesArr.map((item, i) => (
                              <div
                                key={i}
                                className="flex flex-col gap-y-1 p-3 border rounded-lg shadow-sm"
                              >
                                {renderModaliteItem(item)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Aucune modalité définie</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RenderModaliteFinanciere;
