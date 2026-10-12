import { useEffect, useState } from "react";
import Input from "@/components/inputs/Input";
import TeamControlleur from "./sidebar/TeamControlleur";
import DetailController from "./sidebar/DetailController";
import { getControllersRetrieved } from "@/api/user";
import { getFile } from "@/utils/getFile";
import { TeamMemberRetrieveFormated, TeamMemberRetrieveType } from "@/types/teamType";
import isEqual from "lodash.isequal";
import { ROLE_COFRAC, ROLE_CONTROLLER } from "@/constants/userConst";

type Props = {
  control: string;
}
const SidebarDossier = (props: Props) => {
  const { control } = props;
  const [filterControllers, setFilterControllers] = useState("");
  const [controllerDetail, setControllerDetail] = useState<Boolean>(false);
  const [page, setPage] = useState(1);
  const [controllers, setControllers] = useState<TeamMemberRetrieveFormated[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PER_PAGE = 5;

  const getAllControllers = async (page: number, per_page: number) => {
    console.log("tafidira ato ve? ")
    try {
      setIsFetching(true);
      const response = await getControllersRetrieved({ page, per_page, role: control === 'controlleur' ? ROLE_CONTROLLER : ROLE_COFRAC });
      const newData: TeamMemberRetrieveFormated[] = response.users.map((item: TeamMemberRetrieveType) => ({
        id: item.id,
        firstname: item.firstname,
        lastname: item.lastname,
        photo_profil: item.photo_profil != null ? getFile(item.photo_profil) : '',
        is_connected: item.is_connected,
        trated_dossier: item.charges_dossier.treated_dossier,
        assinged_dossier_count: item.charges_dossier.assigned_dossier_count,
        daily_dossier_threshold: item.daily_dossier_threshold,
      }));

      setControllers((prev) => {
        const merged = [...prev, ...newData];
        return isEqual(prev, merged) ? prev : merged;
      });

      if (newData.length < per_page) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching controllers:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getAllControllers(page, PER_PAGE);
  }, [page, control]);
  
  useEffect(() => {
    setControllers([]);
    setPage(1);
    setHasMore(true);
  }, [control]);

  useEffect(() => {
    const scrollContainer = document.getElementById("container-folder");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const bottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 100;

      if (bottom && !isFetching && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  const refreshControllers = () => {
    setControllers([]);
    setPage(1);
    setHasMore(true);
    getAllControllers(1, PER_PAGE);
  };

  const filteredControllers = controllers?.filter((ctrl) =>
    ctrl.firstname.toLowerCase().includes(filterControllers.toLowerCase())
  );

  if (controllerDetail) {
    return (
      <DetailController
        setControllerDetail={setControllerDetail}
        refreshControllers={refreshControllers}
        control={control}
      />
    );
  }

  return (
    <div className="w-[23%] self-stretch p-7 bg-white/40 border-l border-white backdrop-blur-lg inline-flex flex-col justify-start items-start gap-7 h-[calc(100vh-97px)] overflow-y-auto">
      <div className="self-stretch rounded-[10px] flex flex-col justify-start items-start gap-3.5">
        <div className="justify-start text-gray-900 text-base font-bold leading-none">Equipes</div>
        <Input
          placeholder="Rechercher"
          width=""
          height="h-[40px]"
          onChange={(value: string) => setFilterControllers(value)}
          className="text-xs text-black font-medium grow"
          value={filterControllers}
        />
      </div>
      <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-3.5">
        {filteredControllers !== undefined && (
          <TeamControlleur
            controllers={filteredControllers}
            setControllerDetail={setControllerDetail}
            fetchMore={() => setPage((p) => p + 1)}
            hasMore={hasMore}
            isFetching={isFetching}
          />
        )}
      </div>
    </div>
  );
};

export default SidebarDossier;
