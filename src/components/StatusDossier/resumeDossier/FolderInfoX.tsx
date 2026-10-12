import React from 'react';

const FolderInfoX = ({ title, value }: { title: string; value: string }) => {
    return (
        <div className=" flex flex-col justify-center gap-2 p-[15px] rounded-[10px] bg-[#FFFFFF66]">
            <span className="text-xs font-bold text-dark-blue">{title}</span>
            <span className="text-xs font-bold text-grey font-bold break-words max-w-[250px] truncate" title={value}>{value}</span>
        </div>
    )
};

export default FolderInfoX;
