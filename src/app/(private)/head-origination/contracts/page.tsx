import ContractsPages from "@/components/contracts/contractsPages";
import { ADMIN_CONTRACT_ROUTE, HEAD_ORIGINATION_CONTRACT_ROUTE } from "@/constants/routes";

export default function Contracts() {
    return <ContractsPages contractFor="head" redirection={HEAD_ORIGINATION_CONTRACT_ROUTE} />
}