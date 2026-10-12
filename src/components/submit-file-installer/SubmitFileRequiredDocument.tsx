import { FolderTypes } from "@/types/recordType";
import DocumentListNeed from "./DocumentListNeed";


type Props = {
    folderTypes: FolderTypes | null;
    marketType?: "BtoB" | "BtoC";

}
function SubmitFileRequiredDocument(props: Props) {
    const {folderTypes, marketType} = props;
    
    if(!folderTypes) return null;

     const requiredDocuments = folderTypes.getRequiredDocuments && marketType
    ? folderTypes.getRequiredDocuments(marketType)
    : folderTypes.requiredDocuments || [];


  const optionalDocuments = folderTypes.optionalDocuments || [];
    
    return (
      <>
        <DocumentListNeed label="Documents requis :" documents={requiredDocuments} />
        {
          optionalDocuments.length > 0 && (<DocumentListNeed label="Documents facultatifs :" documents={optionalDocuments} />)
        }
      </>
    )
}

export default SubmitFileRequiredDocument