import BellIcon from "../assets/icons/BellIcon"

function Notification() {
    return (
        <div className="absolute top-0 right-0 h-full inline-flex justify-start items-center gap-2.5">
            <div className="w-[300px] h-full bg-[#fefefe]/40 border-2 border-white backdrop-blur-[30px] inline-flex flex-col justify-start items-start">
                <div className="self-stretch h-[90px] p-[30px] border border-white inline-flex justify-start items-center gap-2.5">
                    <div data-svg-wrapper>
                        <BellIcon/>
                    </div>
                    <div className="relative justify-start text-[#001c56] text-sm font-bold leading-7">Notifications</div>
                </div>
                <div className="self-stretch h-[788px] p-[30px] flex flex-col justify-start items-start gap-5 overflow-auto">
                    <div className="self-stretch h-auto p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                            <div data-svg-wrapper className="relative">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.5138 5.71249L11.5447 3.04032C10.6988 2.27901 10.2759 1.89836 9.75692 1.69922L9.75 3.75008C9.75 5.51785 9.75 6.40173 10.2992 6.95091C10.8483 7.50008 11.7322 7.50008 13.5 7.50008H16.1851C15.9131 6.97191 15.4263 6.53373 14.5138 5.71249Z" fill="#101828" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 16.5H7.5C4.67157 16.5 3.25736 16.5 2.37868 15.6213C1.5 14.7426 1.5 13.3284 1.5 10.5V7.5C1.5 4.67157 1.5 3.25736 2.37868 2.37868C3.25736 1.5 4.67902 1.5 7.52234 1.5C7.97685 1.5 8.34105 1.5 8.64751 1.5125C8.63742 1.57244 8.63213 1.6336 8.63192 1.69542L8.625 3.82123C8.62493 4.64405 8.62487 5.37123 8.70368 5.95737C8.7891 6.59271 8.98523 7.22795 9.50368 7.7464C10.0221 8.26485 10.6574 8.46098 11.2927 8.5464C11.8789 8.62521 12.606 8.62515 13.4289 8.62508L13.5 8.62508H16.4681C16.5 9.02578 16.5 9.51757 16.5 10.1722V10.5C16.5 13.3284 16.5 14.7426 15.6213 15.6213C14.7426 16.5 13.3284 16.5 10.5 16.5ZM7.87371 10.8296C8.1059 11.036 8.12681 11.3915 7.92042 11.6237L5.92042 13.8737C5.81367 13.9938 5.66067 14.0625 5.5 14.0625C5.33933 14.0625 5.18633 13.9938 5.07958 13.8737L4.07958 12.7487C3.87319 12.5165 3.89411 12.161 4.1263 11.9546C4.35849 11.7482 4.71403 11.7691 4.92042 12.0013L5.5 12.6533L7.07958 10.8763C7.28597 10.6441 7.64152 10.6232 7.87371 10.8296Z" fill="#101828" />
                                </svg>
                            </div>
                            <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">Dossier validé</div>
                            <div className="relative justify-end text-[#7777a1] text-xs font-normal leading-none">30 min</div>
                        </div>
                        <div className="w-2.5 h-2.5 left-[-5px] top-[20px] absolute bg-primary-green rounded-full border-2 border-white" />
                        <div className="relative justify-start"><span className="text-[#7777a1] text-xs font-normal  leading-none">Votre dossier n°1233567 pour l’opération BAR-TH-173 a été </span><span className="text-black-secondary text-xs font-bold  leading-none">validé avec succès</span><span className="text-[#7777a1] text-xs font-normal  leading-none">.</span></div>
                    </div>
                    <div className="self-stretch h-auto p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                            <div data-svg-wrapper className="relative">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.98378 8.07112C6.17255 4.19037 7.26694 2.25 9 2.25C10.7331 2.25 11.8274 4.19037 14.0162 8.07112L14.289 8.5547C16.1078 11.7796 17.0172 13.392 16.1953 14.571C15.3734 15.75 13.3398 15.75 9.27275 15.75H8.72725C4.66017 15.75 2.62663 15.75 1.80469 14.571C0.982757 13.392 1.89218 11.7796 3.71104 8.5547L3.98378 8.07112ZM9 5.4375C9.31066 5.4375 9.5625 5.68934 9.5625 6V9.75C9.5625 10.0607 9.31066 10.3125 9 10.3125C8.68934 10.3125 8.4375 10.0607 8.4375 9.75V6C8.4375 5.68934 8.68934 5.4375 9 5.4375ZM9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z" fill="#101828" />
                                </svg>
                            </div>
                            <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">Corrections</div>
                            <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">1 j</div>
                        </div>
                        <div className="w-2.5 h-2.5 left-[-5px] top-[20px] absolute bg-primary-green rounded-full border-2 border-white" />
                        <div className="relative justify-start"><span className="text-[#7777a1] text-xs font-normal  leading-none">Des corrections sont nécessaires pour votre dossier n°1234567 RES-EC-104 : </span><span className="text-black-secondary text-xs font-bold  leading-none">facture manquante</span><span className="text-[#7777a1] text-xs font-normal  leading-none">.</span></div>
                    </div>
                    <div className="self-stretch h-auto p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                            <div data-svg-wrapper className="relative">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 9C1.5 5.46447 1.5 3.6967 2.59835 2.59835C3.6967 1.5 5.46447 1.5 9 1.5C12.5355 1.5 14.3033 1.5 15.4017 2.59835C16.5 3.6967 16.5 5.46447 16.5 9C16.5 12.5355 16.5 14.3033 15.4017 15.4017C14.3033 16.5 12.5355 16.5 9 16.5C5.46447 16.5 3.6967 16.5 2.59835 15.4017C1.5 14.3033 1.5 12.5355 1.5 9Z" fill="#101828" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9 5.4375C9.31066 5.4375 9.5625 5.68934 9.5625 6V8.767L11.2727 10.4773C11.4924 10.6969 11.4924 11.0531 11.2727 11.2727C11.0531 11.4924 10.6969 11.4924 10.4773 11.2727L8.60225 9.39775C8.49676 9.29226 8.4375 9.14918 8.4375 9V6C8.4375 5.68934 8.68934 5.4375 9 5.4375Z" fill="white" />
                                </svg>
                            </div>
                            <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">En cours de traitement</div>
                            <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">1 j</div>
                        </div>
                        <div className="w-2.5 h-2.5 left-[-5px] top-[20px] absolute bg-[#bec6d4] rounded-full border-2 border-white" />
                        <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">Votre dossier n°1234567 a été pris en charge pour analyse OCR.</div>
                    </div>
                    <div className="self-stretch h-auto p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                            <div data-svg-wrapper className="relative">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.5138 5.71249L11.5447 3.04032C10.6988 2.27901 10.2759 1.89836 9.75692 1.69922L9.75 3.75008C9.75 5.51785 9.75 6.40173 10.2992 6.95091C10.8483 7.50008 11.7322 7.50008 13.5 7.50008H16.1851C15.9131 6.97191 15.4263 6.53373 14.5138 5.71249Z" fill="#101828" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 16.5H7.5C4.67157 16.5 3.25736 16.5 2.37868 15.6213C1.5 14.7426 1.5 13.3284 1.5 10.5V7.5C1.5 4.67157 1.5 3.25736 2.37868 2.37868C3.25736 1.5 4.67902 1.5 7.52234 1.5C7.97685 1.5 8.34105 1.5 8.64751 1.5125C8.63742 1.57244 8.63213 1.6336 8.63192 1.69542L8.625 3.82123C8.62493 4.64405 8.62487 5.37123 8.70368 5.95737C8.7891 6.59271 8.98523 7.22795 9.50368 7.7464C10.0221 8.26485 10.6574 8.46098 11.2927 8.5464C11.8789 8.62521 12.606 8.62515 13.4289 8.62508L13.5 8.62508H16.4681C16.5 9.02578 16.5 9.51757 16.5 10.1722V10.5C16.5 13.3284 16.5 14.7426 15.6213 15.6213C14.7426 16.5 13.3284 16.5 10.5 16.5ZM7.87371 10.8296C8.1059 11.036 8.12681 11.3915 7.92042 11.6237L5.92042 13.8737C5.81367 13.9938 5.66067 14.0625 5.5 14.0625C5.33933 14.0625 5.18633 13.9938 5.07958 13.8737L4.07958 12.7487C3.87319 12.5165 3.89411 12.161 4.1263 11.9546C4.35849 11.7482 4.71403 11.7691 4.92042 12.0013L5.5 12.6533L7.07958 10.8763C7.28597 10.6441 7.64152 10.6232 7.87371 10.8296Z" fill="#101828" />
                                </svg>
                            </div>
                            <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">Dossier validé</div>
                            <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">2 j</div>
                        </div>
                        <div className="w-2.5 h-2.5 left-[-5px] top-[20px] absolute bg-[#bfc6d5] rounded-full border-2 border-white" />
                        <div className="relative justify-start"><span className="text-[#7777a1] text-xs font-normal  leading-none">Votre dossier n°1233567 pour l’opération BAR-TH-173 a été </span><span className="text-black-secondary text-xs font-bold  leading-none">validé avec succès</span><span className="text-[#7777a1] text-xs font-normal  leading-none">.</span></div>
                    </div>
                    <div className="self-stretch h-auto p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                            <div data-svg-wrapper className="relative">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.5138 5.71249L11.5447 3.04032C10.6988 2.27901 10.2759 1.89836 9.75692 1.69922L9.75 3.75008C9.75 5.51785 9.75 6.40173 10.2992 6.95091C10.8483 7.50008 11.7322 7.50008 13.5 7.50008H16.1851C15.9131 6.97191 15.4263 6.53373 14.5138 5.71249Z" fill="#101828" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 16.5H7.5C4.67157 16.5 3.25736 16.5 2.37868 15.6213C1.5 14.7426 1.5 13.3284 1.5 10.5V7.5C1.5 4.67157 1.5 3.25736 2.37868 2.37868C3.25736 1.5 4.67902 1.5 7.52234 1.5C7.97685 1.5 8.34105 1.5 8.64751 1.5125C8.63742 1.57244 8.63213 1.6336 8.63192 1.69542L8.625 3.82123C8.62493 4.64405 8.62487 5.37123 8.70368 5.95737C8.7891 6.59271 8.98523 7.22795 9.50368 7.7464C10.0221 8.26485 10.6574 8.46098 11.2927 8.5464C11.8789 8.62521 12.606 8.62515 13.4289 8.62508L13.5 8.62508H16.4681C16.5 9.02578 16.5 9.51757 16.5 10.1722V10.5C16.5 13.3284 16.5 14.7426 15.6213 15.6213C14.7426 16.5 13.3284 16.5 10.5 16.5ZM7.87371 10.8296C8.1059 11.036 8.12681 11.3915 7.92042 11.6237L5.92042 13.8737C5.81367 13.9938 5.66067 14.0625 5.5 14.0625C5.33933 14.0625 5.18633 13.9938 5.07958 13.8737L4.07958 12.7487C3.87319 12.5165 3.89411 12.161 4.1263 11.9546C4.35849 11.7482 4.71403 11.7691 4.92042 12.0013L5.5 12.6533L7.07958 10.8763C7.28597 10.6441 7.64152 10.6232 7.87371 10.8296Z" fill="#101828" />
                                </svg>
                            </div>
                            <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">Dossier validé</div>
                            <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">2 j</div>
                        </div>
                        <div className="w-2.5 h-2.5 left-[-5px] top-[20px] absolute bg-[#bfc6d5] rounded-full border-2 border-white" />
                        <div className="relative justify-start"><span className="text-[#7777a1] text-xs font-normal  leading-none">Votre dossier n°1233567 pour l’opération BAR-TH-173 a été </span><span className="text-black-secondary text-xs font-bold  leading-none">validé avec succès</span><span className="text-[#7777a1] text-xs font-normal  leading-none">.</span></div>
                    </div>
                    <div className="self-stretch h-auto p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                            <div data-svg-wrapper className="relative">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.98378 8.07112C6.17255 4.19037 7.26694 2.25 9 2.25C10.7331 2.25 11.8274 4.19037 14.0162 8.07112L14.289 8.5547C16.1078 11.7796 17.0172 13.392 16.1953 14.571C15.3734 15.75 13.3398 15.75 9.27275 15.75H8.72725C4.66017 15.75 2.62663 15.75 1.80469 14.571C0.982757 13.392 1.89218 11.7796 3.71104 8.5547L3.98378 8.07112ZM9 5.4375C9.31066 5.4375 9.5625 5.68934 9.5625 6V9.75C9.5625 10.0607 9.31066 10.3125 9 10.3125C8.68934 10.3125 8.4375 10.0607 8.4375 9.75V6C8.4375 5.68934 8.68934 5.4375 9 5.4375ZM9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z" fill="#101828" />
                                </svg>
                            </div>
                            <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">Corrections</div>
                            <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">3 j</div>
                        </div>
                        <div className="w-2.5 h-2.5 left-[-5px] top-[20px] absolute bg-[#bfc6d5] rounded-full border-2 border-white" />
                        <div className="relative justify-start"><span className="text-[#7777a1] text-xs font-normal  leading-none">Des corrections sont nécessaires pour votre dossier n°1234567 RES-EC-104 : </span><span className="text-black-secondary text-xs font-bold  leading-none">facture manquante</span><span className="text-[#7777a1] text-xs font-normal  leading-none">.</span></div>
                    </div>
                    <div className="self-stretch h-[83px] p-[15px] bg-white/50 rounded-[15px] cursor-pointer shadow-[4px_4px_20px_0px_rgba(0,0,0,0.05)] border border-white backdrop-blur-[30px] flex flex-col justify-start items-start gap-2.5">
                        <div className="self-stretch h-[18px] rounded-[10px] inline-flex justify-start items-center gap-[5px]">
                            <div data-svg-wrapper className="relative">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 9C1.5 5.46447 1.5 3.6967 2.59835 2.59835C3.6967 1.5 5.46447 1.5 9 1.5C12.5355 1.5 14.3033 1.5 15.4017 2.59835C16.5 3.6967 16.5 5.46447 16.5 9C16.5 12.5355 16.5 14.3033 15.4017 15.4017C14.3033 16.5 12.5355 16.5 9 16.5C5.46447 16.5 3.6967 16.5 2.59835 15.4017C1.5 14.3033 1.5 12.5355 1.5 9Z" fill="#101828" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9 5.4375C9.31066 5.4375 9.5625 5.68934 9.5625 6V8.767L11.2727 10.4773C11.4924 10.6969 11.4924 11.0531 11.2727 11.2727C11.0531 11.4924 10.6969 11.4924 10.4773 11.2727L8.60225 9.39775C8.49676 9.29226 8.4375 9.14918 8.4375 9V6C8.4375 5.68934 8.68934 5.4375 9 5.4375Z" fill="white" />
                                </svg>
                            </div>
                            <div className="relative grow justify-start text-black-secondary text-xs font-bold  leading-none">En cours de traitement</div>
                            <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">4 j</div>
                        </div>
                        <div className="w-2.5 h-2.5 left-[-5px] top-[20px] absolute bg-[#bec6d4] rounded-full border-2 border-white" />
                        <div className="relative justify-start text-[#7777a1] text-xs font-normal  leading-none">Votre dossier n°1234567 a été pris en charge pour analyse OCR.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification