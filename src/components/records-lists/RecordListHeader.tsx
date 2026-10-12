function RecordListHeader() {
    return (

        <div className="z-10 top-0 self-stretch px-5 pb-2.5 justify-center items-center gap-[15px] inline-flex">
            <div className="w-[20%] justify-start items-start gap-2.5 flex">
                <div className="text-black-secondary text-xs font-medium ">Date</div>
            </div>
            <div className="w-[20%] grow shrink basis-0 justify-start items-start gap-2.5 flex">
                <div className="text-black-secondary text-xs font-medium ">Nom du dossier</div>
            </div>
            <div className="w-[20%] grow shrink basis-0 justify-start items-start gap-2.5 flex">
                <div className="text-black-secondary text-xs font-medium ">Type de dossier</div>
            </div>
            <div className="w-[20%] justify-start items-start gap-2.5 flex">
                <div className="text-black-secondary text-xs font-medium ">Dernière mise à jour</div>
            </div>
            <div className="w-[20%] rounded-[10px] flex-col justify-center items-start gap-2.5">
                <div className="text-black-secondary text-xs font-medium ">Statut Administratif</div>
            </div>
        </div>
    )
}

export default RecordListHeader