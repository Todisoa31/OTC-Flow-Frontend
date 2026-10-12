import { UseDetailFolderSideStore } from "@/stores/DetailFolderSideStore";
import React from "react";

const SwitchButtonHeadDetail = () => {
  const { swicther, selectSwitcher, selectChat, setSelectChat } =
    UseDetailFolderSideStore();
  return (
    <div className="py-[15px] px-[30px] flex items-center justify-between">
      <button
        className={`text-xs rounded-[10px] w-[48%] p-2 font-bold ${
          swicther === "historique"
            ? "bg-black  text-white "
            : "bg-transparent text-black"
        } `}
        onClick={() => selectSwitcher("historique")}
      >
        Historique
      </button>
      <button
        className={`text-xs rounded-[10px] w-[48%] p-2 font-bold  ${
          swicther === "conversation"
            ? "bg-black  text-white "
            : "bg-transparent text-black"
        }`}
        onClick={() => selectSwitcher("conversation")}
      >
        Conversation
      </button>
    </div>
  );
};

export default SwitchButtonHeadDetail;
