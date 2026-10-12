import React from 'react';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import DangerCircleIcon from '@/assets/icons/DangerCircleIcon';

export type Item = {
    title: string;
    value: string;
};

export type Section = {
    title: string;
    icon: React.JSX.Element
    items: Array<Item & { isSubmitted?: File | null }>;
};

type Props = {
    data: Section;
}

function SubmitFileStepFourDetail(props: Props) {
    const { data } = props;
    return (
        <div className="grow shrink basis-0 h-auto p-5 bg-white/50 rounded-[15px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.05)] border border-white/90 backdrop-blur-[30px] justify-start items-start gap-5 flex overflow-hidden">
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-[20px] inline-flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="grow shrink basis-0 text-black-secondary text-lg font-bold leading-[18px]">{data.title}</div>
                </div>
                {data.items.map((item, index) => (
                    <div key={index} className="flex-col justify-start items-start gap-[5px] flex">
                        <div className="text-dark-blue text-sm font-medium leading-[18px]">{item.title}</div>
                        <div className='inline-flex gap-2 items-center'>
                            {!item.title && (
                                !item.isSubmitted ? <DangerCircleIcon/> : <CheckCircleIcon />
                            )}
                            <div className="text-black-secondary text-sm font-bold leading-[18px] break-words w-full">{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div data-svg-wrapper className="relative">
            {data.icon}
            </div>
        </div>
    )
}

export default SubmitFileStepFourDetail