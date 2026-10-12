"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTitle } from "@/providers/TitleProvider";
import { useAuth } from "@/providers/AuthProvider";

import { DeleteContractApi, GetContractListWithParams, GetOverviewContract } from "@/api/contrat";
import { ContractFor, ContractListPayload, ContratListType, OverviewType } from "@/types/contratType";
import { PaginationType } from "@/types/general";

import { ADMIN_CONTRACT_ROUTE, ADMIN_ROUTE, HEAD_ORIGINATION_CONTRACT_ROUTE, HEAD_ORIGINATION_ROUTE, INSTALLER_CONTRACT_ROUTE, INSTALLER_ROUTE } from "@/constants/routes";

import TotalContractIcon from "@/assets/icons/contractsIcons/TotalContractIcon";
import ValueTotalIcon from "@/assets/icons/contractsIcons/valueTotalIcon";
import VolumeTotalIcon from "@/assets/icons/contractsIcons/volumeTotalIcon";
import ToBeCorrectedIcon from "@/assets/icons/dashboard/ToBeCorrectedIcon";
// import DeleteIcon from "@/assets/icons/DeleteIcon";

import MetricCard from "./components/metricCard";
// import Filters from "./components/filters";
import PaginationApi from "../Pagination_API";
import CenterSpinner from "../loader/CenterSpinner";
import EmptyData from "../empty/EmptyData";
import ConfirmDeleteModal from "../modal/DeleteModal";
// import Spinner from "../loader/PanelSprinner";
import GlobalFilters, { FilterType } from "../GlobalFilters";
import { useFilters } from "@/contexts/Filter/filterContext";

// --- utils
const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "";

const formatNumber = (value?: number | null, unit = "") =>
  `${(value ?? 0).toFixed(2)}${unit}`;

// --- Overview section
const OverviewSection = ({ overview, contractFor }: { overview?: OverviewType; contractFor: ContractFor }) => {
  const gridClass: Record<ContractFor, string> = {
    admin: "grid grid-cols-4 gap-4",
    head: "grid grid-cols-4 gap-4",
    installer: "grid grid-cols-3 gap-4",
  };

  return (
    <div className="p-[30px] rounded-[30px] bg-[url('/images/record-dashboard-bg.png')] bg-cover min-h-[215px] flex flex-col gap-4">
      <h3 className="text-[24px] text-white font-bold">Vue d&lsquo;ensemble</h3>
      <div className={gridClass[contractFor]}>
        <MetricCard title="Total contrats" value={`${overview?.total_contracts ?? 0}`} icon={<TotalContractIcon />} />
        <MetricCard title="Volume total" value={formatNumber(overview?.total_volume)} icon={<VolumeTotalIcon />} />
        <MetricCard title="Volume livré" value={formatNumber(overview?.total_volume_livre)} icon={<ToBeCorrectedIcon />} />
        {contractFor !== "installer" && (
          <MetricCard title="Valeur totale" value={`${overview?.total_amount ?? 0}`} icon={<ValueTotalIcon />} />
        )}
      </div>
    </div>
  );
};

// --- Table
const ContratsTable = ({
  contracts,
  loading,
  onRedirect,
}: {
  contracts: ContratListType[];
  loading: boolean;
  onRedirect: (id: number, installerId: number) => void;
}) => {

  // const pathname = usePathname();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<number | null>(null);
  const [contractList, setContractList] = useState<ContratListType[]>(contracts);

  // const [deletingContractId, setDeletingContractId] = useState<number | null>(null);


  useEffect(() => {
    setContractList(contracts);
  }, [contracts]);

  if (loading) return <CenterSpinner />;
  if (!contractList.length) return <EmptyData />;

  // const canDeleteContrat =
  //   !pathname.includes(HEAD_ORIGINATION_ROUTE) &&
  //   !pathname.includes(INSTALLER_ROUTE);

  return (
    <div className="grow">
      <table className="w-full table-fixed text-sm border-separate border-spacing-y-[10px]">
        <thead>
          <tr className="text-left text-gray-600 text-[12px]">
            {[
              "ID du contrat",
              "Nom du contrat",
              "Installateur",
              "RAI",
              "Date début",
              "Date Fin",
              "Volume total",
              "Volume livré",
              "Statut du contrat",
            ].map((header, idx) => (
              <th
                key={idx}
                className={`py-2 font-[500] ${idx === 9 ? "w-[40px] px-2" : "px-4"}`}
              >
                {header}
              </th>
            ))}

            {/* {canDeleteContrat && (
              <th className="w-[40px] px-2 py-2 font-[500]"></th>
            )} */}
          </tr>
        </thead>

        <tbody className="text-[#3A5F6E] text-[12px]">
          {contractList.map((item) => (
            <tr
              key={item.id}
              className="relative bg-[#FFFFFF66] rounded-[10px] shadow-md cursor-pointer hover:bg-[#FFFFFF99] transition-all group"
              onClick={() => onRedirect(item.id, item.installateur.id)}
            >
              {/* Contenu normal de la ligne */}
              <td className="px-4 py-2 truncate" title={item.contratID}>{item.contratID}</td>
              <td className="px-4 py-2 truncate" title={item.contrat_name}>{item.contrat_name}</td>
              <td className="flex items-center gap-2 px-4 py-2">
                <img
                  src={item.installateur.photo_profil ?? "/images/usProfil.jpg"}
                  alt="avatar"
                  className="w-[30px] h-[30px] rounded-[5px]"
                />
                {item.installateur.firstname} {item.installateur.lastname}
              </td>
              <td className="px-4 py-2 truncate" title={item.compte_oblige_nom_societe}>{item.compte_oblige_nom_societe ?? ""}</td>
              <td className="px-4 py-2">{formatDate(item.date_creation)}</td>
              <td className="px-4 py-2">{formatDate(item.date_livraison)}</td>
              <td className="px-4 py-2">{formatNumber(item.mf_volume_total_gwhc, " GWhc")}</td>
              <td className="px-4 py-2">{formatNumber(item.volume_livre, " GWhc")}</td>
              <td className="px-4 py-2">
                <span className={`p-[10px] text-[12px] rounded-[5px] ${item.status === "actif" ? "bg-[#65A5BF]" : "bg-[#FCC567]"} text-white`}>
                  {item.status === "actif" ? "Actif" : "Expiré"}
                </span>
              </td>
              {/* {canDeleteContrat && (
                <td
                  className="pr-4 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setContractToDelete(item.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  <DeleteIcon />
                </td>
              )}

              {deletingContractId === item.id && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-[10px] z-10">
                  <Spinner />
                </div>
              )} */}
            </tr>
          ))}
        </tbody>
      </table>

      {deleteModalOpen && contractToDelete !== null && (
        <ConfirmDeleteModal
          title="Supprimer ce contrat ?"
          message={
            <p>
              Voulez-vous vraiment supprimer le contrat <strong>{contractToDelete}</strong> ?
            </p>
          }
          confirmLabel="Supprimer"
          confirmColor="bg-[#f30404] hover:bg-[#f30404]"
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={async () => {
            if (contractToDelete === null) return;
            // setDeletingContractId(contractToDelete);
            setDeleteModalOpen(false);

            try {
              await DeleteContractApi(contractToDelete);
              setContractList((prev) =>
                prev.filter((c) => c.id !== contractToDelete)
              );
            } catch (error) {
              console.error("Erreur lors de la suppression :", error);
            } finally {
              // setDeletingContractId(null);
              setContractToDelete(null);
            }
          }}
        />
      )}
    </div>
  );
};

