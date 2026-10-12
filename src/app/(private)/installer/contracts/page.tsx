import ContractsPages from "@/components/contracts/contractsPages";
import { INSTALLER_CONTRACT_ROUTE } from "@/constants/routes";

export default function Contracts() {
    return (
        <ContractsPages contractFor="installer" redirection={INSTALLER_CONTRACT_ROUTE} />
    )
}