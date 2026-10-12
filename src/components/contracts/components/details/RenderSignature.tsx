"use client";

import React from "react";
import { DetailContratProps, formatLabel } from "@/types/contratType";
import { VolumeInfo, Card, SectionTitle } from "./contractUI";

interface RenderSignatureProps {
  details: DetailContratProps;
  selectedAvenantId: number | null;
  setSelectedAvenantId: (id: number | null) => void;
}

const RenderSignature: React.FC<RenderSignatureProps> = ({
  details,
  selectedAvenantId,
  setSelectedAvenantId,
}) => {
  const signature = details.signature || {};

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionTitle title="Signataire" />
      <Card>
        <div className="flex flex-col items-center justify-center w-full gap-4 px-5">
          {/* ---- Valeurs contrat principal ---- */}
          <div className="flex flex-wrap justify-center gap-x-28 gap-y-4">
            <VolumeInfo label="Ville :" value={signature.signature_ville ?? "—"} />
            <VolumeInfo label="Prénom et nom :" value={signature.signature_vendeur_prenom_nom ?? "—"} />
            <VolumeInfo label="Fonction :" value={signature.signature_vendeur_fonction ?? "—"} />
          </div>

          {/* ---- Valeurs avenants ---- */}
          {selectedAvenantId && (
            Array.isArray(details.avenants) && details.avenants.length > 0 && (
              <div className="mt-4 space-y-4 border-t pt-4 w-full flex flex-col items-center">
                {details.avenants.map(({ modification_avenant }) =>
                  Array.isArray(modification_avenant) && modification_avenant.length > 0
                    ? modification_avenant.map(({ avenant, modification }, idx) => {
                        const signatureModifs = Object.entries(modification).filter(
                          ([key]) => key.toLowerCase().includes("signature")
                        );

                        if (signatureModifs.length === 0) return null;

                        const isSelected = selectedAvenantId === avenant;

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedAvenantId(avenant)}
                            className={`p-4 rounded-lg cursor-pointer transition-colors border-l-4 w-full max-w-3xl ${
                              isSelected
                                ? "border-[#65A5BF] bg-[#65a6bf41]"
                                : "border-transparent bg-white hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`mb-2 font-semibold ${
                                isSelected ? "text-[#65A5BF]" : "text-gray-900"
                              }`}
                            >
                              {details.avenants.find(a => a.id === avenant)?.contrat_name ?? avenant}
                            </div>

                            <div className="flex flex-wrap justify-center gap-16">
                              {signatureModifs.map(([key, val]) => {
                                const valeurObj = val as {
                                  ancienne_valeur?: any;
                                  nouvelle_valeur?: any;
                                };
                                const nouvelleValeur =
                                  valeurObj.nouvelle_valeur !== undefined ? valeurObj.nouvelle_valeur : "—";

                                return (
                                  <VolumeInfo
                                    key={key}
                                    label={`${formatLabel(key.split(".").pop() ?? key)} :`}
                                    value={nouvelleValeur}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    : null
                )}
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
};

export default RenderSignature;
