"use client";

import { useState } from "react";
import CenterSpinner from "@/components/loader/CenterSpinner";
import { FolderFileType } from "@/types/folderType";
import OtherFileContainer from "../OtherFileContainer";

type Props = {
  docs: FolderFileType[];
};

export default function AutresDocuments({ docs }: Props) {

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-black text-[24px] font-bold">Autres Documents</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <OtherFileContainer docs={docs} />
      </div>
    </div>
  );
}
