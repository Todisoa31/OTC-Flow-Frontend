"use client";

import { useEffect } from "react";

import { useTitle } from "@/providers/TitleProvider";

const title = "Tous les lots";

export const Lots = () => {
  const { setTitle } = useTitle();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setTitle(title), []);
  return (
    <>
      <h2 className="w-full text-black-secondary text-2xl font-bold">{title}</h2>
      <span>Here is list of lots.</span>
    </>
  );
};
