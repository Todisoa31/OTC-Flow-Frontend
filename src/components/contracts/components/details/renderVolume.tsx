"use client";

import React from "react";
import { DetailContratProps, formatLabel } from "@/types/contratType";
import { Card, SectionTitle } from "@/components/contracts/components/details/contractUI";
import Spinner from "@/components/loader/PanelSprinner";

interface RenderVolumeProps {
  details: DetailContratProps;
  loading: boolean;
  setSectionToEdit: (section: string) => void;
  setIsAdding: (section: string | null) => void;
  selectedAvenantId: number | null;
  setSelectedAvenantId: (id: number | null) => void;
}

export const RenderVolume: React.FC<RenderVolumeProps> = ({
  details,
  loading,
  setSectionToEdit,
  setIsAdding,
  selectedAvenantId,
  setSelectedAvenantId,
}) => {
  const volumeTotal = details.mf_volume_total_gwhc;
  const volumeTotalClassique = details.total_classique_gwhc;
  const volumeMensuelContractuel = details.mf_volume_par_mois_gwhc;
  const volumeLivreMois = details.volume_livre_mois;

  return (
    <div className="flex flex-col gap-[20px] flex-1">
      <SectionTitle
        title="Volume"
        onEdit={() => setSectionToEdit("Volume")}
        onAdd={() => setIsAdding("Volume")}
      />
      <Card>
        {loading ? (
          <div className="flex justify-center items-center w-full h-48">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Contrat principal */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-1">Contrat principal</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 p-4">
                <span>
                  Volume total contractuel : <strong>{volumeTotal ?? 0} GWhc</strong>
                </span>
                <span>
                  Volume total livré : <strong>{volumeTotalClassique ?? 0} GWhc</strong>
                </span>
                <span>
                  Volume mensuel contractuel :{" "}
                  <strong>{volumeMensuelContractuel ?? 0} GWhc</strong>
                </span>
                <span>
                  Volume livré ce mois-ci : <strong>{volumeLivreMois ?? 0} GWhc</strong>
                </span>
              </div>
            </div>
            {/* Avenants */}
            {selectedAvenantId &&
              Array.isArray(details.avenants) &&
              details.avenants.length > 0 && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  {[...details.avenants]
                    .reverse()
                    .map((a, idx) => {
                      const avenantId = a.id;
                      const isSelected = selectedAvenantId === avenantId;

                      // Filtrer les volumes avec valeur non nulle/undefined
                      const volumeEntries = Object.entries(a).filter(
                        ([key, val]) =>
                          key.toLowerCase().includes("volume") &&
                          val !== null &&
                          val !== undefined
                      );

                      if (volumeEntries.length === 0) return null;

                      const contratName = a.contrat_name || `Avenant #${idx + 1}`;

                      return (
                        <div
                          key={avenantId ?? idx}
                          onClick={() => setSelectedAvenantId(avenantId)}
                          className={`p-4 rounded-lg cursor-pointer transition-colors border-l-4 ${
                            isSelected
                              ? "border-[#65A5BF] bg-[rgba(101,165,191,0.12)]"
                              : "border-transparent bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`mb-2 font-semibold ${
                              isSelected ? "text-[#65A5BF]" : "text-gray-900"
                            }`}
                          >
                            {contratName}
                          </div>
                          <div className="flex flex-wrap gap-x-8">
                            {volumeEntries.map(([key, val]) => {
                              const displayValue =
                                typeof val === "number" ? val.toFixed(2) : String(val);
                              return (
                                <span key={key}>
                                  {formatLabel(key.split(".").pop() ?? key)} :{" "}
                                  <strong>{displayValue} GWhc</strong>
                                </span>
                              );
                            })}
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