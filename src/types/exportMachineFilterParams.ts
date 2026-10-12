import { GetParams } from "./filterType";
import { Statuses } from "./recordType";

export type ExportMachineFilterParams = GetParams & {
  start_date?: string;
  end_date?: string;
  search_text?: string;
  status?: Statuses;
  type_dossier?: string;
};
