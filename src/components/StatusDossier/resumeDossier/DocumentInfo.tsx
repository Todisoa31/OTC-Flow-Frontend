import DatePickerIcon from "@/assets/icons/DatePickerIcon";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import EyeIcon from "@/assets/icons/EyeIcon";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";
import { StatusesType } from "@/types/general";
import { forceDownload } from "@/utils/fileUtils";
import { getFile } from "@/utils/getFile";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  id: number;
  title: string; 
  status: StatusesType;
  status_name: string;
  date: string;
  document_name: string;
  changed?: boolean;
  file: any;
  folderId: Number;
  multifile?: boolean
};
const DocumentInfo = (props: Props) => {
  const {
    id,
    title,
    status,
    status_name,
    date,
    document_name,
    file,
    folderId,
    changed,
    multifile
  } = props;
  const pathName = usePathname();

  const router = useRouter();
  const { setFilePdfModal, filePdfModal } = useStatusDosserProvider();
  

  const getBgColorFromStatus = (status: StatusesType) => {
    switch (status) {
      case "inprocess":
        return "#9BCADC";
      case "approved":
        return "#65BFAA";
      case "corrected":
        return "#65A5BF";
      case "refused":
        return "#EC4899";
      case "tobeprocessed":
        return "#646E81";
      case "tocorrect":
        return "#FCC567";
      case "tobechecked":
        return "#646E81"
      default:
        break;
    }
  };

  const handleGoToFile = () => {
    
   !multifile && router.push(`${pathName}/file-details/${id}`);
  };

  const handleDownloadFile = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file?.file) return;
    await forceDownload(getFile(file.file), file.name);
  };

  const handlePreviewFile = () => {
    setFilePdfModal({showPdfViewer: true, file});
  }



  return (
    <div className=" flex flex-col gap-2  bg-[#FFFFFF66] p-[15px] rounded-[10px]">
      <div
        className={`flex items-center justify-between ${multifile? "":"cursor-pointer"}`}
        onClick={handleGoToFile}
      >
        <div className=" items-center flex gap-2">
          {changed && (
            <span className=" w-3 h-3 rounded-full bg-[#EC4899]"></span>
          )}
          <span className=" text-black text-[13px] font-bold">{title}</span>
        </div>
        <div
          className={`font-bold p-2 rounded-[5px] w-fit text-xs text-white`}
          style={{ backgroundColor: getBgColorFromStatus(status) }}
        >
          {status_name}
        </div>
      </div>
      <div className=" flex items-center gap-2">
        <DatePickerIcon />
        <span className="font-bold text-grey text-xs">{date}</span>
      </div>
      <div className="flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
        >
           <button
          onClick={handlePreviewFile}
          className="flex items-center gap-2 text-xs text-grey py-1 transition"
        >
          <EyeIcon active={true}/>
        </button>
          <DownloadIcon onClick={handleDownloadFile}/>
          <div className=" flex items-center gap-2" onClick={handleDownloadFile}>
            <span
              className="text-grey text-sm font-bold max-w-[250px] truncate inline-block align-middle"
              title={document_name}
            >
              {document_name}
            </span>
          </div>
        </div>
       
      </div>      
    </div>
  );
};

export default DocumentInfo;
