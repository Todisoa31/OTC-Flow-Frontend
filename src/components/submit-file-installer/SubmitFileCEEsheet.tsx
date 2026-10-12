import React from 'react'

const CEEsheets = [
    {
        label: 'BAR-TH-173',
        active: true,
    },
    {
        label: 'RES-EC-104',
        active: false,
    }
]

function SubmitFileCEEsheet() {
    return (
        <div className="self-stretch h-[125px] flex-col justify-start items-start gap-[15px] flex">
            <div className="text-dark-blue text-sm font-medium  leading-[18px]">Choix de la fiche CEE :</div>
            <div className="self-stretch justify-start items-start gap-5 inline-flex">
                {CEEsheets.map((CEEsheet, index) => (
                    <div key={index} className={`grow shrink basis-0 h-[100px] px-[15px] bg-white rounded-[10px] justify-center items-center gap-2.5 flex ${CEEsheet.active ? 'border-2 border-primary-blue' : ''}`}>
                        <div className={`text-center ${CEEsheet.active ? 'text-primary-blue' : 'text-dark-blue'} text-base font-bold  leading-[18px]`}>{CEEsheet.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubmitFileCEEsheet