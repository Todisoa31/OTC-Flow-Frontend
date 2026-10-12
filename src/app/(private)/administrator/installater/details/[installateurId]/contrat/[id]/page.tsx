import DetailContratPage from "@/components/administrator/installater/components/installaterDetails/contratDetails/contratDetailPages"
import { AvenantSelectionProvider } from "@/contexts/Avenant/AvenantSelectionContext"

export default function Installateur() {
    return (
        <AvenantSelectionProvider>
            <DetailContratPage />
        </AvenantSelectionProvider> 
    )
}