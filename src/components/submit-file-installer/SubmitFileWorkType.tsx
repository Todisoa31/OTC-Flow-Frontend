import React from 'react'

const workTypes = [
    {
        label: 'Isolation',
        active: true,
    },
    {
        label: 'Chauffage',
        active: false,
    },
    {
        label: 'Fenêtres',
        active: false,
    },
    {
        label: 'Autres travaux CEE',
        active: false,
    }
]

function SubmitFileWorkType() {
    return (
        <div className="self-stretch h-[125px] flex-col justify-start items-start gap-[15px] flex">
            <div className="text-dark-blue text-sm font-medium  leading-[18px]">Sélectionner un types de travaux :</div>
            <div className="self-stretch justify-start items-start gap-5 inline-flex">
                {workTypes.map((workType, index) => (
                    <div key={index} className={`grow shrink basis-0 h-[100px] px-[15px] bg-white rounded-[10px] justify-center items-center gap-2.5 flex ${workType.active ? 'border-2 border-primary-blue' : ''}`}>
                        <div className={`text-center ${workType.active ? 'text-primary-blue' : 'text-dark-blue'} text-base font-bold  leading-[18px]`}>{workType.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubmitFileWorkType