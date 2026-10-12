import React, { useEffect, useRef } from "react";
import TeamControlleurItem from "./TeamControlleurItem";
import { TeamMemberRetrieveFormated } from "@/types/teamType";
import CenterSpinner from "@/components/loader/CenterSpinner";

type Props = {
  controllers: TeamMemberRetrieveFormated[];
  setControllerDetail: React.Dispatch<React.SetStateAction<Boolean>>;
  fetchMore: () => void;
  hasMore: boolean;
  isFetching: boolean;
};

const TeamControlleur = ({
  controllers,
  setControllerDetail,
  fetchMore,
  hasMore,
  isFetching,
}: Props) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || isFetching) return;

    const scrollContainer = document.getElementById("container-folder");
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      {
        threshold: 1.0,
        root: scrollContainer, // 👈 très important ici
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isFetching, fetchMore]);

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {controllers && controllers.length > 0 ? (
        controllers.map((controller) => (
          <TeamControlleurItem
            key={controller.id}
            controller={controller}
            setControllerDetail={setControllerDetail}
          />
        ))
      ) : (
        <div className="text-gray-500 text-xs font-medium">
          Aucun contrôleur trouvé.
        </div>
      )}

      {hasMore && (
        <div
          ref={observerRef}
          className="text-center text-sm py-2 text-gray-900 text-bold"
        >
          <CenterSpinner/>
        </div>
      )}
      {/* {!hasMore && controllers?.length > 0 && (
        <div className="text-center text-xs text-gray-900 py-2 text-bold">
          Tous les contrôleurs sont chargés.
        </div>
      )} */}
    </div>
  );
};

export default TeamControlleur;
