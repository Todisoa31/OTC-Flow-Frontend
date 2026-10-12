import React, { useEffect, useState } from "react";
import { useStatusDosserProvider } from "@/providers/StatusDossierProvider";
import { UseReferentFileStore } from "@/stores/ReferentFileStore";
import {  MenuSwitcherType } from "@/types/general";
import { useRouter } from "next/navigation";

type Props = {
  baseUrl: string;
  folderId: number;
  fileId: number;
};
const FileMenuSwitcherMenuComponent = (props: Props) => {
  const router = useRouter();
  const { baseUrl, folderId } = props;
  const { menuSwitcher } = useStatusDosserProvider();
  const { activeMenuSwitcher, setActiveMenuSwitcher } = UseReferentFileStore();
  const [menuElement, setMenuElement] = useState<MenuSwitcherType[] | null >(null)

  useEffect(() => {
      const seen = new Set();
      const filtered = menuSwitcher.filter(item => {
        if (seen.has(item.title)) {
          return false; // déjà vu → on ignore
        }
        seen.add(item.title);
        return true; // première fois → on garde
      });
      setMenuElement(filtered);
  }, [menuSwitcher])

  if (menuSwitcher.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">Chargement des menus...</p>
    );
  }

  return (
    <>
      {menuElement && menuElement.map((menu: MenuSwitcherType, index) => (
        <button
          key={index}
          className={`text-xs font-bold ${
            menu.code === activeMenuSwitcher?.code
              ? "bg-[#65a5bf] font-bold text-white hover:bg-[#4d8398]"
              : "text-grey bg-[#646E811A] hover:bg-[#F7F7F7]"
          } py-[15px] text-center rounded-[10px] shadow-[10px]`}
          onClick={() => {
            setActiveMenuSwitcher(menu);
            router.push(`${baseUrl}/${folderId}/file-details/${menu.file_id}`);
          }}
        >
          {menu.title}
        </button>
      ))}
    </>
  );
};

export default FileMenuSwitcherMenuComponent;