// --- Main Component
export default function ContractsPages({
  contractFor = "admin",
  redirection,
}: {
  contractFor: ContractFor;
  redirection: string;
}) {
  const { setTitle } = useTitle();
  const { user } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const { currentFilter, setFiltersForStorageKey, currentStorageKey } = useFilters();

  const [contracts, setContracts] = useState<ContratListType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ total_pages: 0, per_page: 50, page: 1, total_entries: 0 });
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewType>();

  // --- Set page title
  useEffect(() => {
    setTitle("Contrats");
  }, [setTitle]);

  // --- Payload pour l'API (ContractListPayload)
  const payload: ContractListPayload = useMemo(() => ({
    search_text: currentFilter.search_text ?? "",
    user_id: path.startsWith(INSTALLER_ROUTE) ? user?.id ?? null : null,
    contrat_type: currentFilter.type_dossier ?? "",
    status_contrat: currentFilter.status_contrat ?? "",
    per_page: currentFilter.per_page ?? 50,
    page: currentFilter.page ?? 1,
  }), [currentFilter, path, user?.id]);

  // --- Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, contractsRes] = await Promise.all([
          GetOverviewContract(),
          GetContractListWithParams(payload),
        ]);
        setOverview(overviewRes?.data);
        setContracts(contractsRes?.data.contrats);
        setPagination({
          page: contractsRes?.data?.pagination.pages,
          per_page: contractsRes?.data?.pagination.per_page,
          total_entries: contractsRes?.data?.pagination.total_entries,
          total_pages: contractsRes?.data?.pagination.total_pages,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [payload]);

  const handleRedirect = (id: number, installerId: number) => {
    const path =
      redirection === ADMIN_ROUTE
        ? `/administrator/installater/details/${installerId}/contrat/${id}?installer=${installerId}`
        : `${redirection}/${id}?installer=${installerId}`;
    router.push(path);
  };

  // --- Filtres à cacher sur cette page
  const hiddenFilters = useMemo<FilterType[]>(() => {
    const routesToHide: string[] = [
      INSTALLER_CONTRACT_ROUTE,
      HEAD_ORIGINATION_CONTRACT_ROUTE,
      ADMIN_CONTRACT_ROUTE
    ];
    return routesToHide.some(route => path?.includes(route))
      ? ["status", "date", "type", "controlleur_conformite", "role", "installater_status", "type"]
      : [];
  }, [path]);


  return (
    <div className="p-[30px] w-full flex flex-col gap-4 h-full">
      <OverviewSection overview={overview} contractFor={contractFor} />

      <GlobalFilters
        params={currentFilter}
        setParams={(newParams) => {
          const next = typeof newParams === "function" ? newParams(currentFilter) : newParams;
          setFiltersForStorageKey(currentStorageKey, next);
        }}
        hiddens={hiddenFilters}
      />

      {contracts.length ? (
        <>
          <ContratsTable contracts={contracts} loading={loading} onRedirect={handleRedirect} />
          <PaginationApi
            pagination={pagination}
            setPagination={(data) => {
              setPagination(data);
              setFiltersForStorageKey(currentStorageKey, {
                ...currentFilter,
                page: data.page,
                per_page: data.per_page,
              });
            }}
          />
        </>
      ) : (
        <EmptyData />
      )}
    </div>
  );
}
