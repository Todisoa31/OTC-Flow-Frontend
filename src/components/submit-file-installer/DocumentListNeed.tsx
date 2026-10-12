import React from 'react';
type Props = {
  label: string;
  documents: string[];
}
const DocumentListNeed = (props: Props) => {
  const { label, documents } = props;
  return (
    <div>
      <div className="self-stretch h-[95px] flex-col justify-start items-start gap-[15px] flex">
            <div className="text-dark-blue text-sm font-medium  leading-[18px]">{label}</div>
            <div className="self-stretch justify-start items-start gap-[15px] inline-flex">
                {documents.map((requiredDocument, index) => (
                    <div key={index} className="px-[15px] h-[50px] bg-secondary-white/40 rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.05)] border border-white/70 backdrop-blur-[20px] justify-center items-center gap-[15px] flex">
                        <div className="text-dark-blue text-center text-sm font-medium  leading-[18px]">{requiredDocument}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default DocumentListNeed;
