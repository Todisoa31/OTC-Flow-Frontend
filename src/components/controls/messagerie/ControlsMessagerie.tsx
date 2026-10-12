"use client";

import { useEffect } from "react";

import CenterLayout from "@/components/layout/CenterLayout";
import ContentLayout from "@/components/layout/ContentLayout";
import { useTitle } from "@/providers/TitleProvider";

export const ControlsMessagerie = () => {
  const { setTitle } = useTitle();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setTitle("Messagerie"), []);

  return (
    <ContentLayout>
      <CenterLayout>
        {/* Placeholder for future messagerie components */}
        <div>Messagerie component will be implemented here.</div>
      </CenterLayout>
    </ContentLayout>
  );
};
