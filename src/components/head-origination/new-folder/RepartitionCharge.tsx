"use client";
import { useTitle } from "@/providers/TitleProvider";
import { useEffect, useState } from "react";
import RepartitionFilters from "./RepartitionFilter";
import ListDossierRepartition from "./ListDossierRepartition";
import { DossierType } from "@/types/repartitionChargeType";
import isEqual from "lodash.isequal";
import SidebarDossier from "./SidebarDossier";
import { useFilter } from "@/providers/FilterProvider";
import { useTeamMember } from "@/providers/TeamProvider";
import CenterSpinner from "@/components/loader/CenterSpinner";
import { GetFolders } from "@/api/folderApi";
import { GlobalParamsType } from "@/types/folderType";
import PaginationApi from "@/components/Pagination_API";
import { PaginationType } from "@/types/general";

const RepartitionCharge = () => {
  const { setTitle } = useTitle();
  const { filters } = useFilter();
  const [totalPages, setTotalPages] = useState(0);
  const [control, setControl] = useState('controlleur');
  const [loading, setLoading] = useState(false);
  const [loadingFolder, setLoadingFolder] = useState(false);
  const { affectAssign, setAffectAssign, listDossier, setListDossier } = useTeamMember();
  const [paginationFolder, setPaginationFolder] = useState<PaginationType>({
    total_pages: 0,
    per_page: 10,
    page: 1,
    total_entries: 0
  });
  const [params, setParams] = useState<GlobalParamsType>({
    type_dossier: "",
    installateur: null,
    start_date: "",
    search_text: "",
    per_page: paginationFolder.per_page,
    page: 1,
  });

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
     status: control === 'controlleur' ? 'inprocess,corrected,tocorrect,tobeprocessed' : 'approved,in_control,statisfactory,unstatisfactory,service_request',
    }));
  }, [control])


  const getFodlers = async () => {
    try {
      setLoadingFolder(true);

      const cleanParams = {
        ...params,
        installateur: params.installateur ? null : params.installateur,
      };

      const res = await GetFolders(cleanParams);

      setPaginationFolder({
        page: res?.pagination.pages,
        per_page: res?.pagination.per_page,
        total_entries: res?.pagination.total_entries,
        total_pages: res?.pagination.total_pages,
      });

      setTotalPages(res.pagination.total_pages);

      setListDossier((prev) => {
        const newData = res.data.map((dossier: DossierType) => ({
          ...dossier,
          checked: false,
        }));
        const isSame = isEqual(prev, newData);
        return isSame ? prev : newData;
      });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoadingFolder(false);
      setAffectAssign(false);
    }
  }

  useEffect(() => {
    setTitle("Répartition Charge");
  }, []);


  useEffect(() => {
    getFodlers();
  }, [params, affectAssign, paginationFolder.page])

  if (loading) {
    return <CenterSpinner center />;
  }

  return (
    <div className="flex">
      <div className="self-stretch flex p-[30px] flex-col justify-between items-start gap-[30px] grow overflow-hidden h-[90vh]">
        <div className="grow self-stretch flex-col justify-start items-start gap-[30px] flex">
          <div className="self-stretch justify-start items-center flex-col">
            <div className="grow mb-5 shrink basis-0 text-black-secondary text-2xl font-bold flex gap-5">
              <button  onClick={() => setControl('controlleur')} className={`h-10 px-5 ${control === 'controlleur' ? 'bg-gray-900/10 cursor-not-allowed':'bg-gray-900 '} rounded-[10px] inline-flex justify-center items-center gap-2.5`}>
                <div className={`justify-start ${control === 'controlleur' ? 'text-gray-900':'text-white'}  text-sm font-bold leading-none`}>Nouveaux dossiers</div>
              </button>
              
              <button  onClick={() => setControl('conformite')} className={`h-10 px-5 ${control === 'controlleur' ?'bg-gray-900':'bg-gray-900/10 cursor-not-allowed'}  rounded-[10px] inline-flex justify-center items-center gap-2.5`}>
                <div className={`justify-start ${control === 'controlleur' ? 'text-white':'text-gray-900'} text-sm font-bold leading-none`}>Contrôle de conformité</div>
              </button>
            </div>
            <RepartitionFilters setParams={setParams} params={params} />
          </div>
          <ListDossierRepartition listDossier={listDossier} loading={loadingFolder} control={control}/>
        </div>
        <PaginationApi
          pagination={paginationFolder}
          setPagination={(data) => {
            setPaginationFolder(data);
            setParams({ ...params, page: data.page, per_page: data.per_page });
          }}
        />
      </div>
      <SidebarDossier control={control}/>
    </div>
  );
};

export default RepartitionCharge;
