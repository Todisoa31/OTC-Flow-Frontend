import HistoriqueDetailUser from "./components/historique";
import OverViewInheader from "./components/header";
import UpdateAccount from "./components/updateAccount";

export default function UserProfilPages() {
    return (
        <div className=" flex w-full ">
            <div className=" w-[75%] h-[calc(100vh-95px)] overflow-y-auto px-8 py-8 ">
                <OverViewInheader/>
                <UpdateAccount/>
            </div>
            <div className=" w-[25%] border h-[calc(100vh-95px)] overflow-y-auto ">
                <HistoriqueDetailUser/>
            </div>
        </div>
    )
};