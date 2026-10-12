import ContractsPages from "@/components/contracts/contractsPages";
import { ADMIN_ROUTE } from "@/constants/routes";

export default function Contracts() {
    return <ContractsPages contractFor="admin" redirection={ADMIN_ROUTE} />
}