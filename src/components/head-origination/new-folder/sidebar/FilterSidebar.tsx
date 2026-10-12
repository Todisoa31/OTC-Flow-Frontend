import React from "react";

const FilterSidebar = () => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
      <div className="self-stretch h-2 justify-start text-slate-600 text-xs font-medium">
        Charge :
      </div>
      <div className="self-stretch inline-flex justify-start items-center gap-2.5">
        <div className="flex-1 px-2.5 py-1.5 bg-gray-900 rounded-[5px] flex justify-center items-center gap-2.5">
          <button className="justify-start text-white text-xs font-medium">
            Tous
          </button>
        </div>
        <div className="flex-1 px-2.5 py-1.5 rounded-[5px] flex justify-center items-center gap-2.5">
          <button className="justify-start text-slate-600 text-xs font-medium">
            Faible
          </button>
        </div>
        <div className="flex-1 px-2.5 py-1.5 rounded-[5px] flex justify-center items-center gap-2.5">
          <button className="justify-start text-slate-600 text-xs font-medium">
            Moyen
          </button>
        </div>
        <div className="flex-1 px-2.5 py-1.5 rounded-[5px] flex justify-center items-center gap-2.5">
          <button className="justify-start text-slate-600 text-xs font-medium">
            Haute
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
