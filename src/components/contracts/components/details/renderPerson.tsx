import Spinner from "@/components/loader/PanelSprinner";
import { BlocColumn, BlocDoubleColumn, Card, InfoBlock, SectionTitle } from "./contractUI";

const hasValidData = (obj: any): boolean => {
  if (!obj || typeof obj !== "object") return false;
  return Object.values(obj).some(
    (value) => value !== null && value !== undefined && value !== ""
  );
};

export const SectionPerson = ({ title, data, loading, onEdit, onAdd }: any) => {
  if (!hasValidData(data)) return null;
  return (
    <div className="flex gap-[30px]">
      <div className="flex flex-col gap-[20px] flex-1">
        <SectionTitle title={title} onEdit={onEdit} onAdd={onAdd} />
        <Card>
          {loading ? (
            <div className="flex justify-center items-center w-full h-48"><Spinner /></div>
          ) : (
            <>
              <BlocColumn>
                <InfoBlock label="Société :" value={data[`${title.toLowerCase()}_nom_societe`] ?? "—"} />
                <InfoBlock label="Capital :" value={data[`${title.toLowerCase()}_capital`] ?? "—"} />
                <InfoBlock label="Ville :" value={data[`${title.toLowerCase()}_ville`] ?? "—"} />
                <InfoBlock label="Nom et prénom :" value={data[`${title.toLowerCase()}_prenom_nom`] ?? "—"} />
              </BlocColumn>
              <BlocDoubleColumn>
                <InfoBlock label="Type de société :" value={data[`${title.toLowerCase()}_type_societe`] ?? "—"} />
                <InfoBlock label="Adresse :" value={data[`${title.toLowerCase()}_adresse`] ?? "—"} />
                <InfoBlock label="RCS :" value={data[`${title.toLowerCase()}_numero_rcs`] ?? "—"} />
                <InfoBlock label="Fonction :" value={data[`${title.toLowerCase()}_fonction`] ?? "—"} />
              </BlocDoubleColumn>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};