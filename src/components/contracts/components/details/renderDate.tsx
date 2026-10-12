"use client";

import React from "react";
import { DetailContratProps } from "@/types/contratType";
import { Card, SectionTitle } from "@/components/contracts/components/details/contractUI";
import Spinner from "@/components/loader/PanelSprinner";
import { calculateRemainingTime } from "@/components/contracts/components/details/contractUI";
import dayjs from "dayjs";

interface RenderDateProps {
  details: DetailContratProps;
  loading: boolean;
  setSectionToEdit: (section: string) => void;
  selectedAvenantId: number | null;
  setSelectedAvenantId: (id: number | null) => void;
}

export const RenderDate: React.FC<RenderDateProps> = ({
  details,
  loading,
  setSectionToEdit,
  selectedAvenantId,
  setSelectedAvenantId,
}) => {
  const dates = details.date_livraison;
  const signature = details.signature || {};
  const duree = details.duree_contrat_en_mois;

  const dateLivraisonFormattee = dates
    ? new Date(dates).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  const endDate = dayjs(dates).endOf("day");
  const today = dayjs().startOf("day");
  const { months: monthsToDisplay, days: daysToDisplay } = calculateRemainingTime(endDate, today);

  let contractStatus = "";
  let contractStatusColor = "text-[#59b595]";
  if (endDate.isBefore(today, "day")) {
    contractStatus = "Contrat expiré";
    contractStatusColor = "text-red-600";
  } else if (endDate.isSame(today, "day")) {
    contractStatus = "Contrat expiré aujourd'hui";
    contractStatusColor = "text-red-600";
  } else if (endDate.diff(today, "day") === 1) {
    contractStatus = "Contrat expire demain";
    contractStatusColor = "text-yellow-600";
  }

  let remainingTextColor = "text-[#59b595]";
  if (monthsToDisplay === 0 && daysToDisplay === 0) {
    remainingTextColor = "text-red-600";
  } else if (monthsToDisplay === 0 && daysToDisplay <= 5) {
    remainingTextColor = "text-yellow-600";
  }

  return (
    <div className="flex flex-col gap-5 flex-1">
      <SectionTitle title="Dates" onEdit={() => setSectionToEdit("Dates")} />
      <Card>
        {loading ? (
          <div className="flex justify-center items-center w-full h-48">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {/* ---- Contrat principal ---- */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-3">Contrat principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-gray-900 font-medium">Date de livraison :</span>
                  <div className="text-gray-900 font-semibold">
                    {dateLivraisonFormattee ?? "—"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-900 font-medium">Date de signature :</span>
                  <div className="text-gray-900 font-semibold">
                    {signature?.signature_date
                      ? signature.signature_date.split("-").reverse().join("/")
                      : "—"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-900 font-medium">Durée :</span>
                  <div>
                    {duree} mois
                    {contractStatus ? (
                      <span className={`ml-2 font-semibold ${contractStatusColor}`}>
                        | {contractStatus} |
                      </span>
                    ) : (
                      <span className={`ml-2 font-bold ${remainingTextColor}`}>
                        | Restant :
                        {monthsToDisplay > 0 && ` ${monthsToDisplay} mois`}
                        {daysToDisplay > 0 &&
                          ` et ${daysToDisplay} jour${daysToDisplay > 1 ? "s" : ""}`} |
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Avenants ---- */}
            {selectedAvenantId && Array.isArray(details.avenants) && details.avenants.length > 0 && (
                <div className="mt-2 border-t pt-4">
                  <h4 className="text-gray-800 font-semibold mb-3">Avenants</h4>
                  <div className="flex flex-col gap-3">
                    {[...details.avenants].reverse().map((avenantItem, idx) => {
                      const avenantId = avenantItem.id;
                      // Recherche si c'est l'avenant sélectionné
                      const isSelected = selectedAvenantId === avenantId;

                      // Trouver le contratName directement
                      const contratName = avenantItem.contrat_name || `Avenant #${idx + 1}`;

                      const dateLivraison = avenantItem.date_livraison;
                      const signatureDate = avenantItem.signature?.signature_date;

                      // Si aucune date, on peut ignorer cet avenant
                      if (!dateLivraison && !signatureDate) return null;

                      return (
                        <div
                          key={avenantId ?? idx}
                          onClick={() => setSelectedAvenantId(avenantId)}
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
                            {contratName}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                            {dateLivraison && (
                              <div>
                                <span className="text-gray-900 font-medium">Date Livraison :</span>
                                <div className="text-gray-900 font-semibold">{dateLivraison}</div>
                              </div>
                            )}
                            {signatureDate && (
                              <div>
                                <span className="text-gray-900 font-medium">Date Signature :</span>
                                <div className="text-gray-900 font-semibold">{signatureDate}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        )}
      </Card>
    </div>
  );
};