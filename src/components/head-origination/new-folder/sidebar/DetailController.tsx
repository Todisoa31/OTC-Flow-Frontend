import React, { use, useEffect } from "react";

import ArrowLeftIcon from "@/assets/icons/ArrowLefttIcon";
import ProgressCircle from "@/components/inputs/ProgressCircle";
import { useTeamMember } from "@/providers/TeamProvider";
import Input from "@/components/inputs/Input";
import Button from "@/components/inputs/Button";
import Modal from "@/components/popup/Modal";
import { updateThresholdController } from "@/api/recordControllerApi";
import { formatHoursSeconde, formatSessionDuration } from "@/utils/getHourMinute";

type Props = {
  setControllerDetail: React.Dispatch<React.SetStateAction<Boolean>>;
  refreshControllers: () => void;
  control: string;
};
const DetailController = (props: Props) => {
  const { setControllerDetail, refreshControllers, control } = props;
  const { detailControllerRetrieved, setDetailControllerRetrieved } =
    useTeamMember();
  const [thresholdUpdate, setThresholdUpdate] = React.useState<string | null>(
    detailControllerRetrieved?.user.daily_dossier_threshold.toString() ?? ""
  );
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const handleChangeInputHandler = (value: string) => {
    setThresholdUpdate(value === "" ? null : value);
  };

  const updateSeuilControllerHandler = async () => {
    if (
      Number(thresholdUpdate) ===
      detailControllerRetrieved?.user.daily_dossier_threshold
    ) {
      alert("C'est le meme seuil que l'ancien, veuillez le modifier");
      return;
    }
    try {
      if (
        detailControllerRetrieved === undefined ||
        detailControllerRetrieved?.user.id === undefined
      )
        return;

      const response = await updateThresholdController(
        detailControllerRetrieved?.user.id,
        Number(thresholdUpdate)
      );
      setDetailControllerRetrieved((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: {
            ...prev.user,
            daily_dossier_threshold: Number(thresholdUpdate),
          },
        };
      });
      if (!response) return;
    } catch (error) {
      console.error("Error updating controller threshold:", error);
    } finally {
      setShowConfirmModal(false);
    }
  };
  useEffect(() => {
    if (detailControllerRetrieved?.user.daily_dossier_threshold !== undefined) {
      setThresholdUpdate(
        detailControllerRetrieved.user.daily_dossier_threshold.toString()
      );
    }
  }, [detailControllerRetrieved]);

  return (
    <div className="w-[23%] self-stretch p-7 bg-white/40 border-l border-white backdrop-blur-lg inline-flex flex-col justify-start items-start gap-7">
      <div className="self-stretch inline-flex justify-start items-center gap-3.5">
        <button
          onClick={() => {
            setControllerDetail(false);
            refreshControllers();
          }}
          className="w-7 h-7 bg-white rounded-[5px] flex justify-center items-center gap-2.5"
        >
          <ArrowLeftIcon />
        </button>
        <div className="justify-start text-gray-900 text-base font-bold  leading-none">
          Charge de travail
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-center gap-2.5">
        <div className="flex flex-col justify-start items-center gap-2.5">
          <div className="w-12 h-12 relative inline-flex justify-start items-center gap-2.5">
            <div className="w-2.5 h-2.5 left-[40px] top-[40px] absolute bg-slate-400 rounded-full border border-white" />
            <div
              className={`w-2.5 h-2.5 left-[40px] top-[40px] absolute ${
                detailControllerRetrieved?.user.is_connected
                  ? "bg-emerald-300"
                  : "bg-[#96A8B8]"
              } rounded-full outline outline-2 outline-white`}
            />
            <img
              className="w-12 h-12 rounded-[5px]"
              src={
                detailControllerRetrieved?.user.photo_profil ||
                "/images/usProfil.jpg"
              }
              alt={
                detailControllerRetrieved?.user.firstname +
                " " +
                detailControllerRetrieved?.user.lastname
              }
            />
          </div>
          <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
            {detailControllerRetrieved?.user.firstname}{" "}
            {detailControllerRetrieved?.user.lastname}
          </div>
        </div>
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-3.5">
        <div className="self-stretch px-3.5 py-4 bg-white rounded-2xl flex justify-center items-center gap-2.5">
          <ProgressCircle
            value={Number(
              detailControllerRetrieved?.assigned_dossier
            )}
            total={Number(
              detailControllerRetrieved?.user.daily_dossier_threshold
            )}
            size={60}
          />
        </div>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="justify-start text-gray-500 text-xs font-medium ">
            Seuil de traitement quotidien
          </div>
          <div className="self-stretch h-10 rounded-[10px] inline-flex justify-start items-center gap-2.5">
            <Input
              type="number"
              onChange={handleChangeInputHandler}
              value={thresholdUpdate?.toString() ?? ""}
              className="text-dark-blue w-full"
            />
          </div>
          <Button
            label="Modifier seuil"
            onClick={() => {
              setShowConfirmModal(true);
            }}
            width="w-auto"
          />
        </div>
      </div>
      {/* <div className="self-stretch flex flex-col justify-start items-start gap-5">
        <div className="self-stretch h-2 justify-start text-gray-900 text-sm font-bold  leading-none">
          Bonus :
        </div>
        <div className="self-stretch bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg flex flex-col justify-start items-start">
          <div className="self-stretch p-3.5 inline-flex justify-center items-center gap-2.5">
            <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
              Actif
            </div>
            <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
              10 dossiers
            </div>
          </div>
        </div>
      </div> */}
      <div className="self-stretch flex flex-col justify-start items-start gap-5">
        <div className="self-stretch h-2 justify-start text-gray-900 text-sm font-bold  leading-none">
          Aujourd’hui :
        </div>
        <div className="self-stretch bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg flex flex-col justify-start items-start">
          <div className="self-stretch p-3.5 border-b border-gray-900/10 inline-flex justify-center items-center gap-2.5">
            <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
              Dossiers traités
            </div>
            <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
              {detailControllerRetrieved?.treated_dossier}
            </div>
          </div>
          <div className={`self-stretch p-3.5 ${control==='controlleur' ? "border-gray-900/10  border-b":""} inline-flex justify-center items-center gap-2.5`}>
            <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
              Dossiers en cours
            </div>
            <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
              {Number(detailControllerRetrieved?.assigned_dossier) - Number(detailControllerRetrieved?.treated_dossier)}
            </div>
          </div>
          {control==='controlleur' && <div className="self-stretch p-3.5 inline-flex justify-center items-center gap-2.5">
            <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
              Heures effectuées
            </div>
            <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
              {formatHoursSeconde(Number(detailControllerRetrieved?.worktime) ?? 0)}
            </div>
          </div>}
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-5">
        <div className="self-stretch h-2 justify-start text-gray-900 text-sm font-bold  leading-none">
          Historique :
        </div>
        <div className="self-stretch bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg flex flex-col justify-start items-start">
          <div className="self-stretch p-3.5 border-b border-gray-900/10 inline-flex justify-center items-center gap-2.5">
            <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
              Dossiers traités cette semaine
            </div>
            <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
              {detailControllerRetrieved?.this_week_dossier}
            </div>
          </div>
          <div className="self-stretch p-3.5 border-b border-gray-900/10 inline-flex justify-center items-center gap-2.5">
            <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
              Sur les 10 derniers jours
            </div>
            <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
              {detailControllerRetrieved?.last_10_days_dossier}
            </div>
          </div>
          <div className="self-stretch p-3.5 inline-flex justify-center items-center gap-2.5">
            <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
              Ce mois
            </div>
            <div className="justify-start text-gray-900 text-xs font-bold  leading-none">
              {detailControllerRetrieved?.this_month_dossier}
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-5">
        <div className="self-stretch h-2 justify-start text-gray-900 text-sm font-bold  leading-none">
          Derniers dossiers traités :
        </div>
        <div className="self-stretch relative bg-white/50 rounded-2xl shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] outline outline-[1.50px] outline-white backdrop-blur-lg flex flex-col justify-start items-start">
          {detailControllerRetrieved?.latest_dossiers &&
          detailControllerRetrieved.latest_dossiers.length > 0 ? (
            detailControllerRetrieved.latest_dossiers.map((dossier, index) => (
              <div
                key={index}
                className={`self-stretch p-3.5 border-b ${
                  index === detailControllerRetrieved.latest_dossiers.length
                    ? "border-gray-900/10"
                    : ""
                } inline-flex justify-center items-center gap-2.5`}
              >
                <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
                  {dossier.name}
                </div>
                <div className={`justify-start  text-xs font-bold  leading-none text-[${dossier.status.color_background}]`}>
                  {dossier.status.title}
                </div>
              </div>
            ))
          ) : (
            <div className="self-stretch p-3.5 inline-flex justify-center items-center gap-2.5">
              <div className="flex-1 h-2 justify-start text-gray-500 text-xs font-medium ">
                Aucun dossier traité récemment
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        title="Confirmation de changement de seuil"
        titleClassName="text-gray-900 text-lg font-bold"
        className="w-[500px] h-[400px] bg-white rounded"
        footer={
          <div className="self-stretch flex flex-row justify-start items-end gap-2.5 ml-auto">
            <button
              onClick={() => {
                setShowConfirmModal(false);
              }}
              className="bg-primary-blue text-white px-4 py-2 rounded font-bold text-sm"
            >
              Annuler
            </button>
            <button
              onClick={updateSeuilControllerHandler}
              className="bg-dark-blue text-white px-4 py-2 rounded font-bold text-sm"
            >
              Modifier le seuil
            </button>
          </div>
        }
      >
        <div className="text-sm font-bold text-gray-900 self-stretch p-5 flex flex-row justify-start items-start gap-x-1">
          Etes vous sûre de vouloir modifier le seuil de traitement quotidien ?
        </div>
      </Modal>
    </div>
  );
};

export default DetailController;
