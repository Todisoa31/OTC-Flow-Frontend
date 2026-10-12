import CenterSpinner from "@/components/loader/CenterSpinner";
import { useTeamMember } from "@/providers/TeamProvider";
import { ControllerTypeFolder } from "@/types/teamType";
import { getFile } from "@/utils/getFile";
import { useEffect } from "react";

type Props = {
  controllers: ControllerTypeFolder[];
  selectedId?: string | null;
  onChange: (id: string) => void;
  loading: boolean
};

export default function RadioSelectController({
  controllers,
  selectedId,
  onChange,
  loading
}: Props) {
  const { controlAssign } = useTeamMember();

  if (loading) {
    return (
      <CenterSpinner />
    );
  }
  return (
    <div className="self-stretch grid grid-cols-4 gap-2.5">
      {/* Radio caché qui contient la valeur sélectionnée */}
      <input type="radio" value={selectedId ?? ""} hidden readOnly />

      {controllers.map((controller) => (
        <div
          key={controller.id}
          onClick={() => onChange(controller.id)}
          className={`cursor-pointer self-stretch p-2.5 bg-white rounded-[10px] outline  outline-gray-900/10 inline-flex justify-start items-center gap-2.5 ${
            Number(controlAssign?.controller_id) === Number(controller.id)
              ? "outline-[3px] outline-offset-[-3px] outline-primary-blue"
              : "outline-[1.50px] outline-offset-[-1.50px]"
          }`}
        >
          <img
            className="w-8 h-8 rounded-[5px]"
            src={
              getFile(controller.photo ?? "/images/usProfil.jpg") ||
              "/images/usProfil.jpg"
            }
          />
          <div className="inline-flex flex-col justify-start items-start gap-1.5">
            <div className="justify-start text-gray-900 text-xs font-bold leading-none">
              {controller.name}
            </div>
            <div className="justify-start flex gap-1">
              <span className="text-gray-900 text-[10px] font-bold">
                
                {controller.nbFolder ?? 0} dossier
                {controller.nbFolder && controller.nbFolder > 1 ? "s" : ""}
              </span>
              <span className="text-slate-600 text-[10px] font-medium">                
                en cours
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
